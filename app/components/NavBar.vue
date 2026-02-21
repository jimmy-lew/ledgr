<script setup lang="ts">
interface SubItem {
  type?: 'divider' | undefined
  icon?: string
  title?: string
  click?: () => void
}

interface Item {
  icon: string
  to?: string
  items?: SubItem[]
}

const props = defineProps<{ items: Item[] }>()

const router = useRouter()

const activeTab = ref<string>('lucide:home')
const isPressed = ref(false)
const hoverActive = ref<string | null>(null)

const navRef = ref<HTMLElement|null>(null)
const navSize = ref(192)
const tabRefs = shallowRef<Record<string, HTMLElement>>({})
const subItemRefs = shallowRef<Record<string, HTMLElement>>({})
const subItems = computed(() => props.items.filter(i => i.items && i.items.length > 0))
const hasSubItems = computed(() => Boolean(subItemRefs.value[hoverActive.value ?? '']))

const containerInitState = computed(() => ({ width: navSize.value, height: 48, borderRadius: 999 }))
const containerState = ref({ width: 192, height: 48, borderRadius: 999 })
const containerAnimation = computed(() => {
  if (hasSubItems.value) return containerState.value
  return containerInitState.value
})

const subContainerAnimation = computed(() => {
  if (hasSubItems.value) return { width: containerState.value.width - 2, height: containerState.value.height - 2, borderRadius: containerState.value.borderRadius - 2 }
  return { width: containerInitState.value.width - 2, height: containerInitState.value.height - 2, borderRadius: containerInitState.value.borderRadius - 2 }
})

const indicatorPos = computed(() => tabRefs.value[hoverActive.value ?? activeTab.value]?.offsetLeft ?? 8)

const setTabRef = (el: any, tab: string) => { if (el) tabRefs.value[tab] = el }
const setSubItemRef = (el: any, tab: string) => { if (el) subItemRefs.value[tab] = el.$el || el }

const selectTab = (tab: string, to?: string) => {
  isPressed.value = true
  activeTab.value = tab
  if (to) router.push(to)
  setTimeout(() => { isPressed.value = false }, 200)
}

const handleHover = (tab: string) => {
  hoverActive.value = tab
  const el = subItemRefs.value[tab]
  if (!el) return
  const { width, height } = el.getBoundingClientRect()
  containerState.value = {
    width: Math.max(width, navSize.value + 64),
    height: height + 48,
    borderRadius: 18,
  }
}

const handleHoverEnd = () => {
  setTimeout(() => {
    const isHoveringSubItem = Object.values(subItemRefs.value).some(el => el?.matches?.(':hover'))
    const isHoveringItem = Object.values(tabRefs.value).some(el => el?.matches?.(':hover'))
    if (!isHoveringItem && !isHoveringSubItem) hoverActive.value = null
  }, 250)
}
</script>

<template>
  <div ref="navRef" class="fixed bottom-8 -translate-x-1/2 left-1/2 p-2 z-2">
    <div class="flex items-center gap-1">
      <button
        v-for="{ icon: tab, to } in items"
        :key="tab"
        :ref="(el) => setTabRef(el, tab)"
        @mouseenter="handleHover(tab)"
        @mouseleave="handleHoverEnd"
        @click="selectTab(tab, to)"
        class="relative flex items-center justify-center size-8 text-sm font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
        :class="[
          hoverActive === tab ? 'text-white! dark:text-black!' : '',
          activeTab === tab && !hoverActive ? 'text-white dark:text-black' : 'text-black dark:text-white',
        ]"
      >

        <UIcon :name="tab" />
      </button>

      <Motion
        tag="div"
        class="absolute size-8 bg-black dark:bg-white rounded-full origin-center"
        :initial="false"
        :animate="{
          left: `${indicatorPos}px`,
          scale: isPressed ? 0.9 : 1
        }"
        :transition="{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }"
      />
    </div>
  </div>

  <Motion
    :initial="containerInitState"
    :animate="containerAnimation"
    :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
    class="
      fixed bottom-8 -translate-x-1/2 left-1/2
      p-px shadow-xl
      bg-linear-to-b from-black/10 via-white/30 to-black/5
      dark:from-white/20 dark:via-black/30 dark:to-white/5
      backdrop-blur-[2px]
      "
  >
     <Motion
      as="div"
      :initial="containerInitState"
      :animate="subContainerAnimation"
      :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
      class="fixed bg-white/70 dark:bg-black/70"
    />
    <Motion
      v-for="{ icon: tab, items } in subItems"
      :key="tab"
      :ref="(el) => setSubItemRef(el, tab)"
      :initial="{ opacity: 0, zIndex: 1 }"
      :animate="{
        opacity: hoverActive === tab ? 1 : 0,
        zIndex: hoverActive === tab ? 2 : 1
      }"
      :transition="{ duration: 0.3 }"
      :class="['pt-3 px-3 flex flex-col items-center absolute overflow-y-scroll w-full']"
      @mouseleave="handleHoverEnd"
    >
      <button
        v-for="{type, icon: name, title, click} in items"
        @click="click?.()"
        class="w-full group text-sm transition-all duration-75 active:scale-90"
      >
        <USeparator v-if="type === 'divider'" class="px-2 py-0.5" :ui="{ border: 'bg-black/5 dark:bg-white/5' }"/>
        <div
          v-else
          class="
          flex items-center gap-3
          rounded-lg p-2 mx-auto w-full
          duration-300
          group-active:bg-black/5 group-hover:bg-black/5
          dark:group-active:bg-white/5 dark:group-hover:bg-white/5
          group-active:px-3 group-hover:px-3
          "
        >
          <Icon v-if="name" :name/>
          {{ title }}
        </div>
      </button>
    </Motion>
  </Motion>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
