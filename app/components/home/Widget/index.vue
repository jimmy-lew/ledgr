<script setup lang="ts">
import { LazyWidgetCreate } from '#components'

const { widgets } = await useWidget()

const emit = defineEmits<{ add: [], select: [widget: Widget] }>()

const colorMode = useColorMode()
const overlay = useOverlay()

const activeIndex = ref<string>(widgets.value[0]?.id || '')
const widgetCreateModal = overlay.create(LazyWidgetCreate)

const widgetRefs = ref<HTMLElement[]>([])
const isDark = computed(() => colorMode.value === 'dark')

const setWidgetRef = (index: number, el: Element | ComponentPublicInstance | null) => {
  // @ts-expect-error Type mismatch
  if (el) widgetRefs.value[index] = el.$el || el
}

const dotAnimation = (key: any) => {
  const isActive = activeIndex.value === key
  const activeColor =  'rgba(255,255,255,1)'
  const inactiveColor = isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'
  return {
    width: isActive ? '24px': '8px',
    backgroundColor: isActive ? activeColor : inactiveColor
  }
}

function onCreate() {
  widgetCreateModal.open()
  emit('add')
}

function onScroll(event: Event) {
  if (!event.target) return
  let closest = 0
  let minDist = Infinity
  const { scrollLeft, scrollWidth, clientWidth } = event.target as HTMLElement
  const scrollLeftMax = scrollWidth - clientWidth
  if (scrollLeft >= scrollLeftMax) {
    activeIndex.value = widgets.value[widgets.value.length - 1]?.id || ''
    return
  }
  widgetRefs.value.forEach((widget, i) => {
    const { offsetLeft } = widget
    const dist = offsetLeft - scrollLeft
    if (dist > 0 && dist < minDist) { minDist = dist; closest = i }
  })
  activeIndex.value = widgets.value[closest]?.id || ''
}
</script>

<template>
<div
  v-if="widgets.length > 0"
  class="px-6 w-full mt-6 overflow-x-scroll overflow-y-auto"
  @scroll="onScroll"
>
  <div class="flex min-w-fit gap-2 py-2" >
    <Motion
      as="div"
      :while-hover="{ backgroundColor: `rgba(255,255,255,${isDark ? '0.04' : '0.2'})` }"
      :while-press="{ scale: 0.94 }"
      :transition="{ duration: 0.2 }"
      class="flex items-center justify-center shrink-0 rounded-lg p-2 border-2 border-dashed border-default cursor-pointer transition-colors w-12 h-48"
      @click="onCreate"
    >
      <UIcon name="lucide:plus" />
    </Motion>

    <HomeWidgetItem
      v-for="(item, i) in widgets"
      v-model="activeIndex"
      :ref="el => setWidgetRef(i, el)"
      :item
      :index="i"
    />
  </div>
</div>

<div class="px-6 w-full flex items-center gap-1 mt-2">
  <Motion
    v-for="(item, i) in widgets"
    :key="item.id"
    as="div"
    :animate="dotAnimation(item.id)"
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
