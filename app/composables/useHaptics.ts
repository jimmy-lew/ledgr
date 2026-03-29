/**
 * Thin wrapper around the Web Vibration API.
 * Degrades silently on unsupported platforms (iOS Safari, desktop).
 *
 * Usage:
 *   const haptics = useHaptics()
 *   haptics.snap()      // crossing a threshold
 *   haptics.commit()    // destructive confirmation
 */

type Pattern = number | number[]

/** Named patterns — tune durations (ms) to taste */
const PATTERNS = {
  /** Barely perceptible – swipe start / right-swipe confirm */
  selection: 6,
  /** Light tick – snap open */
  light: 12,
  /** Mid tick – crossing snap threshold on the way back */
  medium: 22,
  /** Strong thud – crossing the commit threshold */
  heavy: 48,
  /** Two-pulse snap – item locks open at delete button */
  snap: [10, 28, 10] as number[],
  /** Rising triple – you're about to delete */
  commit: [20, 24, 50] as number[],
  /** Sharp double – item deleted */
  error: [60, 30, 60] as number[],
} as const

export type HapticName = keyof typeof PATTERNS

export function useHaptics() {
  const isSupported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator

  function trigger(pattern: Pattern) {
    if (!isSupported) return
    // Cancel any in-flight vibration before starting a new one
    navigator.vibrate(0)
    navigator.vibrate(pattern)
  }

  function fire(name: HapticName) {
    trigger(PATTERNS[name])
  }

  return {
    isSupported,
    fire,
    // Convenience aliases
    selection: () => fire('selection'),
    light:     () => fire('light'),
    medium:    () => fire('medium'),
    heavy:     () => fire('heavy'),
    snap:      () => fire('snap'),
    commit:    () => fire('commit'),
    error:     () => fire('error'),
  }
}
