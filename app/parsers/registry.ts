import { Array as Arr, Effect, Layer, Option, pipe } from "effect"
import type { Summary } from "./types"
import type { BankStatementError } from "./errors"
import { EmptyPdfError, FileReadError, PdfExtractionError, UnsupportedBankError } from "./errors"
import { ParserRegistry } from "./parser"
import { DBSParser } from "./dbs"
import { extractText } from "unpdf"

const parsePages = (
  pages: readonly string[]
): Effect.Effect<Summary, BankStatementError, ParserRegistry> => Effect.gen(function* () {
  const head = yield* pipe(
    Option.fromNullable(pages[0]),
    Effect.mapError(() => new EmptyPdfError())
  )

  const { parsers } = yield* ParserRegistry

  const parser = yield* pipe(
    Arr.findFirst(parsers, p => p.detect(head)),
    Effect.mapError(() => new UnsupportedBankError())
  )

  return yield* parser.parse(pages)
})

const ParserRegistryLive = Layer.succeed(ParserRegistry, {
  parsers: [
    DBSParser,
  ],
})

export const formatError = (err: BankStatementError): string => {
  switch (err._tag) {
    case "EmptyPdfError":        return "PDF appears to be empty"
    case "UnsupportedBankError": return "Unsupported bank statement format"
    case "FileReadError":        return "Could not read the uploaded file"
    case "PdfExtractionError":   return "Could not extract text from PDF"
    case "StatementParseError":  return `Failed to parse ${err.bank} statement: ${err.reason}`
  }
}

export const statementPipeline = (file: File) =>
  pipe(
    Effect.tryPromise({
      try: () => file.arrayBuffer(),
      catch: () => new FileReadError(),
    }),
    Effect.map(buffer => new Uint8Array(buffer)),
    Effect.flatMap(uint8 =>
      Effect.tryPromise({
        try: () => extractText(uint8).then(r => r.text),
        catch: () => new PdfExtractionError(),
      })
    ),
    Effect.flatMap(parsePages),
    Effect.provide(ParserRegistryLive)
  )
