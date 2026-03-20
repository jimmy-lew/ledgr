<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { menuState, menuActive } = useActionBar()
const indicatorPos = computed(() => 36)
</script>

<template>
<div class="fixed bottom-4 -translate-x-1/2 left-1/2 w-full px-8 py-4 flex gap-3 items-end justify-between">
  <!-- BG Overlay -->
  <Motion
    as="div"
    :initial="menuState" :animate="menuState"
    :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }"
    class="absolute
    bg-action backdrop-blur-md
    border border-action-border
    rounded-full
    shadow-lg shadow-black/10"
  >
    <ActionBarMenu />
  </Motion>

  <!-- Main Nav -->
  <div class="relative left-1 flex items-center justify-evenly w-56 h-14 z-20">
    <ActionBarItem v-for="item, index in items" :item :index />
    <ActionBarMenuTrigger />
  </div>

  <Motion
    tag="div"
    class="absolute bottom-5 w-14 h-12 from-black/7 to-black/12 dark:from-[#2f2f2f] dark:to-[#2f2f2f] rounded-full origin-center group-active:scale-95 z-10"
    :class="menuActive ? 'bg-transparent' : 'bg-linear-to-b'"
    :animate="{ left: `${indicatorPos}px`, }"
    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
  />

  <!-- Search BG Overlay -->
  <Motion
    as="div"
    :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }"
    class="absolute right-8
    bg-action
    backdrop-blur-md
    border border-action-border
    w-14 h-14 rounded-full
    shadow-lg shadow-black/10"
  />
  <!-- Search -->
  <div
    class="flex items-center justify-center
    size-14
    text-xl text-black dark:text-white font-medium
    transition-all duration-200 active:scale-90"
  >
    <UIcon name="lucide:search" />
  </div>
</div>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
