import { Effect, Layer, Schema, Context } from "effect"
import { Ledger, Transaction } from "./domain.js"

const UnbalancedTransactionErrorId = Schema.String.pipe(Schema.brand("UnbalancedTransactionErrorId"))
type UnbalancedTransactionErrorId = typeof UnbalancedTransactionErrorId.Type

const UnknownAccountErrorId = Schema.String.pipe(Schema.brand("UnknownAccountErrorId"))
type UnknownAccountErrorId = typeof UnknownAccountErrorId.Type

export class UnbalancedTransactionError extends Schema.TaggedClass<UnbalancedTransactionError>()(
  "UnbalancedTransactionError",
  {
    id: UnbalancedTransactionErrorId,
    transactionId: Schema.String,
    description: Schema.String,
    totalDebits: Schema.Number,
    totalCredits: Schema.Number,
    difference: Schema.Number,
  }
) {}

export class UnknownAccountError extends Schema.TaggedClass<UnknownAccountError>()(
  "UnknownAccountError",
  {
    id: UnknownAccountErrorId,
    accountId: Schema.String,
    transactionId: Schema.String,
  }
) {}

export class DuplicateTransactionError extends Schema.TaggedClass<DuplicateTransactionError>()(
  "DuplicateTransactionError",
  {
    id: Schema.String,
    transactionId: Schema.String,
  }
) {}

export const BookkeepingError = Schema.Union(
  UnbalancedTransactionError,
  UnknownAccountError,
  DuplicateTransactionError
)
export type BookkeepingError = typeof BookkeepingError.Type

class Bookkeeping extends Context.Tag("@app/Bookkeeping")<
  Bookkeeping,
  {
    readonly validateLedger: (ledger: Ledger) => Effect.Effect<Ledger, BookkeepingError>
    readonly validateTransaction: (ledger: Ledger, transaction: Transaction) => Effect.Effect<Transaction, BookkeepingError>
    readonly addTransaction: (ledger: Ledger, transaction: Transaction) => Effect.Effect<Ledger, BookkeepingError>
  }
>() {
  static readonly layer = Layer.effect(
    Bookkeeping,
    Effect.gen(function* () {
      const validateTransaction = (ledger: Ledger, transaction: Transaction): Effect.Effect<Transaction, BookkeepingError> => {
        const accountIds = new Set(ledger.accounts.map((a) => a.id))

        for (const entry of transaction.entries) {
          if (!accountIds.has(entry.accountId)) {
            return Effect.fail(UnknownAccountError.make({
              id: UnknownAccountErrorId.make(crypto.randomUUID()),
              accountId: entry.accountId,
              transactionId: transaction.id,
            }))
          }
        }

        if (!transaction.isBalanced) {
          return Effect.fail(UnbalancedTransactionError.make({
            id: UnbalancedTransactionErrorId.make(crypto.randomUUID()),
            transactionId: transaction.id,
            description: transaction.description,
            totalDebits: transaction.totalDebits,
            totalCredits: transaction.totalCredits,
            difference: transaction.balance,
          }))
        }

        return Effect.succeed(transaction)
      }

      const validateLedger = (ledger: Ledger): Effect.Effect<Ledger, BookkeepingError> => {
        const accountIds = new Set(ledger.accounts.map((a) => a.id))

        for (const transaction of ledger.transactions) {
          for (const entry of transaction.entries) {
            if (!accountIds.has(entry.accountId)) {
              return Effect.fail(UnknownAccountError.make({
                id: UnknownAccountErrorId.make(crypto.randomUUID()),
                accountId: entry.accountId,
                transactionId: transaction.id,
              }))
            }
          }

          if (!transaction.isBalanced) {
            return Effect.fail(UnbalancedTransactionError.make({
              id: UnbalancedTransactionErrorId.make(crypto.randomUUID()),
              transactionId: transaction.id,
              description: transaction.description,
              totalDebits: transaction.totalDebits,
              totalCredits: transaction.totalCredits,
              difference: transaction.balance,
            }))
          }
        }

        return Effect.succeed(ledger)
      }

      const addTransaction = (ledger: Ledger, transaction: Transaction): Effect.Effect<Ledger, BookkeepingError> => {
        const existingIds = new Set(ledger.transactions.map((t) => t.id))
        if (existingIds.has(transaction.id)) {
          return Effect.fail(DuplicateTransactionError.make({
            id: crypto.randomUUID(),
            transactionId: transaction.id,
          }))
        }

        return validateTransaction(ledger, transaction).pipe(
          Effect.map((validated) => Ledger.make({
            accounts: ledger.accounts,
            transactions: [...ledger.transactions, validated],
          }))
        )
      }

      return Bookkeeping.of({ validateLedger, validateTransaction, addTransaction })
    })
  )
}

export { Bookkeeping }
