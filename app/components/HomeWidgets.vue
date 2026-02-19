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

const colorMode = useColorMode()

const activeIndex = ref(0)
const scrollRef = ref<HTMLElement | null>(null)

const widgetRefs = ref<HTMLElement[]>([])
const totalDots = computed(() => props.items.length)
const isDark = computed(() => colorMode.value === 'dark')

const addWidgetRef = (e: any) => { if (e) widgetRefs.value.push(e.$el || e) }

const dotAnimation = (index: number) => {
  const isActive = activeIndex.value === index
  const activeColor =  'rgba(255,255,255,1)'
  const inactiveColor = isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'
  return {
    width: isActive ? '24px': '8px',
    backgroundColor: isActive ? activeColor : inactiveColor
  }
}

function onScroll() {
  const container = scrollRef.value
  if (!container) return
  let closest = 0
  let minDist = Infinity
  widgetRefs.value.forEach((card, i) => {
    const dist = Math.abs(card.offsetLeft - container.scrollLeft - container.clientWidth / 2 + card.offsetWidth / 2)
    if (dist < minDist) { minDist = dist; closest = i }
  })
  activeIndex.value = closest
}
</script>

<template>
<div
  ref="scrollRef"
  class="px-6 w-full mt-6 overflow-x-scroll overflow-y-auto"
  @scroll="onScroll"
>
  <div
    class="flex min-w-fit gap-2 py-2"
  >
    <Motion
      as="div"
      :while-hover="{ backgroundColor: `rgba(255,255,255,${isDark ? '0.04' : '0.2'})` }"
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
      :ref="addWidgetRef"
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }"
      :while-hover="{ scale: 1.02 }"
      :while-press="{ scale: 0.97 }"
      class="
        flex flex-col shrink-0 rounded-xl p-2
        bg-default backdrop-blur-sm
        w-40 h-48
        cursor-pointer
        transition-shadow duration-300
      "
      :class="{ 'shadow-md': activeIndex === i }"
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
    :animate="dotAnimation(i)"
    :transition="{ duration: 0.25, ease: 'easeOut' }"
    class="h-1 rounded-full cursor-pointer min-w-2"
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
