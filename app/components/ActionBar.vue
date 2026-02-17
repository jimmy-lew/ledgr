<template>
  <div ref="navRef" class="flex items-center justify-center gap-2 rounded-2xl bg-transparent absolute -translate-x-1/2 left-1/2 bottom-14 z-2">
    <button
      v-for="(item, index) in items"
      :key="item.title"
      @click="handleClick(index)"
      @mouseenter="handleItemHover(index)"
      @mouseleave="handleItemLeave"
      class="item flex items-center justify-center gap-2 hover:bg-default hover:invert duration-300 transition-all py-3 px-4 rounded-2xl"
    >
      <Icon :name="item.icon" class="size-6" />
      <span class="font-bold">{{ item.title }}</span>
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
    class="absolute bg-default backdrop-blur-xl -translate-x-1/2 left-1/2 bottom-14 overflow-hidden"
    >
    <Motion
      v-for="(item, index) in items"
      :key="item.title"
      :ref="(el) => setDetailRef(el, index)"
      @mouseleave="handleDetailLeave"
      :initial="{ opacity: 0, zIndex: 1 }"
      :animate="{
        opacity: activeDetail === index ? 1 : 0,
        zIndex: activeDetail === index ? 2 : 1
      }"
      :transition="{ duration: 0.3 }"
      class="p-4 flex flex-col items-center absolute min-w-110.5 w-max gap-1 overflow-y-scroll max-h-64"
      :style="{ pointerEvents: activeDetail === index ? 'auto' : 'none' }"
    >
      <button @click="handleSubItemClick(index, subItemIndex, subItem)" v-for="(subItem, subItemIndex) in item.items" :key="subItem.title" class="w-full group transition-transform duration-75" :class="{ 'scale-95 bg-black/5': activeSubItemKey === `${index}-${subItemIndex}` }">
        <div class="flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-3 hover:px-3 duration-300 w-full mx-auto px-2">
          <!-- Icon or Gradient Box -->
          <div
            v-if="subItem.iconClass"
            :class="['w-16 h-16 rounded-xl shrink-0', subItem.iconClass]"
          ></div>
          <Icon
            v-else-if="subItem.icon"
            :name="subItem.icon"
            class="size-6 shrink-0 opacity-75"
          />

          <!-- Content -->
          <div class="w-full flex flex-col items-start whitespace-nowrap">
            <div class="flex items-center gap-3 w-full justify-between">
              <div class="flex items-center gap-3">
                 <span class="font-bold">{{ subItem.title }}</span>
              </div>
               <!-- Right Side: Trailing info -->
               <div class="flex items-center gap-3 ml-auto pl-4">
                 <span v-if="subItem.subtrailing" class="block shrink-0 py-1 px-2 text-sm rounded-lg opacity-80 border border-black/50">
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

<script setup lang="ts">
import { ref, computed } from 'vue'

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
  title: string
  icon: string
  items: ActionBarSubItem[]
}

const props = withDefaults(defineProps<{
  items?: ActionBarItem[]
}>(), {
  items: () => [
    {
      title: "Apps",
      icon: "lucide:layout-grid",
      items: [
        {
          title: "Gather",
          description: "Virtual Office",
          subtrailing: "Mac",
          iconClass: "bg-gradient-to-br from-purple-400 to-purple-600",
          action: () => { console.log('test') }
        },
        {
          title: "Slack",
          description: "Communication App",
          subtrailing: "Windows",
          iconClass: "bg-gradient-to-br from-blue-400 to-blue-600"
        },
        {
          title: "Discord",
          description: "Community",
          subtrailing: "Windows",
          iconClass: "bg-gradient-to-br from-red-400 to-orange-600"
        },
        {
          title: "Telegram",
          description: "Community",
          subtrailing: "Linux",
          iconClass: "bg-gradient-to-br from-green-400 to-emerald-600"
        },
      ]
    },
    {
      title: "Components",
      icon: "lucide:blocks",
      items: [
        {
          title: "Action Bar",
          subtrailing: "Dynamic",
          trailing: "06 - 12",
          icon: "lucide:component"
        },
        {
          title: "Image Expand",
          subtrailing: "Overlay",
          trailing: "05 - 12",
          icon: "lucide:maximize"
        },
        {
          title: "Read Time",
          subtrailing: "Scroll",
          trailing: "04 - 12",
          icon: "lucide:clock"
        }
      ]
    },
    {
      title: "Notes",
      icon: "lucide:clipboard-list",
      items: [
        {
          title: "Changelog using GitHub",
          trailing: "Jun, 24",
          icon: "lucide:github"
        },
        {
          title: "Feedback in Slack",
          trailing: "May, 24",
          icon: "lucide:message-circle"
        }
      ]
    }
  ]
})

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
      width: 442,
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
  activeIndex.value = index
  const el = detailRefs.value[index]
  if (el) {
    const w = Math.max(el.scrollWidth, 410)
    const h = Math.min(el.scrollHeight + 64, 320)

    measuredDimensions.value = { width: w, height: h }
  }

  activeDetail.value = index
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
}

watch([activeIndex, activeDetail], ([ni, nd]) => { console.log(ni, nd) })

onMounted(() => {
  navSize.value = navRef.value?.scrollWidth ?? 410
  measuredDimensions.value = { width: navSize.value, height: 48 }
})
</script>

<style scoped>
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
