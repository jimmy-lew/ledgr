import { Effect, Schema } from "effect"
import type { LedgerMetadata } from "./export.js"

const FileReadErrorId = Schema.String.pipe(Schema.brand("FileReadErrorId"))
const FileParseErrorId = Schema.String.pipe(Schema.brand("FileParseErrorId"))

export class FileReadError extends Schema.TaggedClass<FileReadError>()(
  "FileReadError",
  { id: FileReadErrorId, path: Schema.String, message: Schema.String }
) {}

export class FileParseError extends Schema.TaggedClass<FileParseError>()(
  "FileParseError",
  { id: FileParseErrorId, path: Schema.String, message: Schema.String }
) {}

export interface ParsedLedger {
  metadata: LedgerMetadata
  accounts: Array<{
    id: string
    name: string
    type: "asset" | "liability" | "equity" | "revenue" | "expense"
    description: string
  }>
  transactions: Array<{
    id: string
    date: string
    description: string
    entries: Array<{ type: "debit" | "credit"; accountId: string; amount: number }>
  }>
  summary: { totalAccounts: number; totalTransactions: number; totalDebits: number; totalCredits: number }
}

const TYPE_FROM_CODE: Record<string, "asset" | "liability" | "equity" | "revenue" | "expense"> = {
  A: "asset", L: "liability", E: "equity", R: "revenue", X: "expense",
}

export const parseLedger = (content: string): Effect.Effect<ParsedLedger, FileParseError> =>
  Effect.try({
    try: () => {
      const lines = content.split("\n")
      const result: ParsedLedger = {
        metadata: {} as LedgerMetadata,
        accounts: [],
        transactions: [],
        summary: { totalAccounts: 0, totalTransactions: 0, totalDebits: 0, totalCredits: 0 },
      }
      
      let currentTransaction: ParsedLedger["transactions"][0] | null = null
      
      lines.forEach((line) => {
        if (line.startsWith("M|")) {
          const parts = line.split("|")
          result.metadata = {
            hash: parts[1] ?? "",
            exportedAt: parts[2] ?? "",
            source: parts[3] ?? "",
            accountNumber: parts[4] ?? "",
            openingBalance: parseFloat(parts[5] ?? "0"),
            closingBalance: parseFloat(parts[6] ?? "0"),
            totalTransactions: parseInt(parts[7] ?? "0", 10),
            totalAccounts: parseInt(parts[8] ?? "0", 10),
            totalAdditions: parseInt(parts[9] ?? "0", 10),
            totalDeductions: parseInt(parts[10] ?? "0", 10),
            totalDebits: parseFloat(parts[11] ?? "0"),
            totalCredits: parseFloat(parts[12] ?? "0"),
          }
        } else if (line.match(/^[^|]+\|[^|]+\|[ALERVX]\|/)) {
          const [id, name, typeCode, desc] = line.split("|")
          result.accounts.push({
            id: id!,
            name: name!,
            type: TYPE_FROM_CODE[typeCode!] ?? "asset",
            description: desc ?? "",
          })
        } else if (line.startsWith("txn-")) {
          if (currentTransaction) result.transactions.push(currentTransaction)
          const [id, date, desc, entriesStr] = line.split("|")
          currentTransaction = {
            id: id!,
            date: date!,
            description: desc ?? "",
            entries: (entriesStr ?? "").split(",").map((e) => {
              const [typeChar, accountId, amount] = e.split(":")
              return {
                type: typeChar === "d" ? "debit" : "credit",
                accountId: accountId!,
                amount: parseFloat(amount ?? "0"),
              }
            }),
          }
        } else if (line.startsWith("S|")) {
          if (currentTransaction) result.transactions.push(currentTransaction)
          const parts = line.split("|")
          result.summary = {
            totalAccounts: parseInt(parts[1] ?? "0", 10),
            totalTransactions: parseInt(parts[2] ?? "0", 10),
            totalDebits: parseFloat(parts[3] ?? "0"),
            totalCredits: parseFloat(parts[4] ?? "0"),
          }
        }
      })
      
      return result
    },
    catch: (e) => FileParseError.make({ id: FileParseErrorId.make(crypto.randomUUID()), path: "", message: String(e) }),
  })

export interface TransactionConflict {
  existing: ParsedLedger["transactions"][0]
  incoming: ParsedLedger["transactions"][0]
  matchType: "exact" | "fuzzy" | "similar"
  similarity: number
}

export const detectConflicts = (
  existing: ParsedLedger["transactions"],
  incoming: ParsedLedger["transactions"]
): TransactionConflict[] => {
  const conflicts: TransactionConflict[] = []
  const existingByKey = new Map<string, ParsedLedger["transactions"][0]>()
  
  existing.forEach((t) => {
    const key = `${t.date}|${t.description}|${t.entries.map((e) => e.amount).join(",")}`
    existingByKey.set(key, t)
  })
  
  incoming.forEach((t) => {
    const exactKey = `${t.date}|${t.description}|${t.entries.map((e) => e.amount).join(",")}`
    
    if (existingByKey.has(exactKey)) {
      conflicts.push({
        existing: existingByKey.get(exactKey)!,
        incoming: t,
        matchType: "exact",
        similarity: 1.0,
      })
      return
    }
    
    const fuzzyKey = `${t.date}|${t.entries.map((e) => e.amount).join(",")}`
    for (const [key, existingTxn] of existingByKey) {
      if (key.startsWith(fuzzyKey)) {
        conflicts.push({
          existing: existingTxn,
          incoming: t,
          matchType: "fuzzy",
          similarity: 0.8,
        })
        return
      }
    }
    
    const amountKey = t.entries.map((e) => e.amount).join(",")
    for (const [key, existingTxn] of existingByKey) {
      const existingAmounts = key.split("|")[2]
      if (existingAmounts === amountKey) {
        const existingDate = key.split("|")[0]!
        const daysDiff = Math.abs(
          (new Date(t.date).getTime() - new Date(existingDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff <= 3) {
          conflicts.push({
            existing: existingTxn,
            incoming: t,
            matchType: "similar",
            similarity: 0.6 - daysDiff * 0.1,
          })
          return
        }
      }
    }
  })
  
  return conflicts
}

export type ResolutionStrategy = "skip" | "replace" | "keep_both" | "merge"

export interface ConflictResolution {
  conflict: TransactionConflict
  strategy: ResolutionStrategy
}

export const resolveConflicts = (
  existing: ParsedLedger["transactions"],
  incoming: ParsedLedger["transactions"],
  resolutions: ConflictResolution[]
): ParsedLedger["transactions"] => {
  const resolved = [...existing]
  const resolvedIds = new Set(resolutions.map((r) => r.conflict.incoming.id))
  
  incoming.forEach((t) => {
    if (resolvedIds.has(t.id)) {
      const resolution = resolutions.find((r) => r.conflict.incoming.id === t.id)
      if (resolution?.strategy === "skip") return
      if (resolution?.strategy === "replace") {
        const idx = resolved.findIndex((r) => r.id === resolution.conflict.existing.id)
        if (idx >= 0) resolved[idx] = t
        return
      }
      if (resolution?.strategy === "keep_both") {
        resolved.push({ ...t, id: `${t.id}-new` })
        return
      }
      return
    }
    resolved.push(t)
  })
  
  return resolved
}

export const formatConflictReport = (conflicts: TransactionConflict[]): string => {
  if (conflicts.length === 0) return "No conflicts detected"
  
  const lines = [
    "=".repeat(60),
    `CONFLICTS DETECTED: ${conflicts.length}`,
    "=".repeat(60),
  ]
  
  conflicts.forEach((c, i) => {
    lines.push(`\n[${i + 1}] ${c.matchType.toUpperCase()} (similarity: ${(c.similarity * 100).toFixed(0)}%)`)
    lines.push(`  Existing: ${c.existing.id} | ${c.existing.date} | ${c.existing.description.slice(0, 40)}`)
    lines.push(`  Incoming: ${c.incoming.id} | ${c.incoming.date} | ${c.incoming.description.slice(0, 40)}`)
    lines.push(`  Amounts: ${c.existing.entries.map((e) => e.amount).join(", ")}`)
  })
  
  lines.push("\n" + "=".repeat(60))
  return lines.join("\n")
}

export const filterNewTransactions = (
  existing: ParsedLedger["transactions"],
  incoming: ParsedLedger["transactions"]
): ParsedLedger["transactions"] => {
  const existingKeys = new Set(
    existing.map((t) => `${t.date}|${t.description}|${t.entries.map((e) => e.amount).join(",")}`)
  )
  
  return incoming.filter((t) => {
    const key = `${t.date}|${t.description}|${t.entries.map((e) => e.amount).join(",")}`
    return !existingKeys.has(key)
  })
}

export const renumberTransactions = (
  transactions: ParsedLedger["transactions"],
  startFrom: number = 1
): ParsedLedger["transactions"] =>
  transactions.map((t, i) => ({
    ...t,
    id: `txn-${String(startFrom + i).padStart(4, "0")}`,
  }))
