import { Context, Effect } from "effect"
import type { Summary } from "./types"
import type { StatementParseError } from "./errors"

export interface BankParser {
  readonly bank: string
  readonly detect: (firstPage: string) => boolean
  readonly parse: (pages: readonly string[]) => Effect.Effect<Summary, StatementParseError>
}

export class ParserRegistry extends Context.Tag("ParserRegistry")<
  ParserRegistry,
  { readonly parsers: ReadonlyArray<BankParser> }
>() {}
