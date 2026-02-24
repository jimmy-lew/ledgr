import { Schema } from "effect"

const AccountId = Schema.String.pipe(Schema.brand("AccountId"))
export type AccountId = typeof AccountId.Type
export const makeAccountId = AccountId.make

const TransactionId = Schema.String.pipe(Schema.brand("TransactionId"))
export type TransactionId = typeof TransactionId.Type
export const makeTransactionId = TransactionId.make

const Money = Schema.Number.pipe(Schema.brand("Money"))
export type Money = typeof Money.Type
export const makeMoney = Money.make

export const AccountType = Schema.Literal("asset", "liability", "equity", "revenue", "expense")
export type AccountType = typeof AccountType.Type

export class Account extends Schema.Class<Account>("Account")({
  id: AccountId,
  name: Schema.String,
  type: AccountType,
  description: Schema.Option(Schema.String),
}) {}

export const EntryType = Schema.Literal("debit", "credit")
export type EntryType = typeof EntryType.Type

export class Entry extends Schema.Class<Entry>("Entry")({
  accountId: AccountId,
  type: EntryType,
  amount: Money,
}) {}

export class Transaction extends Schema.Class<Transaction>("Transaction")({
  id: TransactionId,
  description: Schema.String,
  date: Schema.Date,
  entries: Schema.Array(Entry),
}) {
  get totalDebits(): number {
    return this.entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0)
  }

  get totalCredits(): number {
    return this.entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0)
  }

  get isBalanced(): boolean {
    return this.totalDebits === this.totalCredits
  }

  get balance(): number {
    return this.totalDebits - this.totalCredits
  }
}

export class Ledger extends Schema.Class<Ledger>("Ledger")({
  accounts: Schema.Array(Account),
  transactions: Schema.Array(Transaction),
}) {
  get isBalanced(): boolean {
    return this.transactions.every((t) => t.isBalanced)
  }

  get totalDebits(): number {
    return this.transactions.reduce((sum, t) => sum + t.totalDebits, 0)
  }

  get totalCredits(): number {
    return this.transactions.reduce((sum, t) => sum + t.totalCredits, 0)
  }

  getNetBalance(): number {
    return this.totalDebits - this.totalCredits
  }
}
