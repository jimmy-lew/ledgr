<script setup lang="ts">

const props = defineProps<{
  id: string
  date: string
  type: string
  description: string
  withdrawal: number | null
  deposit: number | null
}>()

const emit = defineEmits<{ delete: [] }>()

const itemRef = ref<HTMLElement>()
const isCommitting = ref(false)

const haptics = useHaptics()
const { isSelected: isItemSelected, toggle: toggleSelection, count } = useSelectedTransactions()
const { translateX, isSwiping, progress } = useSwipeable(itemRef, {
  leftThresholdCrossed() { console.log('left crossed') },
  rightThresholdCrossed() { console.log('right crossed') }
})

const isSelected = computed(() => isItemSelected(props.id))
const dateDisplay = computed(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
const amt = computed(() => props.withdrawal === null ? `+${props.deposit}` : `${props.withdrawal}` )
const showLabel = computed(() => Math.abs(translateX.value) > 32)

const selectItem = () => {
  if (isSwiping.value) return
  haptics.snap()
  toggleSelection(props.id)
}

useLongPressClick(itemRef, {
  delay: 500,
  onLongPress: () => {
    selectItem()
  },
  onClick: () => {
    if (count.value > 0 || isItemSelected(props.id)) {
      selectItem()
    }
  }
})

const deleteLabel = computed(() => {
  const color = transitionColor([44, 44, 44], [239, 68, 68], progress.value.leftProgess)
  return {
    width: `${-translateX.value}px`,
    backgroundColor: `rgb(${color.join(',')})`,
    transition: isSwiping ? 'none' : 'width 0.25s ease, background-color 0.12s ease',
  }
})
const readLabel = computed(() => {
  const color = transitionColor([44, 44, 44], [81, 162, 255], progress.value.rightProgress)
  return {
    width: `${translateX.value}px`,
    backgroundColor: `rgb(${color.join(',')})`,
    transition: isSwiping ? 'none' : 'width 0.25s ease, background-color 0.12s ease',
  }
})

</script>

<template>
  <div
    class="relative overflow-hidden transition-all duration-300"
    :class="{ 'ease-in-out h-0! opacity-0!': isCommitting }"
  >
    <div class="absolute inset-y-0 left-0 flex items-center justify-center rounded-xl z-0" :style="readLabel" >
      <Transition name="label">
        <div
          v-if="showLabel"
          class="flex items-center gap-1.5 text-white select-none px-4 whitespace-nowrap"
        >
          <UIcon name="lucide:square-check" class="size-4 shrink-0" />
          <span class="text-sm font-semibold tracking-wide">Unread</span>
        </div>
      </Transition>
    </div>

    <div class="absolute inset-y-0 right-0 flex items-center justify-center rounded-xl z-0" :style="deleteLabel" >
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

    <button
      ref="itemRef"
      class="
        flex w-full
        bg-white dark:bg-[#070707]
        rounded-xl px-3 py-3 gap-3
        relative z-10 select-none touch-pan-y
        active:bg-[#f5f5f5] dark:active:bg-[#1b1b1b]
      "
      :class="{ 'transition-transform duration-250 ease-out': !isSwiping, 'bg-[#f5f5f5]! dark:bg-[#1b1b1b]!': isSelected }"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <UChip inset position="bottom-right" size="xl" :show="false">
        <div class="rounded-full flex items-center justify-center size-10 p-2" :class="isSelected ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-black/5 dark:bg-white/5'">
          <UIcon v-if="isSelected" name="lucide:check" />
          <UIcon v-else name="lucide:arrow-right-left" />
        </div>
      </UChip>
      <div class="flex flex-col items-start grow">
        <div class="flex items-center justify-between w-full">
          <span class="font-medium truncate max-w-52">{{ type }}</span>
        </div>
        <span class="text-muted text-sm">{{ dateDisplay }}</span>
      </div>
      <div class="flex flex-col">
        <span class="px-1 py-px rounded-sm dark:bg-white/5" :class="{'text-green-400': withdrawal === null}">{{ amt }}</span>
      </div>
    </button>

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
