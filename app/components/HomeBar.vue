<script setup lang="ts">
const tabs = ['lucide:home', 'lucide:chart-line', 'lucide:scan-line', 'lucide:square', 'lucide:user-round']
const activeTab = ref<string>('lucide:home')
const hoverActive = ref<string | null>(null)
const tabRefs = ref<Record<string, HTMLElement>>({})
const indicatorPos = computed(() => {
  if (hoverActive.value) {
    return tabRefs.value[hoverActive.value]?.offsetLeft ?? 0
  }
  return tabRefs.value[activeTab.value]?.offsetLeft ?? 0
})

const setTabRef = (el: any, tab: string) => {
  if (el) tabRefs.value[tab] = el
}

const selectTab = (tab: string) => {
  isPressed.value = true
  activeTab.value = tab
  setTimeout(() => { isPressed.value = false }, 200)
}

const handleHover = (tab: string) => {
  hoverActive.value = tab
}

const handleHoverEnd = () => {
  hoverActive.value = null
}

const isPressed = ref(false)
</script>

<template>
  <div class="fixed bottom-8 -translate-x-1/2 left-1/2 bg-zinc-850 rounded-full p-2">
    <div class="flex items-center gap-1">
      <button
        v-for="tab in tabs"
        :key="tab"
        :ref="(el) => setTabRef(el, tab)"
        @mouseenter="handleHover(tab)"
        @mouseleave="handleHoverEnd"
        @click="selectTab(tab)"
        class="relative flex items-center justify-center size-8 text-sm font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
        :class="[
          hoverActive === tab ? 'text-black!' : '',
          activeTab === tab && !hoverActive ? 'text-black' : 'text-lime-200',
        ]"
      >
        <UIcon :name="tab" />
      </button>

      <Motion
        tag="div"
        class="absolute size-8 bg-lime-200 rounded-full origin-center"
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
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
