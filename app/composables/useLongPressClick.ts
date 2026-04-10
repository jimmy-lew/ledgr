import  type { TimerHandle } from '@vueuse/core'

interface UseLongPressClickOptions {
  delay?: number
  onLongPress?: () => void
  onClick?: () => void
}

export function useLongPressClick(
  element: Ref<HTMLElement | undefined>,
  options: UseLongPressClickOptions = {}
) {
  const { delay = 500, onLongPress, onClick } = options

  const isLongPressing = ref(false)
  let timeout: TimerHandle | null = null

  const handleClick = (e: Event) => {
    if (isLongPressing.value) {
      isLongPressing.value = false
      e.stopImmediatePropagation()
      return
    }
    onClick?.()
  }

  const handleLongPress = () => {
    isLongPressing.value = true
    onLongPress?.()
  }

  const handlePointerDown = () => {
    timeout = setTimeout(() => {
      handleLongPress()
    }, delay)
  }

  const handleRelease = () => {
    if (!timeout) return
    clearTimeout(timeout)
    timeout = null
  }

  useEventListener(element, 'click', handleClick)
  useEventListener(element, 'pointerdown', handlePointerDown)
  useEventListener(element, ['pointerup', 'pointerleave'], handleRelease)

  return { isLongPressing }
}
