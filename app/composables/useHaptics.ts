import { useWebHaptics } from 'web-haptics/vue'

/**
 * Thin semantic layer over web-haptics.
 *
 * Maps swipe gesture moments to the closest matching
 * web-haptics preset — handles SSR no-ops and iOS
 * Safari 17.4+ support automatically via the library.
 */
export function useHaptics() {
  const { trigger, isSupported } = useWebHaptics()

  return {
    isSupported,

    selection: () => trigger('success'),
    snap:      () => trigger('medium'),
    light:     () => trigger('light'),
    medium:    () => trigger('medium'),
    commit:    () => trigger('warning'),
    error:     () => trigger('error'),
    heavy:     () => trigger('heavy'),
  }
}

export type Haptics = ReturnType<typeof useHaptics>
