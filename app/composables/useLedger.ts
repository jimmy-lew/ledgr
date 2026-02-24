import { Effect, Layer, pipe } from "effect"
import { Option } from "effect"
import {
  Account,
  Entry,
  Transaction,
  Ledger,
  Bookkeeping,
  FileExporter,
  LedgerRepository,
  makeAccountId,
  makeTransactionId,
  makeMoney,
  parseLedger,
  detectConflicts,
  filterNewTransactions,
  renumberTransactions,
  formatBreakdown,
  computeAccountBalances,
  computeBankTransactions,
} from "~/lib/ledger"
import type { LedgerMetadata } from "~/lib/ledger"

export interface ParsedStatementTransaction {
  date: string
  type: string
  description: string
  withdrawal: number | null
  deposit: number | null
  balance: number
}

export interface ParsedStatement {
  accountNumber: string
  openingBalance: number
  closingBalance: number
  transactions: ParsedStatementTransaction[]
}

const parseDate = (dateStr: string): Date => {
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/").map((p) => parseInt(p ?? "0", 10))
    const day = parts[0] ?? 0
    const month = parts[1] ?? 0
    const year = parts[2] ?? 0
    return new Date(Date.UTC(year, month - 1, day))
  }
  const [year, month, day] = dateStr.split("-").map((p) => parseInt(p ?? "0", 10))
  return new Date(Date.UTC(year!, month! - 1, day!))
}

const createBankAccount = (id: string, accountNumber: string) =>
  Account.make({ id: makeAccountId(id), name: "Bank Account", type: "asset", description: Option.some(`Account: ${accountNumber}`) })

const createIncomeAccount = (id: string) =>
  Account.make({ id: makeAccountId(id), name: "Income", type: "revenue", description: Option.some("Income and deposits") })

const createExpenseAccount = (id: string) =>
  Account.make({ id: makeAccountId(id), name: "Expenses", type: "expense", description: Option.some("Withdrawals and expenses") })

const createDepositEntries = (bankId: string, incomeId: string, amount: number) => amount > 0 ? [
  Entry.make({ accountId: makeAccountId(bankId), type: "debit", amount: makeMoney(amount) }),
  Entry.make({ accountId: makeAccountId(incomeId), type: "credit", amount: makeMoney(amount) }),
] : []

const createWithdrawalEntries = (bankId: string, expenseId: string, amount: number) => amount > 0 ? [
  Entry.make({ accountId: makeAccountId(expenseId), type: "debit", amount: makeMoney(amount) }),
  Entry.make({ accountId: makeAccountId(bankId), type: "credit", amount: makeMoney(amount) }),
] : []

const processTransaction = (bankId: string, incomeId: string, expenseId: string) => (t: ParsedStatementTransaction, i: number) => {
  const entries = [
    ...createDepositEntries(bankId, incomeId, t.deposit ?? 0),
    ...createWithdrawalEntries(bankId, expenseId, t.withdrawal ?? 0),
  ]
  
  if (entries.length === 0) return null
  
  return {
    transaction: Transaction.make({
      id: makeTransactionId(`txn-${String(i + 1).padStart(4, "0")}`),
      description: `[${t.type}] ${t.description || ""}`,
      date: parseDate(t.date),
      entries,
    }),
    deposit: t.deposit ?? 0,
    withdrawal: t.withdrawal ?? 0,
  }
}

export function useLedger() {
  const ledger = ref<Ledger | null>(null)
  const metadata = ref<LedgerMetadata | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const error = ref<string | null>(null)

  const appLayer = Bookkeeping.layer.pipe(
    Layer.provideMerge(FileExporter.layer),
    Layer.provideMerge(LedgerRepository.layer),
  )

  const processStatement = (
    statement: ParsedStatement,
    bankAccountId: string = "acc-bank",
    incomeAccountId: string = "acc-income",
    expenseAccountId: string = "acc-expenses"
  ) => {
    const accounts = [
      createBankAccount(bankAccountId, statement.accountNumber),
      createIncomeAccount(incomeAccountId),
      createExpenseAccount(expenseAccountId),
    ]

    const processed = statement.transactions
      .map(processTransaction(bankAccountId, incomeAccountId, expenseAccountId))
      .filter((t): t is NonNullable<typeof t> => t !== null)

    return {
      ledger: Ledger.make({ accounts, transactions: processed.map((t) => t.transaction) }),
      totalDeposits: processed.reduce((s, t) => s + t.deposit, 0),
      totalWithdrawals: processed.reduce((s, t) => s + t.withdrawal, 0),
    }
  }

  const initialize = async () => {
    if (isInitialized.value) return
    
    isLoading.value = true
    error.value = null

    await pipe(
      Effect.gen(function* () {
        const repo = yield* LedgerRepository
        yield* repo.initialize()
        isInitialized.value = true
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: () => {},
        onFailure: (err) => {
          error.value = String(err)
        },
      }),
      Effect.runPromise
    )

    isLoading.value = false
  }

  const loadLedger = async () => {
    if (!isInitialized.value) {
      await initialize()
    }
    
    isLoading.value = true
    error.value = null

    await pipe(
      Effect.gen(function* () {
        const repo = yield* LedgerRepository
        const loadedLedger = yield* repo.getLedger()
        const loadedMetadata = yield* repo.getMetadata()
        
        ledger.value = loadedLedger
        metadata.value = loadedMetadata
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: () => {},
        onFailure: (err) => {
          error.value = String(err)
        },
      }),
      Effect.runPromise
    )

    isLoading.value = false
    return ledger.value
  }

  const importStatement = async (statement: ParsedStatement) => {
    if (!isInitialized.value) {
      await initialize()
    }
    
    isLoading.value = true
    error.value = null

    await pipe(
      Effect.gen(function* () {
        const bookkeeping = yield* Bookkeeping
        const exporter = yield* FileExporter
        const repo = yield* LedgerRepository

        const { ledger: newLedger, totalAdditions, totalDeductions } = processStatement(statement)
        const validated = yield* bookkeeping.validateLedger(newLedger)
        
        let mergedLedger: Ledger
        
        if (ledger.value && ledger.value.transactions.length > 0) {
          const existingTransactions = ledger.value.transactions.map(t => ({
            id: t.id,
            date: t.date.toISOString().split("T")[0]!,
            description: t.description,
            entries: t.entries.map(e => ({ type: e.type, accountId: e.accountId, amount: e.amount })),
          }))
          
          const currentTransactions = validated.transactions.map(t => ({
            id: t.id,
            date: t.date.toISOString().split("T")[0]!,
            description: t.description,
            entries: t.entries.map(e => ({ type: e.type, accountId: e.accountId, amount: e.amount })),
          }))
          
          const conflicts = detectConflicts(existingTransactions, currentTransactions)
          
          let mergedTransactions
          if (conflicts.length > 0) {
            const newOnly = filterNewTransactions(existingTransactions, currentTransactions)
            mergedTransactions = renumberTransactions([...existingTransactions, ...newOnly])
          } else {
            mergedTransactions = renumberTransactions([...existingTransactions, ...currentTransactions])
          }
          
          mergedLedger = Ledger.make({
            accounts: validated.accounts,
            transactions: mergedTransactions.map(t =>
              Transaction.make({
                id: makeTransactionId(t.id),
                date: parseDate(t.date),
                description: t.description,
                entries: t.entries.map(e =>
                  Entry.make({
                    accountId: makeAccountId(e.accountId),
                    type: e.type,
                    amount: makeMoney(e.amount),
                  })
                ),
              })
            ),
          })
        } else {
          mergedLedger = validated
        }
        
        const validatedMerged = yield* bookkeeping.validateLedger(mergedLedger)
        
        const bankTxns = mergedLedger.transactions.flatMap(t =>
          t.entries.filter(e => e.accountId === "acc-bank").map(e => ({
            amount: e.amount,
            isAddition: e.type === "debit",
          }))
        )
        const additions = bankTxns.filter(t => t.isAddition).reduce((s, t) => s + t.amount, 0)
        const deductions = bankTxns.filter(t => !t.isAddition).reduce((s, t) => s + t.amount, 0)
        
        const exportResult = yield* exporter.exportLedger(validatedMerged, {
          source: "import",
          accountNumber: statement.accountNumber,
          openingBalance: statement.openingBalance,
        })
        
        yield* repo.saveLedger(validatedMerged)
        yield* repo.saveMetadata(exportResult.metadata)
        
        ledger.value = validatedMerged
        metadata.value = exportResult.metadata
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: () => {},
        onFailure: (err) => {
          error.value = String(err)
        },
      }),
      Effect.runPromise
    )

    isLoading.value = false
    return ledger.value
  }

  const exportToLedgerFile = async (): Promise<string | null> => {
    if (!ledger.value) return null

    return pipe(
      Effect.gen(function* () {
        const exporter = yield* FileExporter
        
        const result = yield* exporter.exportLedger(ledger.value!, {
          source: metadata.value?.source ?? "export",
          accountNumber: metadata.value?.accountNumber ?? "",
          openingBalance: metadata.value?.openingBalance ?? 0,
        })
        
        return result.content
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: (data) => data,
        onFailure: (err) => {
          error.value = String(err)
          return null
        },
      }),
      Effect.runPromise
    )
  }

  const exportToJson = async (): Promise<string | null> => {
    if (!ledger.value) return null

    return pipe(
      Effect.gen(function* () {
        const exporter = yield* FileExporter
        return exporter.exportToJson(ledger.value!)
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: (data) => data,
        onFailure: (err) => {
          error.value = String(err)
          return null
        },
      }),
      Effect.runPromise
    )
  }

  const exportToGzip = async (): Promise<Blob | null> => {
    if (!ledger.value) return null

    return pipe(
      Effect.gen(function* () {
        const exporter = yield* FileExporter
        
        const result = yield* exporter.exportLedger(ledger.value, {
          source: metadata.value?.source ?? "export",
          accountNumber: metadata.value?.accountNumber ?? "",
          openingBalance: metadata.value?.openingBalance ?? 0,
        })
        
        return new Blob([result.compressed as unknown as BlobPart], { type: "application/gzip" })
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: (data) => data,
        onFailure: (err) => {
          error.value = String(err)
          return null
        },
      }),
      Effect.runPromise
    )
  }

  const getBreakdown = (): string => {
    if (!ledger.value) return ""
    return formatBreakdown(ledger.value, metadata.value?.openingBalance)
  }

  const getAccountBalances = () => {
    if (!ledger.value) return []
    return computeAccountBalances(ledger.value)
  }

  const getBankTransactions = () => {
    if (!ledger.value) return []
    return computeBankTransactions(ledger.value)
  }

  const clearLedger = async () => {
    isLoading.value = true
    
    await pipe(
      Effect.gen(function* () {
        const repo = yield* LedgerRepository
        yield* repo.clearAll()
      }),
      Effect.provide(appLayer),
      Effect.runPromise
    )
    
    ledger.value = null
    metadata.value = null
    isLoading.value = false
  }

  return {
    ledger,
    metadata,
    isLoading,
    isInitialized,
    error,
    initialize,
    loadLedger,
    importStatement,
    exportToLedgerFile,
    exportToJson,
    exportToGzip,
    getBreakdown,
    getAccountBalances,
    getBankTransactions,
    clearLedger,
  }
}
