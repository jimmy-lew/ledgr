<script setup lang="ts">
const props = withDefaults(defineProps<{
  items?: { id: number | string; [key: string]: any }[]
}>(), {
  items: () => [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]
})

const emit = defineEmits<{
  add: []
  select: [index: number]
}>()

const activeIndex = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const scrollRef = ref<HTMLElement | null>(null)

const totalDots = computed(() => props.items.length)

function onDotClick(index: number) {
  activeIndex.value = index
  scrollToCard(index)
}

function scrollToCard(index: number) {
  const container = scrollRef.value
  if (!container) return
  const card = container.children[index + 1] as HTMLElement // +1 to skip the add button
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  dragStartX.value = e.clientX
  dragOffset.value = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  dragOffset.value = e.clientX - dragStartX.value
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  const threshold = 60
  if (dragOffset.value < -threshold && activeIndex.value < props.items.length - 1) {
    activeIndex.value++
    scrollToCard(activeIndex.value)
  } else if (dragOffset.value > threshold && activeIndex.value > 0) {
    activeIndex.value--
    scrollToCard(activeIndex.value)
  }
  dragOffset.value = 0
}

function onScroll() {
  console.log('scrolling')
  const container = scrollRef.value
  if (!container || isDragging.value) return
  const cards = Array.from(container.children).slice(1) as HTMLElement[]
  let closest = 0
  let minDist = Infinity
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const dist = Math.abs(rect.left + rect.width / 2 - (containerRect.left + containerRect.width / 2))
    console.log(dist)
    if (dist < minDist) {
      minDist = dist
      closest = i
    }
  })
  activeIndex.value = closest
}
</script>

<template>
<div class="px-6 w-full mt-6 overflow-y-auto">
  <div
    ref="scrollRef"
    class="flex min-w-fit gap-2 overflow-x-scroll py-2 scrollbar-hide"
    @scroll="onScroll"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <Motion
      as="div"
      :while-hover="{ backgroundColor: 'rgba(255,255,255,0.2)' }"
      :while-press="{ scale: 0.94 }"
      :transition="{ duration: 0.2 }"
      class="
        flex items-center justify-center shrink-0
        rounded-lg p-2
        border-2 border-dashed border-default
        cursor-pointer
        transition-colors
        w-12 h-48
      "
      @click="emit('add')"
    >
      <UIcon name="lucide:plus" />
    </Motion>

    <Motion
      v-for="(item, i) in items"
      :key="item.id"
      as="div"
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }"
      :while-hover="{ scale: 1.02 }"
      :while-tap="{ scale: 0.97 }"
      class="
        flex flex-col shrink-0 rounded-xl p-2
        bg-default backdrop-blur-sm
        w-40 h-48
        cursor-pointer
        transition-shadow duration-300
      "
      :class="{ 'ring-white/60 shadow-lg shadow-white/10': activeIndex === i }"
      @click="activeIndex = i; emit('select', i)"
    >
      <slot :item="item" :index="i" :active="activeIndex === i" />
    </Motion>
  </div>
</div>

<div class="px-6 w-full flex items-center gap-1 mt-2">
  <Motion
    v-for="(item, i) in items"
    :key="item.id"
    as="div"
    :animate="{
      width: activeIndex === i ? '24px' : '8px',
      backgroundColor: activeIndex === i ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.15)'
    }"
    :transition="{ duration: 0.25, ease: 'easeOut' }"
    class="h-1 rounded-full cursor-pointer min-w-2"
    @click="onDotClick(i)"
  />
</div>
</template>

<style scoped>
.scrollbar-hide {
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
