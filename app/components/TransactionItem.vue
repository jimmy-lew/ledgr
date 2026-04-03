<script setup lang="ts">

const props = defineProps<{
  date: string
  type: string
  description: string
  withdrawal: number | null
  deposit: number | null
}>()

const emit = defineEmits<{ delete: [] }>()

const dateDisplay = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const amt = computed(() =>
  props.withdrawal === null ? `+${props.deposit}` : `-${props.withdrawal}`
)

const rowRef = ref<HTMLElement>()
const isCommitting = ref(false)

const { translateX, isSwiping } = useSwipeable(rowRef, {
  leftThresholdCrossed() { console.log('left crossed') },
  rightThresholdCrossed() { console.log('right crossed') }
})
const deleteBg = computed(() => {
  const p = Math.min(1, Math.abs(translateX.value) / (120))
  const color = transitionColor([44, 44, 44], [239, 68, 68], p)
  return `rgb(${color.join(',')})`
})

const revealWidth  = computed(() => Math.max(0, -translateX.value))
const showLabel    = computed(() => translateX.value < -32)
</script>

<template>
  <div
    class="relative overflow-hidden transition-all duration-300"
    :class="{ 'ease-in-out h-0! opacity-0!': isCommitting }"
  >
    <div
      class="absolute inset-y-0 right-0 flex items-center justify-center rounded-xl z-0"
      :style="{
        width: `${revealWidth}px`,
        backgroundColor: deleteBg,
        transition: isSwiping ? 'none' : 'width 0.25s ease, background-color 0.12s ease',
      }"
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

    <div
      ref="rowRef"
      class="
        flex items-start justify-between w-full
        dark:bg-[#070707]
        rounded-xl px-3 py-2.5
        relative z-10 select-none touch-pan-y
      "
      :class="{ 'transition-transform duration-250 ease-out': !isSwiping }"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <div class="flex items-center gap-2 grow">
        <UChip inset position="bottom-right" size="xl">
          <div class="rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center size-10 p-2">
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
