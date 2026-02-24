import { Effect, Layer, Schema, pipe } from "effect"
import { Option } from "effect"
import {
  Account,
  Entry,
  Transaction,
  Ledger,
  Bookkeeping,
  FileExporter,
  storage,
  parseLedger,
  detectConflicts,
  filterNewTransactions,
  renumberTransactions,
  formatBreakdown,
  computeAccountBalances,
  computeBankTransactions,
} from "~/lib/ledger"
import type { LedgerMetadata } from "~/lib/ledger"

const AccountId = Schema.String.pipe(Schema.brand("AccountId"))
const TransactionId = Schema.String.pipe(Schema.brand("TransactionId"))
const Money = Schema.Number.pipe(Schema.brand("Money"))

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
  Account.make({ id: AccountId.make(id), name: "Bank Account", type: "asset", description: Option.some(`Account: ${accountNumber}`) })

const createIncomeAccount = (id: string) =>
  Account.make({ id: AccountId.make(id), name: "Income", type: "revenue", description: Option.some("Income and deposits") })

const createExpenseAccount = (id: string) =>
  Account.make({ id: AccountId.make(id), name: "Expenses", type: "expense", description: Option.some("Withdrawals and expenses") })

const createDepositEntries = (bankId: string, incomeId: string, amount: number) => amount > 0 ? [
  Entry.make({ accountId: AccountId.make(bankId), type: "debit", amount: Money.make(amount) }),
  Entry.make({ accountId: AccountId.make(incomeId), type: "credit", amount: Money.make(amount) }),
] : []

const createWithdrawalEntries = (bankId: string, expenseId: string, amount: number) => amount > 0 ? [
  Entry.make({ accountId: AccountId.make(expenseId), type: "debit", amount: Money.make(amount) }),
  Entry.make({ accountId: AccountId.make(bankId), type: "credit", amount: Money.make(amount) }),
] : []

const processTransaction = (bankId: string, incomeId: string, expenseId: string) => (t: ParsedStatementTransaction, i: number) => {
  const entries = [
    ...createDepositEntries(bankId, incomeId, t.deposit ?? 0),
    ...createWithdrawalEntries(bankId, expenseId, t.withdrawal ?? 0),
  ]
  
  if (entries.length === 0) return null
  
  return {
    transaction: Transaction.make({
      id: TransactionId.make(`txn-${String(i + 1).padStart(4, "0")}`),
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
  const error = ref<string | null>(null)

  const appLayer = Bookkeeping.layer.pipe(
    Layer.provideMerge(FileExporter.layer),
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

  const loadLedger = async () => {
    isLoading.value = true
    error.value = null

    const result = await pipe(
      Effect.gen(function* () {
        const ledgerData = yield* storage.getLedger()
        const meta = yield* storage.getMetadata()
        
        if (!ledgerData) {
          return null
        }
        
        const content = new TextDecoder().decode(ledgerData)
        const parsed = yield* parseLedger(content)
        
        const accounts = parsed.accounts.map(a => 
          Account.make({
            id: AccountId.make(a.id),
            name: a.name,
            type: a.type,
            description: a.description ? Option.some(a.description) : Option.none(),
          })
        )
        
        const transactions = parsed.transactions.map(t =>
          Transaction.make({
            id: TransactionId.make(t.id),
            date: parseDate(t.date),
            description: t.description,
            entries: t.entries.map(e => 
              Entry.make({
                accountId: AccountId.make(e.accountId),
                type: e.type,
                amount: Money.make(e.amount),
              })
            ),
          })
        )
        
        return {
          ledger: Ledger.make({ accounts, transactions }),
          metadata: meta,
        }
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: (data) => {
          if (data) {
            ledger.value = data.ledger
            metadata.value = data.metadata
          }
          return data
        },
        onFailure: (err) => {
          error.value = String(err)
          return null
        },
      }),
      Effect.runPromise
    )

    isLoading.value = false
    return result
  }

  const importStatement = async (statement: ParsedStatement) => {
    isLoading.value = true
    error.value = null

    const result = await pipe(
      Effect.gen(function* () {
        const bookkeeping = yield* Bookkeeping
        const exporter = yield* FileExporter

        const { ledger: newLedger, totalDeposits, totalWithdrawals } = processStatement(statement)
        const validated = yield* bookkeeping.validateLedger(newLedger)
        
        let mergedLedger: Ledger
        let openingBalance = statement.openingBalance
        
        if (ledger.value) {
          const existingParsed = {
            id: "existing",
            date: "",
            description: "",
            entries: [],
          }
          
          const incomingTransactions = ledger.value.transactions.map(t => ({
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
          
          const conflicts = detectConflicts(incomingTransactions, currentTransactions)
          
          let mergedTransactions
          if (conflicts.length > 0) {
            const newOnly = filterNewTransactions(incomingTransactions, currentTransactions)
            mergedTransactions = renumberTransactions([...incomingTransactions, ...newOnly])
          } else {
            mergedTransactions = renumberTransactions([...incomingTransactions, ...currentTransactions])
          }
          
          mergedLedger = Ledger.make({
            accounts: validated.accounts,
            transactions: mergedTransactions.map(t =>
              Transaction.make({
                id: TransactionId.make(t.id),
                date: parseDate(t.date),
                description: t.description,
                entries: t.entries.map(e =>
                  Entry.make({
                    accountId: AccountId.make(e.accountId),
                    type: e.type,
                    amount: Money.make(e.amount),
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
        const totalAdditions = bankTxns.filter(t => t.isAddition).reduce((s, t) => s + t.amount, 0)
        const totalDeductions = bankTxns.filter(t => !t.isAddition).reduce((s, t) => s + t.amount, 0)
        const closingBalance = openingBalance + totalAdditions - totalDeductions
        
        const exportResult = yield* exporter.exportLedger(validatedMerged, {
          source: "import",
          accountNumber: statement.accountNumber,
          openingBalance,
        })
        
        yield* storage.setLedger(exportResult.compressed)
        yield* storage.setMetadata(exportResult.metadata)
        
        return {
          ledger: validatedMerged,
          metadata: exportResult.metadata,
        }
      }),
      Effect.provide(appLayer),
      Effect.match({
        onSuccess: (data) => {
          ledger.value = data?.ledger ?? null
          metadata.value = data?.metadata ?? null
          return data
        },
        onFailure: (err) => {
          error.value = String(err)
          return null
        },
      }),
      Effect.runPromise
    )

    isLoading.value = false
    return result
  }

  const exportLedger = async (format: "txt" | "gzip" | "json" = "json") => {
    if (!ledger.value) return null

    const currentLedger = ledger.value
    const currentMetadata = metadata.value

    return pipe(
      Effect.gen(function* () {
        const exporter = yield* FileExporter
        
        if (format === "json") {
          return exporter.exportToJson(currentLedger)
        }
        
        const result = yield* exporter.exportLedger(currentLedger, {
          source: currentMetadata?.source ?? "export",
          accountNumber: currentMetadata?.accountNumber ?? "",
          openingBalance: currentMetadata?.openingBalance ?? 0,
        })
        
        return format === "gzip" 
          ? new Blob([result.compressed as unknown as BlobPart], { type: "application/gzip" })
          : result.content
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
    await Effect.runPromise(storage.deleteLedger())
    ledger.value = null
    metadata.value = null
    isLoading.value = false
  }

  return {
    ledger,
    metadata,
    isLoading,
    error,
    loadLedger,
    importStatement,
    exportLedger,
    getBreakdown,
    getAccountBalances,
    getBankTransactions,
    clearLedger,
  }
}
