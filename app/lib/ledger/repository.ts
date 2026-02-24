import { Effect, Layer, Schema, Context } from "effect"
import { Option } from "effect"
import {
  Account,
  Entry,
  Transaction,
  Ledger,
  makeAccountId,
  makeTransactionId,
  makeMoney,
} from "./domain.js"
import { database, type AccountRow, type TransactionRow, type EntryRow } from "./database.js"
import type { LedgerMetadata } from "./export.js"
import { DatabaseError } from "./database.js"

const DatabaseErrorId = Schema.String.pipe(Schema.brand("DatabaseErrorId"))

export class RepositoryError extends Schema.TaggedClass<RepositoryError>()(
  "RepositoryError",
  { id: DatabaseErrorId, message: Schema.String }
) {}

const parseDate = (dateStr: string): Date => new Date(dateStr)

const rowToAccount = (row: AccountRow): Account =>
  Account.make({
    id: makeAccountId(row.id),
    name: row.name,
    type: row.type,
    description: row.description ? Option.some(row.description) : Option.none(),
  })

const rowToTransaction = (row: TransactionRow, entries: EntryRow[]): Transaction => {
  return Transaction.make({
    id: makeTransactionId(row.id),
    description: row.description,
    date: parseDate(row.date),
    entries: entries.map((e) =>
      Entry.make({
        accountId: makeAccountId(e.account_id),
        type: e.type,
        amount: makeMoney(e.amount),
      })
    ),
  })
}

const mapError = (e: DatabaseError): RepositoryError =>
  RepositoryError.make({ id: DatabaseErrorId.make(crypto.randomUUID()), message: e.message })

class LedgerRepository extends Context.Tag("@app/LedgerRepository")<
  LedgerRepository,
  {
    readonly initialize: () => Effect.Effect<void, RepositoryError>
    readonly close: () => Effect.Effect<void, RepositoryError>
    readonly getLedger: () => Effect.Effect<Ledger, RepositoryError>
    readonly getAccounts: () => Effect.Effect<Account[], RepositoryError>
    readonly getTransactions: () => Effect.Effect<Transaction[], RepositoryError>
    readonly saveLedger: (ledger: Ledger) => Effect.Effect<void, RepositoryError>
    readonly saveAccount: (account: Account) => Effect.Effect<void, RepositoryError>
    readonly saveTransaction: (transaction: Transaction) => Effect.Effect<void, RepositoryError>
    readonly deleteTransaction: (id: string) => Effect.Effect<void, RepositoryError>
    readonly getMetadata: () => Effect.Effect<LedgerMetadata | null, RepositoryError>
    readonly saveMetadata: (metadata: LedgerMetadata) => Effect.Effect<void, RepositoryError>
    readonly clearAll: () => Effect.Effect<void, RepositoryError>
  }
>() {
  static readonly layer = Layer.effect(
    LedgerRepository,
    Effect.gen(function* () {
      const initialize = (): Effect.Effect<void, RepositoryError> =>
        database.initialize().pipe(Effect.mapError(mapError))

      const close = (): Effect.Effect<void, RepositoryError> =>
        database.close().pipe(Effect.mapError(mapError))

      const getAccounts = (): Effect.Effect<Account[], RepositoryError> =>
        Effect.gen(function* () {
          const rows = yield* database.getAccounts().pipe(Effect.mapError(mapError))
          return rows.map(rowToAccount)
        })

      const getTransactions = (): Effect.Effect<Transaction[], RepositoryError> =>
        Effect.gen(function* () {
          const txRows = yield* database.getTransactions().pipe(Effect.mapError(mapError))
          const entries = yield* database.getEntries().pipe(Effect.mapError(mapError))
          
          return txRows.map((txRow) => {
            const txEntries = entries.filter((e) => e.transaction_id === txRow.id)
            return rowToTransaction(txRow, txEntries)
          })
        })

      const getLedger = (): Effect.Effect<Ledger, RepositoryError> =>
        Effect.gen(function* () {
          const accounts = yield* getAccounts()
          const transactions = yield* getTransactions()
          return Ledger.make({ accounts, transactions })
        })

      const saveAccount = (account: Account): Effect.Effect<void, RepositoryError> =>
        database.saveAccount({
          id: account.id,
          name: account.name,
          type: account.type,
          description: account.description._tag === "Some" 
            ? account.description.value 
            : null,
        }).pipe(Effect.mapError(mapError))

      const saveTransaction = (transaction: Transaction): Effect.Effect<void, RepositoryError> =>
        Effect.gen(function* () {
          yield* database.saveTransaction({
            id: transaction.id,
            description: transaction.description,
            date: transaction.date.toISOString().split("T")[0]!,
          }).pipe(Effect.mapError(mapError))

          for (const entry of transaction.entries) {
            yield* database.saveEntry({
              id: `${transaction.id}-${entry.accountId}`,
              transaction_id: transaction.id,
              account_id: entry.accountId,
              type: entry.type,
              amount: entry.amount,
            }).pipe(Effect.mapError(mapError))
          }
        })

      const deleteTransaction = (id: string): Effect.Effect<void, RepositoryError> =>
        database.deleteTransaction(id).pipe(Effect.mapError(mapError))

      const saveLedger = (ledger: Ledger): Effect.Effect<void, RepositoryError> =>
        Effect.gen(function* () {
          for (const account of ledger.accounts) {
            yield* saveAccount(account)
          }

          const existingIds = new Set<string>()
          const existingTxns = yield* database.getTransactions().pipe(Effect.mapError(mapError))
          existingTxns.forEach((t) => existingIds.add(t.id))

          for (const transaction of ledger.transactions) {
            if (!existingIds.has(transaction.id)) {
              yield* saveTransaction(transaction)
            }
          }
        })

      const getMetadata = (): Effect.Effect<LedgerMetadata | null, RepositoryError> =>
        Effect.gen(function* () {
          const keys = [
            "exportedAt", "source", "accountNumber", "openingBalance",
            "closingBalance", "totalTransactions", "totalAccounts",
            "totalAdditions", "totalDeductions", "totalDebits", "totalCredits", "hash"
          ]

          const values: Record<string, string> = {}
          for (const key of keys) {
            const value = yield* database.getMetadata(key).pipe(Effect.mapError(mapError))
            if (value) values[key] = value
          }

          if (Object.keys(values).length === 0) return null

          return {
            exportedAt: values.exportedAt ?? "",
            source: values.source ?? "",
            accountNumber: values.accountNumber ?? "",
            openingBalance: parseFloat(values.openingBalance ?? "0"),
            closingBalance: parseFloat(values.closingBalance ?? "0"),
            totalTransactions: parseInt(values.totalTransactions ?? "0", 10),
            totalAccounts: parseInt(values.totalAccounts ?? "0", 10),
            totalAdditions: parseInt(values.totalAdditions ?? "0", 10),
            totalDeductions: parseInt(values.totalDeductions ?? "0", 10),
            totalDebits: parseFloat(values.totalDebits ?? "0"),
            totalCredits: parseFloat(values.totalCredits ?? "0"),
            hash: values.hash ?? "",
          }
        })

      const saveMetadata = (metadata: LedgerMetadata): Effect.Effect<void, RepositoryError> =>
        Effect.gen(function* () {
          yield* database.setMetadata("exportedAt", metadata.exportedAt).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("source", metadata.source).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("accountNumber", metadata.accountNumber).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("openingBalance", String(metadata.openingBalance)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("closingBalance", String(metadata.closingBalance)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalTransactions", String(metadata.totalTransactions)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalAccounts", String(metadata.totalAccounts)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalAdditions", String(metadata.totalAdditions)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalDeductions", String(metadata.totalDeductions)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalDebits", String(metadata.totalDebits)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("totalCredits", String(metadata.totalCredits)).pipe(Effect.mapError(mapError))
          yield* database.setMetadata("hash", metadata.hash).pipe(Effect.mapError(mapError))
        })

      const clearAll = (): Effect.Effect<void, RepositoryError> =>
        database.clearAll().pipe(Effect.mapError(mapError))

      return LedgerRepository.of({
        initialize,
        close,
        getLedger,
        getAccounts,
        getTransactions,
        saveLedger,
        saveAccount,
        saveTransaction,
        deleteTransaction,
        getMetadata,
        saveMetadata,
        clearAll,
      })
    })
  )
}

export { LedgerRepository }
