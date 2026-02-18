<!-- Inspired by Henrik Ruscon https://x.com/henrikruscon/status/1800862855648129449 -->
<script setup lang="ts">
interface ActionBarSubItem {
  title: string
  action?: () => void
  description?: string
  trailing?: string
  subtrailing?: string
  icon?: string
  iconClass?: string
}

interface ActionBarItem {
  title?: string
  icon: string
  items?: ActionBarSubItem[]
}

const props = defineProps<{
  items: ActionBarItem[]
}>()

const itemsWithSubItems = computed(() =>
  props.items.filter(item => item.items && item.items.length > 0)
)

// Refs for DOM elements
const navRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const detailRefs = ref<HTMLElement[]>([])

const navSize = ref(220)

const setDetailRef = (el: any, index: number) => {
  if (el) detailRefs.value[index] = el.$el || el // Handle component ref
}

// Active detail state
const activeDetail = ref<number | null>(null)
const activeIndex = ref<number | null>(null)
const activeSubItemKey = ref<string | null>(null)
const measuredDimensions = ref({ width: 220, height: 48 })
const hasOverflow = ref(false)
const isScrolledToBottom = ref(false)

const handleClick = (index: number) => {
  activeIndex.value = index
  setTimeout(() => {
    activeIndex.value = null
  }, 150)
}


const handleSubItemClick = (parentIndex: number, subIndex: number, subItem: ActionBarSubItem) => {
  activeSubItemKey.value = `${parentIndex}-${subIndex}`
  setTimeout(() => {
    activeSubItemKey.value = null
  }, 150)

  if (!subItem.action) return
  subItem.action()
}

// Computed animation state for container
const containerAnimate = computed(() => {
  if (activeDetail.value !== null) {
    return {
      width: measuredDimensions.value.width,
      height: measuredDimensions.value.height + 16,
      y: 17,
      borderRadius: 24,
    }
  }
  return {
    width: navSize.value,
    height: 48,
    y: 0,
    borderRadius: 16,
  }
})

// Handle item hover
const handleItemHover = (index: number) => {
  const item = props.items[index]
  if (!item || !item.items || item.items.length === 0) return

  const subItemIndex = itemsWithSubItems.value.findIndex(i => i === item)

  activeIndex.value = index
  const el = detailRefs.value[subItemIndex]
  if (el) {
    const w = Math.max(navSize.value + 64, el.scrollWidth)
    const h = Math.min(el.scrollHeight + 64, 320)

    measuredDimensions.value = { width: w, height: h }
    hasOverflow.value = el.scrollHeight > 320
    isScrolledToBottom.value = false
  }

  activeDetail.value = subItemIndex
}

const handleItemLeave = () => {
  activeIndex.value = null
  setTimeout(() => {
    const isHoveringDetail = detailRefs.value.some(
      (detail, idx) => detail?.matches?.(':hover') && idx === activeDetail.value
    )

    if (activeIndex.value === null && !isHoveringDetail) {
      resetContainer()
    }
  }, 500)
}

const handleDetailLeave = () => {
  const items = document.querySelectorAll('.item')
  const isHoveringItem = Array.from(items).some(item => item.matches(':hover'))

  if (!isHoveringItem) {
    resetContainer()
  }
}

const resetContainer = () => {
  activeIndex.value = null
  activeDetail.value = null
  hasOverflow.value = false
  isScrolledToBottom.value = false
}

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight
  isScrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - 2
}

watch([activeIndex, activeDetail], ([ni, nd]) => { console.log(ni, nd) })

onMounted(() => {
  navSize.value = navRef.value?.scrollWidth ?? 410
  measuredDimensions.value = { width: navSize.value, height: 48 }
})
</script>

<template>
  <div ref="navRef" class="flex items-center justify-center rounded-2xl bg-transparent fixed -translate-x-1/2 left-1/2 bottom-14 z-2">
    <button
      v-for="(item, index) in items"
      :key="item.title"
      @click="handleClick(index)"
      @mouseenter="handleItemHover(index)"
      @mouseleave="handleItemLeave"
      class="item flex items-center justify-center gap-2 hover:bg-default hover:invert active:scale-95 duration-300 transition-all py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl"
    >
      <Icon :name="item.icon" class="size-4 sm:size-6" />
      <span v-if="item.title" class="font-bold text-sm">{{ item.title }}</span>
    </button>
  </div>

  <Motion
    ref="containerRef"
    :initial="{ width: navSize, height: 48, y: 0, borderRadius: 16 }"
    :animate="containerAnimate"
    :transition="{
      type: 'spring',
      stiffness: 170,
      damping: 26,
      mass: 1
    }"
    class="fixed bg-elevated dark:bg-black backdrop-blur-xl -translate-x-1/2 left-1/2 bottom-13 sm:bottom-14 overflow-hidden"
    >
    <Motion
      v-for="(item, index) in itemsWithSubItems"
      :key="item.title"
      :ref="(el) => setDetailRef(el, index)"
      @mouseleave="handleDetailLeave"
      :initial="{ opacity: 0, zIndex: 1 }"
      :animate="{
        opacity: activeDetail === index ? 1 : 0,
        zIndex: activeDetail === index ? 2 : 1
      }"
      :transition="{ duration: 0.3 }"
      :class="['p-3 sm:p-4 flex flex-col items-center absolute min-w-85 sm:min-w-110.5 w-max gap-1 overflow-y-scroll max-h-64', { mask: hasOverflow && !isScrolledToBottom }]"
      @scroll="handleScroll"
      :style="{ pointerEvents: activeDetail === index ? 'auto' : 'none' }"
    >
      <button @click="handleSubItemClick(index, subItemIndex, subItem)" v-for="(subItem, subItemIndex) in item.items" :key="subItem.title" class="w-full group text-sm sm:text-base transition-transform duration-75 active:scale-95" >
        <div class="flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-3 hover:px-3 duration-300 w-full mx-auto px-2">
          <!-- Icon or Gradient Box -->
          <div
            v-if="subItem.iconClass"
            :class="['w-16 h-16 rounded-xl shrink-0', subItem.iconClass]"
          ></div>
          <Icon
            v-else-if="subItem.icon"
            :name="subItem.icon"
            class="size-4 sm:size-6 shrink-0 opacity-75"
          />

          <!-- Content -->
          <div class="w-full flex flex-col items-start whitespace-nowrap">
            <div class="flex items-center gap-3 w-full justify-between">
              <div class="flex items-center gap-3">
                 <span class="font-bold">{{ subItem.title }}</span>
              </div>
               <!-- Right Side: Trailing info -->
               <div class="flex items-center gap-3 ml-auto pl-4">
                 <span v-if="subItem.subtrailing" class="block shrink-0 py-1 px-2 text-sm rounded-lg opacity-80 border border-default">
                  {{ subItem.subtrailing }}
                </span>
                <span v-if="subItem.trailing" class="block">{{ subItem.trailing }}</span>
              </div>
            </div>
            <p v-if="subItem.description" class="opacity-80">{{ subItem.description }}</p>
          </div>
        </div>
      </button>
    </Motion>
  </Motion>
</template>

<style scoped>
.mask {
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.2) 10px,
    rgba(0, 0, 0, 1) 20px,
    rgba(0, 0, 0, 1) calc(100% - 64px),
    rgba(0, 0, 0, 0.2) calc(100% - calc(64px / 2)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.2) 10px,
    rgba(0, 0, 0, 1) 20px,
    rgba(0, 0, 0, 1) calc(100% - 64px),
    rgba(0, 0, 0, 0.2) calc(100% - calc(64px / 2)),
    transparent 100%
  );
}

.dark .mask {
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 10px,
    rgba(255, 255, 255, 1) 20px,
    rgba(255, 255, 255, 1) calc(100% - 64px),
    rgba(255, 255, 255, 0.2) calc(100% - calc(64px / 2)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 10px,
    rgba(255, 255, 255, 1) 20px,
    rgba(255, 255, 255, 1) calc(100% - 64px),
    rgba(255, 255, 255, 0.2) calc(100% - calc(64px / 2)),
    transparent 100%
  );
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
