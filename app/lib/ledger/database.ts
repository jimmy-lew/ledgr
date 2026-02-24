import { createClient, type Client } from "@libsql/client"
import { Effect, Schema } from "effect"
import type { LedgerMetadata } from "./export.js"

const DatabaseErrorId = Schema.String.pipe(Schema.brand("DatabaseErrorId"))

export class DatabaseError extends Schema.TaggedClass<DatabaseError>()(
  "DatabaseError",
  { id: DatabaseErrorId, message: Schema.String }
) {}

export const DB_PATH = "file:ledgr.db"

let dbClient: Client | null = null

const SCHEMA_VERSION = 1

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
  )`,
  `CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id TEXT NOT NULL REFERENCES accounts(id),
    type TEXT NOT NULL CHECK(type IN ('debit', 'credit')),
    amount REAL NOT NULL CHECK(amount >= 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_entries_transaction ON entries(transaction_id)`,
  `CREATE INDEX IF NOT EXISTS idx_entries_account ON entries(account_id)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`,
]

export interface AccountRow {
  id: string
  name: string
  type: "asset" | "liability" | "equity" | "revenue" | "expense"
  description: string | null
  created_at: string
  updated_at: string
}

export interface TransactionRow {
  id: string
  description: string
  date: string
  created_at: string
}

export interface EntryRow {
  id: string
  transaction_id: string
  account_id: string
  type: "debit" | "credit"
  amount: number
  created_at: string
}

export interface MetadataRow {
  key: string
  value: string
}

export const database = {
  getClient: (): Effect.Effect<Client, DatabaseError> =>
    Effect.gen(function* () {
      if (!dbClient) {
        return yield* Effect.fail(DatabaseError.make({
          id: DatabaseErrorId.make(crypto.randomUUID()),
          message: "Database not initialized. Call initialize() first.",
        }))
      }
      return dbClient
    }),

  initialize: (): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        if (dbClient) return

        dbClient = createClient({
          url: DB_PATH,
        })

        for (const migration of MIGRATIONS) {
          await dbClient.execute(migration)
        }

        const versionResult = await dbClient.execute(
          "SELECT version FROM schema_version ORDER BY version DESC LIMIT 1"
        )

        const currentVersion = versionResult.rows.length > 0 
          ? (versionResult.rows[0] as { version: number }).version 
          : 0

        if (currentVersion < SCHEMA_VERSION) {
          await dbClient.execute(
            "INSERT INTO schema_version (version) VALUES (?)",
            [SCHEMA_VERSION]
          )
        }
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  close: (): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        if (dbClient) {
          await dbClient.close()
          dbClient = null
        }
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  getAccounts: (): Effect.Effect<AccountRow[], DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      const result = await client.execute("SELECT * FROM accounts ORDER BY name")
      return result.rows as AccountRow[]
    }),

  getAccount: (id: string): Effect.Effect<AccountRow | null, DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      const result = await client.execute(
        "SELECT * FROM accounts WHERE id = ?",
        [id]
      )
      return result.rows.length > 0 ? result.rows[0] as AccountRow : null
    }),

  saveAccount: (account: {
    id: string
    name: string
    type: "asset" | "liability" | "equity" | "revenue" | "expense"
    description: string | null
  }): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute(
          `INSERT OR REPLACE INTO accounts (id, name, type, description, updated_at)
           VALUES (?, ?, ?, ?, datetime('now'))`,
          [account.id, account.name, account.type, account.description]
        )
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  getTransactions: (): Effect.Effect<TransactionRow[], DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      const result = await client.execute(
        "SELECT * FROM transactions ORDER BY date DESC, id"
      )
      return result.rows as TransactionRow[]
    }),

  getTransaction: (id: string): Effect.Effect<TransactionRow | null, DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      const result = await client.execute(
        "SELECT * FROM transactions WHERE id = ?",
        [id]
      )
      return result.rows.length > 0 ? result.rows[0] as TransactionRow : null
    }),

  saveTransaction: (transaction: {
    id: string
    description: string
    date: string
  }): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute(
          `INSERT OR REPLACE INTO transactions (id, description, date)
           VALUES (?, ?, ?)`,
          [transaction.id, transaction.description, transaction.date]
        )
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  deleteTransaction: (id: string): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute("DELETE FROM entries WHERE transaction_id = ?", [id])
        await client.execute("DELETE FROM transactions WHERE id = ?", [id])
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  getEntries: (transactionId?: string): Effect.Effect<EntryRow[], DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      let query = "SELECT * FROM entries"
      const params: string[] = []
      
      if (transactionId) {
        query += " WHERE transaction_id = ?"
        params.push(transactionId)
      }
      
      const result = await client.execute(query, params)
      return result.rows as EntryRow[]
    }),

  saveEntry: (entry: {
    id: string
    transaction_id: string
    account_id: string
    type: "debit" | "credit"
    amount: number
  }): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute(
          `INSERT OR REPLACE INTO entries (id, transaction_id, account_id, type, amount)
           VALUES (?, ?, ?, ?, ?)`,
          [entry.id, entry.transaction_id, entry.account_id, entry.type, entry.amount]
        )
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  getMetadata: (key: string): Effect.Effect<string | null, DatabaseError> =>
    Effect.gen(function* () {
      const client = yield* database.getClient()
      const result = await client.execute(
        "SELECT value FROM metadata WHERE key = ?",
        [key]
      )
      return result.rows.length > 0 ? (result.rows[0] as MetadataRow).value : null
    }),

  setMetadata: (key: string, value: string): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute(
          "INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)",
          [key, value]
        )
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),

  clearAll: (): Effect.Effect<void, DatabaseError> =>
    Effect.tryPromise({
      try: async () => {
        const client = yield* database.getClient()
        await client.execute("DELETE FROM entries")
        await client.execute("DELETE FROM transactions")
        await client.execute("DELETE FROM accounts")
        await client.execute("DELETE FROM metadata")
      },
      catch: (e) => DatabaseError.make({
        id: DatabaseErrorId.make(crypto.randomUUID()),
        message: String(e),
      }),
    }),
}
