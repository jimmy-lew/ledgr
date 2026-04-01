<script setup lang="ts">

const props = defineProps<{
  date: string
  type: string
  description: string
  withdrawal: number | null
  deposit: number | null
}>()

const emit = defineEmits<{ delete: [] }>()

// ── Formatting ────────────────────────────────────────────────
const [day, month, year] = props.date.split('/').map(p => parseInt(p, 10)) as [number, number, number]
const dateDisplay = computed(() => new Date(year, month - 1, day).toLocaleDateString())
const amt = computed(() =>
  props.withdrawal === null ? `+${props.deposit}` : `-${props.withdrawal}`
)

// ── Constants ─────────────────────────────────────────────────
const SNAP_THRESHOLD   = 120    // px – snaps open to lock delete button visible
const COMMIT_THRESHOLD = 200   // px – full swipe auto-deletes without releasing
const MAX_DRAG_LEFT    = 280
const MAX_DRAG_RIGHT   = 100

// ── State ─────────────────────────────────────────────────────
const rowRef       = ref<HTMLElement>()
const snapOffset   = ref(0)       // 0 = closed | -SNAP_THRESHOLD = locked open
const isCommitting = ref(false)

// Threshold crossing flags — each haptic fires exactly once per gesture
const didCrossSnap   = ref(false)
const didCrossCommit = ref(false)

const haptics = useHaptics()

// ── VueUse swipe ──────────────────────────────────────────────
const { isSwiping, distanceX } = usePointerSwipe(rowRef, {
  /**
   * threshold: 0 so translateX tracks from the very first pixel.
   * Axis-locking is handled below via direction guard.
   */
  threshold: 0,

  onSwipeStart() {
    didCrossSnap.value   = false
    didCrossCommit.value = false
  },

  onSwipeEnd(_e, direction) {
    if (direction === 'up' || direction === 'down') {
      return
    }

    const total = snapOffset.value - distanceX.value   // signed, negative = left

    if (total <= -COMMIT_THRESHOLD) {
      commitDelete()
    } else if (total < -SNAP_THRESHOLD) {
      snapOffset.value = -SNAP_THRESHOLD
    } else if (direction === 'right' && total >= SNAP_THRESHOLD) {
      console.log('[swipe-right]', props.type)
      haptics.selection()
      snapOffset.value = 0
    } else {
      // Snap back – also closes the delete button if it was open
      snapOffset.value = 0
    }
  },
})

const translateX = computed(() => {
  if (!isSwiping.value) return snapOffset.value
  const raw = snapOffset.value - distanceX.value
  return Math.max(-MAX_DRAG_LEFT, Math.min(MAX_DRAG_RIGHT, raw))
})

// ── Threshold-crossing haptics ────────────────────────────────
watch(translateX, val => {
  if (!isSwiping.value) return

  // Crossing into snap zone
  if (val <= -SNAP_THRESHOLD && !didCrossSnap.value) {
    didCrossSnap.value = true
    haptics.snap()
  } else if (val > -SNAP_THRESHOLD && didCrossSnap.value) {
    didCrossSnap.value = false
    haptics.light()         // Crossed back out
  }

  // Crossing into commit zone
  if (val <= -COMMIT_THRESHOLD && !didCrossCommit.value) {
    didCrossCommit.value = true
    haptics.commit()
  } else if (val > -COMMIT_THRESHOLD && didCrossCommit.value) {
    didCrossCommit.value = false
    haptics.medium()        // Pulled back from commit
  }
})

function commitDelete() {
  if (isCommitting.value) return
  isCommitting.value = true
  haptics.error()
  // Row flies off-screen; wrapper collapses; emit fires after exit
  setTimeout(() => emit('delete'), 320)
}

const deleteBg = computed(() => {
  const abs = Math.abs(Math.min(0, translateX.value))
  const p = Math.min(1, Math.max(0, (abs - SNAP_THRESHOLD) / (COMMIT_THRESHOLD - SNAP_THRESHOLD)))
  const r = Math.round(44  + (239 - 44) * p)
  const g = Math.round(44  + (68  - 44) * p)
  const b = Math.round(44  + (68  - 44) * p)
  return `rgb(${r},${g},${b})`
})

const revealWidth  = computed(() => Math.max(0, -translateX.value))
const showLabel    = computed(() => translateX.value < -32)
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="{
      'transition-[opacity,height] duration-300 ease-in-out h-0! opacity-0!': isCommitting,
    }"
  >
    <div
      class="absolute inset-y-0 right-0 flex items-center justify-center rounded-xl z-0"
      :style="{
        width: `${revealWidth}px`,
        backgroundColor: deleteBg,
        transition: isSwiping ? 'none' : 'width 0.25s ease, background-color 0.12s ease',
      }"
      @click="commitDelete"
    >
      <Transition name="label">
        <div
          v-if="showLabel"
          class="flex items-center gap-1.5 text-white select-none px-4 whitespace-nowrap"
        >
          <span class="text-sm font-semibold tracking-wide">Delete</span>
          <UIcon name="lucide:archive-x" class="size-4 shrink-0" />
        </div>
      </Transition>
    </div>

    <!-- ── Sliding row ────────────────────────────────────────── -->
    <div
      ref="rowRef"
      class="
        flex items-start justify-between w-full
        dark:bg-[#070707]
        rounded-xl px-3 py-2
        relative z-10 select-none touch-pan-y
      "
      :class="{ 'transition-transform duration-250 ease-out': !isSwiping }"
      :style="{
        transform: `translateX(${isCommitting ? -440 : translateX}px)`,
        transition: isCommitting ? 'transform 0.3s ease-in' : undefined,
      }"
    >
      <div class="flex items-center gap-2 grow">
        <UChip inset position="bottom-right" size="xl">
          <div class="rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center size-8 p-2">
            <UIcon name="lucide:arrow-right-left" />
          </div>
        </UChip>
        <div class="flex flex-col w-full">
          <span class="font-medium text-sm truncate max-w-7/8">{{ type }}</span>
          <span class="text-muted text-xs">{{ dateDisplay }}</span>
        </div>
      </div>
      <span class="text-sm">{{ amt }}</span>
    </div>

  </div>
</template>

<style scoped>
.label-enter-active,
.label-leave-active {
  transition: opacity 0.15s ease;
}
.label-enter-from,
.label-leave-to {
  opacity: 0;
}
</style>
