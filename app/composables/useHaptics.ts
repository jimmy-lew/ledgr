import { useWebHaptics } from 'web-haptics/vue'

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
