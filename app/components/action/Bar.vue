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
}
</script>

<template>
<div
  class="fixed bottom-4 -translate-x-1/2 left-1/2 w-full py-4 flex gap-3 items-end justify-center"
  :class="[
    searchActive ? 'px-6' : 'px-8'
  ]"
>

  <!-- :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }" -->
  <Motion
    as="div"
    :initial="menuState" :animate="menuState"
    :transition="{ duration: 0.3, ease: 'linear' }"
    class="
    relative
    bg-action backdrop-blur-md
    border border-action-border
    rounded-full
    shadow-lg shadow-black/10"
  >
    <ActionBarMenu />

    <div v-if="!menuActive" class="relative mx-1 flex items-center justify-evenly w-56 h-14">
      <ActionBarItem v-for="item, index in items" :item :index @select="activeIndex = index" />
      <ActionBarMenuTrigger />
    </div>

    <Motion
      v-if="!menuActive && !searchActive"
      as="div"
      class="absolute bottom-0.75 w-14 h-12 bg-linear-to-b from-black/7 to-black/12 dark:from-[#2f2f2f] dark:to-[#2f2f2f] rounded-full origin-center group-active:scale-95"
      :initial="{ left: indicatorPos, opacity: 0 }"
      :animate="{ left: indicatorPos, opacity: 1}"
      :exit="{ opacity: 0, transition: { duration: 0.05 } }"
      :transition="{ left: {type: 'spring', stiffness: 110, damping: 17, mass: 1, duration: 0.1}, opacity: { duration: 1, ease: 'linear' } }"
    />
  </Motion>

  <Motion
    as="button"
    :initial="searchMenuState" :animate="searchMenuState"
    :transition="{ duration: 0.2, ease: 'linear' }"
    class="relative flex font-mono
    bg-action backdrop-blur-md border border-action-border
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
    <UInput v-if="searchActive" autofocus placeholder="Search..." variant="none" :ui="{ base: 'pl-0 pr-3' }" class="-ml-2 text-lg"/>
  </Motion>

  <button
    v-if="searchActive"
    class="flex items-center justify-center
    size-12 bg-action backdrop-blur-md shadow-lg shadow-black/10
    border border-action-border rounded-full
    text-xl text-black dark:text-white font-medium
    transition-all duration-200 active:scale-90"
    @click="() => { router.push('/') }"
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
