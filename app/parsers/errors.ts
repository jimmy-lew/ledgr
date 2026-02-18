import { Data } from "effect"

export class EmptyPdfError extends Data.TaggedError("EmptyPdfError")<{}> {}
export class UnsupportedBankError extends Data.TaggedError("UnsupportedBankError")<{}> {}
export class FileReadError extends Data.TaggedError("FileReadError")<{}> {}
export class PdfExtractionError extends Data.TaggedError("PdfExtractionError")<{}> {}

export class StatementParseError extends Data.TaggedError("StatementParseError")<{
  readonly bank: string
  readonly reason: string
}> {}

export type BankStatementError =
  | EmptyPdfError
  | UnsupportedBankError
  | FileReadError
  | PdfExtractionError
  | StatementParseError
