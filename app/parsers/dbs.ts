import { Array as Arr, Effect, Option, pipe } from "effect"
import type { BankParser } from "./parser"
import type { Transaction } from "./types"
import { StatementParseError } from "./errors"

const DATE_RE = /(?=\d{2}\/\d{2}\/\d{4})/
const INTEREST_STATEMENT = "INTEREST_EARNED"
const TRANSACTION_TYPES = [
  "GIRO_PAYMENTS_COLLECTIONS_VIA_GIRO",
  "ADVICE_FAST_PAYMENT_RECEIPT",
  "DEBIT_CARD_TRANSACTION",
  "ADVICE_FUNDS_TRANSFER",
  INTEREST_STATEMENT,
  "GIRO_SALARY",
  "NA",
] as const

type TransactionType = (typeof TRANSACTION_TYPES)[number]

const parseAmount = (s: string | undefined): Option.Option<number> => {
  if (!s) return Option.none()
  const n = parseFloat(s.replace(/,/g, ""))
  return isNaN(n) ? Option.none() : Option.some(n)
}

const resolveAmtDir =
  (openingBalance: number) =>
  (txn: Transaction, index: number, arr: readonly Transaction[]): Transaction => {
    const prev = arr[index - 1]?.balance ?? openingBalance
    const isDeposit = txn.balance - prev > 0
    return {
      ...txn,
      deposit: isDeposit ? txn.withdrawal : null,
      withdrawal: isDeposit ? null : txn.withdrawal,
    }
  }

const parseTxnType = (line: string): [TransactionType, string] => {
  const typeLine = line.replace(/[\s/]+/g, "_")
  for (const type of TRANSACTION_TYPES) {
    if (!typeLine.startsWith(type)) continue
    const description = typeLine.slice(type.length).replace(/_+/g, " ").trim()
    return [type, description]
  }
  return ["NA", line]
}

const parseTxnLine = (
  line: string,
  amountSlice: { start: number; end?: number } = { start: -3 }
): Option.Option<Transaction> => {
  const [date, ...rest] = line.toUpperCase().split(" ")
  if (!date) return Option.none()

  const { start, end } = amountSlice
  const sliced = rest.slice(start, end)

  return pipe(
    Option.all({ withdrawal: parseAmount(sliced.at(0)), balance: parseAmount(sliced.at(1)) }),
    Option.map(({ withdrawal, balance }) => {
      const [type, description] = parseTxnType(rest.slice(0, start).join(" "))
      return { date, type, description, withdrawal, deposit: null, balance }
    })
  )
}

const parseLastTxnLine = (line: string): Option.Option<Transaction> => {
  const rest = line.toUpperCase().split(" ").slice(1)
  const isInterest = rest.join("_").includes(INTEREST_STATEMENT)
  const amountSlice = isInterest ? { start: 2, end: 5 } : { start: -36 }
  return parseTxnLine(line, amountSlice)
}

const parsePage = (lines: readonly string[], index: number): readonly Transaction[] =>
  pipe(
    Option.fromNullable(lines.slice(index === 0 ? 5 : 3)),
    Option.flatMap(([balanceLine, ...txnLines]) =>
      pipe(
        parseAmount(balanceLine?.split(" ").at(-1)),
        Option.map(openingBalance => {
          const splitLines = txnLines.join(" ").split(DATE_RE)
          const lastLine = splitLines.at(-1)
          const txns: Transaction[] = [
            ...Arr.filterMap(splitLines.slice(0, -1), l => parseTxnLine(l)),
            ...Arr.filterMap(lastLine ? [lastLine] : [], parseLastTxnLine),
          ]
          return txns.map(resolveAmtDir(openingBalance))
        })
      )
    ),
    Option.getOrElse(() => [] as Transaction[])
  )

export const DBSParser: BankParser = {
  bank: "DBS",
  detect: (firstPage) => firstPage.toUpperCase().includes("DBS BANK"),
  parse: (pages) => {
    const bank = "DBS"
    return Effect.gen(function* () {
      const [head, ...txnPages] = pages.slice(0, -1)

      const validHead = yield* pipe(
        Option.fromNullable(head),
        Effect.mapError(() => new StatementParseError({ bank, reason: "Could not read statement header" }))
      )

      const accountNumber = validHead.split("\n").slice(-4)[0]?.split(" ").at(4) ?? "N/A"
      const transactions = txnPages
        .map(p => p.split("\n"))
        .flatMap((lines, index) => parsePage(lines, index))

      return { bank, accountNumber, transactions }
    })
  },
}
