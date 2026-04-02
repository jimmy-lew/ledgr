import type { UseSwipeDirection, UseSwipeOptions } from "@vueuse/core"

interface UseSwipeableOptions extends UseSwipeOptions {
  leftMax?: number
  leftThreshold?: number
  leftThresholdCrossed?: () => void,

  rightMax?: number
  rightThreshold?: number
  rightThresholdCrossed?: () => void,
}

export function useSwipeable(item: Ref<HTMLElement | undefined>, opts: UseSwipeableOptions = {}) {
  const {
    leftMax = 160,
    leftThreshold = 120,
    rightMax = 160,
    rightThreshold = 120,
    leftThresholdCrossed,
    rightThresholdCrossed,
  } = opts

  const offset = ref(0)
  const didCrossThreshold = ref(false)
  const haptics = useHaptics()

  const onSwipeEnd = (_e: PointerEvent, direction: UseSwipeDirection) => {
    if (direction === 'up' || direction === 'down') return
    if (translateX.value <= -leftThreshold) {
      offset.value = -leftThreshold
      leftThresholdCrossed?.()
      return
    }
    if (translateX.value >= rightThreshold) {
      offset.value = rightThreshold
      rightThresholdCrossed?.()
      return
    }
    offset.value = 0
  }

  const handleThresholdBuzz = () => {
    haptics.snap()
  }

  const { isSwiping, distanceX } = usePointerSwipe(item, { threshold: 0, onSwipeEnd})

  const translateX = computed(() => {
    if (!isSwiping.value) return offset.value
    const raw = offset.value - distanceX.value
    return Math.max(-leftMax, Math.min(rightMax, raw))
  })

  watch(translateX, val => {
    if (!isSwiping.value) return
    if ((val <= -leftThreshold || val >= rightThreshold) && !didCrossThreshold.value) {
      didCrossThreshold.value = true
      handleThresholdBuzz()
    } else if ((val > -leftThreshold && val < rightThreshold) && didCrossThreshold) {
      didCrossThreshold.value = false
    }
  })

  return {
    translateX, isSwiping
  }
}
