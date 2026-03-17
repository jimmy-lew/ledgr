<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { activeItemRef, containerState, activeGroup } = useActionBar()

const indicatorPos = computed(() => Math.max(activeItemRef.value?.offsetLeft ?? 22, 22))

// const handleKeydown = (e: KeyboardEvent) => {
//   const current = selectedItem.value
//   if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
//     e.preventDefault()
//     const dir = e.key === 'ArrowRight' ? 1 : -1
//     const next = (current + dir + props.items.length) % props.items.length
//     select(next, props.items[next]?.to)
//   }
// }
</script>

<template>

<!-- <div class="fixed bottom-8 -translate-x-1/2 left-1/2 w-full px-4 flex gap-3 items-end justify-between">
  <Motion
    as="div"
    :initial="containerState" :animate="containerState"
    :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
    class="relative bg-white w-64 h-14 rounded-full shadow-lg shadow-black/10"
  >
    <ActionBarMenu v-for="item, index in items" :key="index" :item :index />
  </Motion>
  <Motion
    as="div"
    class="bg-white w-14 h-14 rounded-full shadow-lg shadow-black/10"
  />
</div>
 -->
<div class="fixed bottom-4 -translate-x-1/2 left-1/2 w-full px-6 py-4 flex gap-3 items-end justify-between">

    <!-- bg-linear-to-b from-black/10 via-white/30 to-black/5
    dark:from-white/20 dark:via-black/30 dark:to-white/5 -->
  <Motion
    as="div"
    :initial="containerState" :animate="containerState"
    :transition="{ type: 'spring', stiffness: 110, damping: 17, mass: 1 }"
    class="absolute
    bg-white/80 dark:bg-[oklch(25%_0_0/0.3)]
    backdrop-blur-md
    w-64 h-14 rounded-full shadow-lg shadow-black/10"
  >
    <ActionBarMenu v-for="item, index in items" :key="index" :item :index />
  </Motion>
   <Motion
    as="div"
    class="absolute right-6 bg-white dark:bg-[oklch(25%_0_0/0.3)] backdrop-blur-md w-14 h-14 rounded-full shadow-lg shadow-black/10"
  />
  <div class="flex items-center justify-evenly w-60 h-14">
    <ActionBarItem v-for="item, index in items" :item :index />
  </div>
   <div class="flex items-center justify-center size-14 text-xl text-black dark:text-white font-medium transition-all duration-200 active:scale-90">
    <UIcon name="lucide:search" />
  </div>
  <Motion
    tag="div"
    class="absolute bottom-5 w-14 h-12 from-black/7 to-black/12 rounded-full origin-center group-active:scale-95"
    :class="activeGroup ? 'bg-transparent' : 'bg-linear-to-b'"
    :animate="{ left: `${indicatorPos}px`, }"
    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
  />
</div>

</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
