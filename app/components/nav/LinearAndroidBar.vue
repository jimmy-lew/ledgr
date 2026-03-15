<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { activeItemRef, containerState, activeGroup } = useNavBar()

const indicatorPos = computed(() => Math.max(activeItemRef.value?.offsetLeft ?? 8, 8))

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

<div class="fixed bottom-8 -translate-x-1/2 left-1/2 w-full px-4 flex gap-3 items-end justify-between">
  <Motion
    as="div"
    :initial="containerState" :animate="containerState"
    :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
    class="bg-white w-64 h-14 rounded-full shadow-lg shadow-black/10"
  />
  <Motion
    as="div"
    class="bg-white w-14 h-14 rounded-full shadow-lg shadow-black/10"
  />
</div>

<div class="fixed bottom-4 -translate-x-1/2 left-1/2 w-full p-4 flex gap-3 items-center justify-between">
  <div class="flex items-center justify-evenly w-64">
    <NavItem v-for="item, index in items" :item :index />
  </div>
   <div class="flex items-center justify-center size-14 text-xl text-black font-medium">
    <UIcon name="lucide:search" />
  </div>
  <Motion
    tag="div"
    class="absolute w-14 h-12 from-black/7 to-black/12 rounded-full origin-center group-active:scale-95"
    :class="activeGroup ? 'bg-transparent' : 'bg-linear-to-b'"
    :animate="{ left: `${indicatorPos}px`, }"
    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
  />
</div>

 <!-- <div class="fixed bottom-8 -translate-x-1/2 left-1/2 w-full px-2 flex items-end justify-between">
  <Motion
    as="div"
    :initial="containerState"
    :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
    class="left-3 relative bg-white rounded-full shadow-lg shadow-black/10"
  />
   <Motion
    as="div"
    class="relative mx-2 bg-white size-12 rounded-full shadow-lg shadow-black/10"
  />
</div> -->

 <!-- <div class="fixed bottom-6 -translate-x-1/2 left-1/2 w-full p-2 flex items-center justify-between">
  <div class="grow flex items-center justify-evenly">
    <NavItem v-for="item, index in items" :item :index />
  </div>
  <button class="relative grow-0 flex items-center justify-center mx-2 size-12 text-black font-medium transition-all duration-200 active:scale-90">
    <UIcon name="lucide:search" class="font-black"/>
  </button>
  <Motion
    tag="div"
    class="absolute w-12 h-10 from-black/7 to-black/12 rounded-full origin-center group-active:scale-95"
    :class="activeGroup ? 'bg-transparent' : 'bg-linear-to-b'"
    :animate="{ left: `${indicatorPos}px`, }"
    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
  />
</div> -->


<!-- <div class="fixed bottom-0 w-screen h-20 bg-linear-to-b from-transparent to-white/90 z-0">
</div> -->
  <!-- <Motion as="div" class="fixed bottom-8 -translate-x-1/2 left-1/2 z-2 p-2 flex items-center gap-1 group" @keydown="handleKeydown" tabindex="0" role="tablist">
    <NavItem v-for="item, index in items" :item :index />
    <Motion
      tag="div"
      class="absolute size-8 bg-black dark:bg-white rounded-full origin-center group-active:scale-95"
      :animate="{ left: `${indicatorPos}px`, }"
      :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
    />
  </Motion>

  <div class="fixed bottom-8 -translate-x-1/2 left-1/2 flex items-center">

  </div>
  <Motion
    :initial="containerState" :animate="containerState"
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
       :initial="subContainerState" :animate="subContainerState"
       :transition="{ type: 'spring', stiffness: 170, damping: 26, mass: 1 }"
      class="fixed bg-white/70 dark:bg-black/70"
    />
    <NavDropdown v-for="item, index in items" :key="index" :item :index />
  </Motion> -->
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
