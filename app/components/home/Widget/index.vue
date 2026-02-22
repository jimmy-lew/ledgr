<script setup lang="ts">
import { LazyWidgetCreate } from '#components'

const { widgets } = await useWidget()

const emit = defineEmits<{ add: [], select: [widget: Widget] }>()

const colorMode = useColorMode()
const overlay = useOverlay()

const activeIndex = ref<number>(0)
const widgetCreateModal = overlay.create(LazyWidgetCreate)

const widgetRefs = ref<HTMLElement[]>([])
const isDark = computed(() => colorMode.value === 'dark')

const setWidgetRef = (index: number, el: Element | ComponentPublicInstance | null) => {
  // @ts-expect-error Type mismatch
  if (el) widgetRefs.value[index] = el.$el || el
}

const dotAnimation = (index: any) => {
  const isActive = activeIndex.value === index
  const activeColor =  'rgba(255,255,255,1)'
  const inactiveColor = isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'
  return {
    width: isActive ? '24px': '8px',
    backgroundColor: isActive ? activeColor : inactiveColor
  }
}

const handleCreate = async () => {
  const inst = widgetCreateModal.open()
  const res = await inst.result
  activeIndex.value = 0
  emit('add')
}

const debounce = (f: any, d: number) => { clearTimeout(f._tId); f._tId = setTimeout(() => f(), d) }

function onScroll(event: Event) {
  if (!event.target) return
  let closest = 0
  let minDist = Infinity
  const { scrollLeft: rawScroll, scrollWidth, clientWidth } = event.target as HTMLElement
  const scrollLeftMax = scrollWidth - clientWidth
  const scrollLeft = Math.round(rawScroll)
  if (scrollLeft >= scrollLeftMax) {
    activeIndex.value = widgets.value.length - 1
    return
  }
  widgetRefs.value.forEach((widget, i) => {
    const { offsetLeft } = widget
    const dist = offsetLeft - scrollLeft
    if (dist > 0 && dist < minDist) { minDist = dist; closest = i }
  })
  activeIndex.value = closest
}
</script>

<template>
<div
  v-if="widgets.length > 0"
  class="px-6 w-full mt-6 overflow-x-scroll overflow-y-auto"
  @scroll="e => debounce(() => {onScroll(e)}, 100)"
>
  <div class="flex min-w-fit gap-2 py-2" >
    <Motion
      as="div"
      :while-hover="{ backgroundColor: `rgba(255,255,255,${isDark ? '0.04' : '0.2'})` }"
      :while-press="{ scale: 0.94 }"
      :transition="{ duration: 0.2 }"
      class="flex items-center justify-center shrink-0 rounded-lg p-2 border-2 border-dashed border-default cursor-pointer transition-colors w-12 h-48"
      @click="handleCreate"
    >
      <UIcon name="lucide:plus" />
    </Motion>

    <HomeWidgetItem
      v-for="(item, index) in widgets"
      v-model="activeIndex"
      :ref="el => setWidgetRef(index, el)"
      :item :index
    />
  </div>
</div>

<div class="px-6 w-full flex items-center gap-1 mt-2">
  <Motion
    v-for="(item, i) in widgets"
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
