import { Effect, pipe } from "effect"
import { statementPipeline, formatError } from "~/parsers/registry"
import type { Summary } from "~/parsers/types"

export function useBankStatement() {
  const summary = ref<Summary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function parseStatement(file: File) {
    isLoading.value = true
    error.value = null
    summary.value = null

    const res = await pipe(
      statementPipeline(file),
      Effect.match({
        onSuccess: data => { summary.value = data; return summary.value },
        onFailure: err  => { error.value = formatError(err) },
      }),
      Effect.runPromise
    )

    isLoading.value = false

    return res
  }

  return { summary, isLoading, error, parseStatement }
}
