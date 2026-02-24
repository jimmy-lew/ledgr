import { Context, Effect, Layer, Schema } from "effect"
import { Ledger } from "./domain.js"

const FileExportErrorId = Schema.String.pipe(Schema.brand("FileExportErrorId"))

export class FileExportError extends Schema.TaggedClass<FileExportError>()(
  "FileExportError",
  { id: FileExportErrorId, message: Schema.String }
) {}

export interface LedgerMetadata {
  exportedAt: string
  source: string
  accountNumber: string
  openingBalance: number
  closingBalance: number
  totalTransactions: number
  totalAccounts: number
  totalAdditions: number
  totalDeductions: number
  totalDebits: number
  totalCredits: number
  hash: string
}

const TYPE_CODES: Record<string, string> = {
  asset: "A", liability: "L", equity: "E", revenue: "R", expense: "X"
}

const TYPE_LABELS: Record<string, string> = {
  asset: "Assets", liability: "Liabilities", equity: "Equity", revenue: "Income", expense: "Expenses"
}

const formatMetadata = (m: Omit<LedgerMetadata, "hash">): string =>
  `M|${m.exportedAt}|${m.source}|${m.accountNumber}|${m.openingBalance}|${m.closingBalance}|${m.totalTransactions}|${m.totalAccounts}|${m.totalAdditions}|${m.totalDeductions}|${m.totalDebits}|${m.totalCredits}`

const formatAccountLine = (a: Ledger["accounts"][0]): string =>
  `${a.id}|${a.name}|${TYPE_CODES[a.type]}|${a.description._tag === "Some" ? a.description.value : ""}`

const formatEntryInline = (e: Ledger["transactions"][0]["entries"][0]): string =>
  `${e.type === "debit" ? "d" : "c"}:${e.accountId}:${e.amount}`

const formatTransactionLine = (t: Ledger["transactions"][0]): string =>
  `${t.id}|${t.date.toISOString().split("T")[0]}|${t.description.replace(/\|/g, "/")}|${t.entries.map(formatEntryInline).join(",")}`

const formatSummary = (l: Ledger): string =>
  `S|${l.accounts.length}|${l.transactions.length}|${l.totalDebits}|${l.totalCredits}`

const computeHash = async (content: string): Promise<string> => {
  const data = new TextEncoder().encode(content)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

const compressGzip = async (content: string): Promise<Uint8Array> => {
  const stream = new CompressionStream("gzip")
  const writer = stream.writable.getWriter()
  writer.write(new TextEncoder().encode(content))
  writer.close()
  
  const reader = stream.readable.getReader()
  const chunks: Uint8Array[] = []
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value!)
  }
  
  const total = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  chunks.reduce((offset, chunk) => (result.set(chunk, offset), offset + chunk.length), 0)
  return result
}

interface AccountBalance {
  id: string
  name: string
  type: string
  debit: number
  credit: number
  net: number
}

export const computeAccountBalances = (ledger: Ledger): AccountBalance[] => {
  const entries = ledger.transactions.flatMap((t) => t.entries)
  return ledger.accounts.map((a) => {
    const debit = entries.filter((e) => e.accountId === a.id && e.type === "debit").reduce((s, e) => s + e.amount, 0)
    const credit = entries.filter((e) => e.accountId === a.id && e.type === "credit").reduce((s, e) => s + e.amount, 0)
    return { id: a.id, name: a.name, type: a.type, debit, credit, net: debit - credit }
  })
}

export const computeBankTransactions = (ledger: Ledger): Array<{ date: string; desc: string; amount: number; isAddition: boolean }> => {
  const result: Array<{ date: string; desc: string; amount: number; isAddition: boolean }> = []
  
  ledger.transactions.forEach((t) => {
    const bankEntry = t.entries.find((e) => e.accountId === "acc-bank")
    if (bankEntry) {
      result.push({
        date: t.date.toISOString().split("T")[0]!,
        desc: t.description.replace(/^\[[^\]]+\]\s*/, ""),
        amount: bankEntry.amount,
        isAddition: bankEntry.type === "debit",
      })
    }
  })
  
  return result.sort((a, b) => a.date.localeCompare(b.date))
}

const SECTION_SEP = "=".repeat(60)
const ROW_SEP = "-".repeat(60)

const formatAmount = (n: number): string => n.toFixed(2)

const formatSigned = (n: number): string => `${n >= 0 ? "+" : ""}${formatAmount(n)}`

const truncate = (s: string, max: number): string =>
  s.length > max ? s.slice(0, max - 3) + "..." : s

const formatAccountBalance = (bal: AccountBalance, openingBalance?: number): string[] => {
  const label = TYPE_LABELS[bal.type] ?? bal.type
  if (bal.type === "asset" && openingBalance !== undefined) {
    return [
      `\n${bal.name} (${label})`,
      `  Opening:   ${formatAmount(openingBalance)}`,
      `  Inflows:   +${formatAmount(bal.debit)}`,
      `  Outflows:  -${formatAmount(bal.credit)}`,
      `  Closing:   ${formatAmount(openingBalance + bal.net)}`,
    ]
  }
  return [
    `\n${bal.name} (${label})`,
    `  Inflows:   +${formatAmount(bal.debit)}`,
    `  Outflows:  -${formatAmount(bal.credit)}`,
    `  Net:       ${formatSigned(bal.net)}`,
  ]
}

const formatTransactionRow = (t: { date: string; desc: string; amount: number }, sign: "+" | "-"): string =>
  `${t.date.padEnd(12)} ${truncate(t.desc, 38).padEnd(40)} ${sign}${formatAmount(t.amount)}`

const formatTransactionSection = (title: string, txns: Array<{ date: string; desc: string; amount: number }>, sign: "+" | "-"): string[] => {
  if (txns.length === 0) return []
  const total = txns.reduce((s, t) => s + t.amount, 0)
  return [
    `\n${SECTION_SEP}`,
    title,
    SECTION_SEP,
    `\n${"Date".padEnd(12)} ${"Description".padEnd(40)} Amount`,
    ROW_SEP,
    ...txns.map((t) => formatTransactionRow(t, sign)),
    ROW_SEP,
    `${"".padEnd(12)} ${"Total".padEnd(40)} ${sign}${formatAmount(total)}`,
  ]
}

export const formatBreakdown = (ledger: Ledger, openingBalance?: number): string => {
  const balances = computeAccountBalances(ledger)
  const bankTxns = computeBankTransactions(ledger)
  const additions = bankTxns.filter((t) => t.isAddition)
  const deductions = bankTxns.filter((t) => !t.isAddition)
  
  const totalIncome = balances.filter((b) => b.type === "revenue").reduce((s, b) => s + b.credit, 0)
  const totalExpenses = balances.filter((b) => b.type === "expense").reduce((s, b) => s + b.debit, 0)

  return [
    SECTION_SEP, "ACCOUNT BALANCES", SECTION_SEP,
    ...balances.flatMap((b) => formatAccountBalance(b, openingBalance)),
    `\n${SECTION_SEP}`, "INCOME vs EXPENSES", SECTION_SEP,
    `\nTotal Income:     +${formatAmount(totalIncome)}`,
    `Total Expenses:   -${formatAmount(totalExpenses)}`,
    `Net Savings:      ${formatSigned(totalIncome - totalExpenses)}`,
    ...formatTransactionSection("ADDITIONS (+)", additions, "+"),
    ...formatTransactionSection("DEDUCTIONS (-)", deductions, "-"),
    `\n${SECTION_SEP}`,
  ].join("\n")
}

export type ExportFormat = "txt" | "gzip" | "json"

const buildLedger = async (
  ledger: Ledger,
  input: { source: string; accountNumber: string; openingBalance: number }
): Promise<{ content: string; compressed: Uint8Array; hash: string }> => {
  const bankTxns = computeBankTransactions(ledger)
  const additions = bankTxns.filter((t) => t.isAddition)
  const deductions = bankTxns.filter((t) => !t.isAddition)
  
  const totalAdditions = additions.reduce((s, t) => s + t.amount, 0)
  const totalDeductions = deductions.reduce((s, t) => s + t.amount, 0)
  
  const metadata: Omit<LedgerMetadata, "hash"> = {
    exportedAt: new Date().toISOString(),
    source: input.source,
    accountNumber: input.accountNumber,
    openingBalance: input.openingBalance,
    closingBalance: input.openingBalance + totalAdditions - totalDeductions,
    totalTransactions: ledger.transactions.length,
    totalAccounts: ledger.accounts.length,
    totalAdditions: additions.length,
    totalDeductions: deductions.length,
    totalDebits: ledger.totalDebits,
    totalCredits: ledger.totalCredits,
  }
  
  const lines = [
    formatMetadata(metadata),
    ...ledger.accounts.map(formatAccountLine),
    ...ledger.transactions.map(formatTransactionLine),
    formatSummary(ledger),
  ]
  
  const content = lines.join("\n")
  const hash = await computeHash(content)
  const contentWithHash = content.replace(/^M\|/, `M|${hash}|`)
  const compressed = await compressGzip(contentWithHash)
  
  return { content: contentWithHash, compressed, hash }
}

class FileExporter extends Context.Tag("@app/FileExporter")<
  FileExporter,
  {
    readonly exportLedger: (
      ledger: Ledger,
      metadata: { source: string; accountNumber: string; openingBalance: number }
    ) => Effect.Effect<{ content: string; compressed: Uint8Array; metadata: LedgerMetadata }, FileExportError>
    readonly formatBreakdown: (ledger: Ledger, openingBalance?: number) => string
    readonly exportToJson: (ledger: Ledger) => string
  }
>() {
  static readonly layer = Layer.sync(FileExporter, () => {
    const exportLedger = (
      ledger: Ledger,
      metadata: { source: string; accountNumber: string; openingBalance: number }
    ): Effect.Effect<{ content: string; compressed: Uint8Array; metadata: LedgerMetadata }, FileExportError> =>
      Effect.tryPromise({
        try: async () => {
          const { content, compressed, hash } = await buildLedger(ledger, metadata)
          
          const bankTxns = computeBankTransactions(ledger)
          const additions = bankTxns.filter((t) => t.isAddition)
          const deductions = bankTxns.filter((t) => !t.isAddition)
          const totalAdditions = additions.reduce((s, t) => s + t.amount, 0)
          const totalDeductions = deductions.reduce((s, t) => s + t.amount, 0)
          
          const fullMetadata: LedgerMetadata = {
            exportedAt: new Date().toISOString(),
            source: metadata.source,
            accountNumber: metadata.accountNumber,
            openingBalance: metadata.openingBalance,
            closingBalance: metadata.openingBalance + totalAdditions - totalDeductions,
            totalTransactions: ledger.transactions.length,
            totalAccounts: ledger.accounts.length,
            totalAdditions: additions.length,
            totalDeductions: deductions.length,
            totalDebits: ledger.totalDebits,
            totalCredits: ledger.totalCredits,
            hash,
          }
          
          return { content, compressed, metadata: fullMetadata }
        },
        catch: (e) => FileExportError.make({ id: FileExportErrorId.make(crypto.randomUUID()), message: String(e) }),
      })

    const exportToJson = (ledger: Ledger): string => {
      return JSON.stringify({
        accounts: ledger.accounts.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type,
          description: a.description._tag === "Some" ? a.description.value : null,
        })),
        transactions: ledger.transactions.map(t => ({
          id: t.id,
          date: t.date.toISOString(),
          description: t.description,
          entries: t.entries.map(e => ({
            accountId: e.accountId,
            type: e.type,
            amount: e.amount,
          })),
        })),
      }, null, 2)
    }

    return FileExporter.of({ exportLedger, formatBreakdown, exportToJson })
  })
}

export { FileExporter }
