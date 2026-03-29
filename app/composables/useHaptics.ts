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

    /** Swipe initiated — barely perceptible tick */
    selection: () => trigger('success'),

    /** Crossed into the snap zone — card locks open */
    snap:      () => trigger('medium'),

    /** Pulled back out of snap zone */
    light:     () => trigger('light'),

    /** Pulled back out of commit zone */
    medium:    () => trigger('medium'),

    /** Crossed into commit zone — about to delete */
    commit:    () => trigger('warning'),

    /** Item deleted — destructive confirmation */
    error:     () => trigger('error'),

    /** Right-swipe confirm */
    heavy:     () => trigger('heavy'),
  }
}

export type Haptics = ReturnType<typeof useHaptics>
