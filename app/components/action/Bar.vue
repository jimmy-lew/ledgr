<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { menuState, menuActive, searchMenuState, searchActive } = useActionBar()
const router = useRouter()
const INDICATOR_PADDING = 4
const activeIndex = ref(0)
const indicatorPos = computed(() => (activeIndex.value * 56) + INDICATOR_PADDING)

const handleSearch = () => {
  router.push('/search')
  searchActive.value = true
}
</script>

<template>
<div
  class="fixed bottom-4 -translate-x-1/2 left-1/2 w-full py-4 flex gap-3 items-end justify-center"
  :class="[
    searchActive ? 'px-6' : 'px-8'
  ]"
>
  <Motion
    v-if="!searchActive"
    as="div"
    :initial="menuState" :animate="menuState"
    :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }"
    class="
    relative overflow-x-hidden
    bg-action backdrop-blur-md
    border border-action-border
    rounded-full
    shadow-lg shadow-black/10"
  >
    <ActionBarMenu />

    <div class="relative left-1 flex items-center justify-evenly w-56 h-14 z-20">
      <ActionBarItem v-for="item, index in items" :item :index @select="activeIndex = index" />
      <ActionBarMenuTrigger />
    </div>

    <Motion
      v-if="!menuActive"
      as="div"
      class="absolute bottom-0.75 w-14 h-12 bg-linear-to-b from-black/7 to-black/12 dark:from-[#2f2f2f] dark:to-[#2f2f2f] rounded-full origin-center group-active:scale-95 z-10"
      :initial="{ left: indicatorPos, opacity: 0 }"
      :animate="{ left: indicatorPos, opacity: 1}"
      :exit="{ opacity: 0, transition: { duration: 0.05 } }"
      :transition="{ left: {type: 'spring', stiffness: 110, damping: 17, mass: 1, duration: 0.1}, opacity: { duration: 1, ease: 'linear' } }"
    />
  </Motion>

  <Motion
    as="button"
    :initial="searchMenuState" :animate="searchMenuState"
    :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }"
    class="relative flex
    bg-action
    backdrop-blur-md
    border border-action-border
    rounded-full
    shadow-lg shadow-black/10"
    @click="handleSearch"
  >
    <div
      class="flex items-center justify-center
      w-14 h-full
      text-xl text-black dark:text-white font-medium
      transition-all duration-200 active:scale-90"
    >
      <UIcon name="lucide:search" />
    </div>
    <UInput v-if="searchActive" placeholder="Search..." variant="none" :ui="{ base: 'pl-0 pr-3' }" class="-ml-2"/>
  </Motion>

  <button
    v-if="searchActive"
    class="flex items-center justify-center
    size-12 bg-action backdrop-blur-md
    border border-action-border rounded-full
    text-xl text-black dark:text-white font-medium
    transition-all duration-200 active:scale-90"
    @click="() => {searchActive = false; router.push('/') }"
  >
    <UIcon name="lucide:x" />
  </button>
</div>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
