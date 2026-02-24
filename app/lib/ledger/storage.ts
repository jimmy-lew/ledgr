import { get, set, del } from "idb-keyval"
import { Effect, Schema } from "effect"
import type { LedgerMetadata } from "./export.js"

const StorageErrorId = Schema.String.pipe(Schema.brand("StorageErrorId"))

export class StorageError extends Schema.TaggedClass<StorageError>()(
  "StorageError",
  { id: StorageErrorId, message: Schema.String }
) {}

export const LEDGER_KEY = "ledgr:ledger"
export const METADATA_KEY = "ledgr:metadata"

export const storage = {
  getLedger: (): Effect.Effect<Uint8Array | null, StorageError> =>
    Effect.tryPromise({
      try: async () => {
        const value = await get(LEDGER_KEY)
        if (!value) return null
        if (value instanceof Uint8Array) return value
        return new TextEncoder().encode(JSON.stringify(value))
      },
      catch: (e) => StorageError.make({ id: StorageErrorId.make(crypto.randomUUID()), message: String(e) }),
    }),

  setLedger: (data: Uint8Array | string): Effect.Effect<void, StorageError> =>
    Effect.tryPromise({
      try: async () => {
        await set(LEDGER_KEY, data)
      },
      catch: (e) => StorageError.make({ id: StorageErrorId.make(crypto.randomUUID()), message: String(e) }),
    }),

  deleteLedger: (): Effect.Effect<void, StorageError> =>
    Effect.tryPromise({
      try: async () => {
        await del(LEDGER_KEY)
      },
      catch: (e) => StorageError.make({ id: StorageErrorId.make(crypto.randomUUID()), message: String(e) }),
    }),

  getMetadata: (): Effect.Effect<LedgerMetadata | null, StorageError> =>
    Effect.tryPromise({
      try: async () => {
        const value = await get(METADATA_KEY)
        return value as LedgerMetadata | null
      },
      catch: (e) => StorageError.make({ id: StorageErrorId.make(crypto.randomUUID()), message: String(e) }),
    }),

  setMetadata: (metadata: LedgerMetadata): Effect.Effect<void, StorageError> =>
    Effect.tryPromise({
      try: async () => {
        await set(METADATA_KEY, metadata)
      },
      catch: (e) => StorageError.make({ id: StorageErrorId.make(crypto.randomUUID()), message: String(e) }),
    }),
}
