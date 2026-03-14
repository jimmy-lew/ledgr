<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { activeItemRef, containerState, subContainerState, selectedItem, select, activeGroup, hoveredItem } = useNavBar()

const indicatorPos = computed(() => Math.max(activeItemRef.value?.offsetLeft ?? 8, 8))

const handleKeydown = (e: KeyboardEvent) => {
  const current = selectedItem.value
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (current + dir + props.items.length) % props.items.length
    select(next, props.items[next]?.to)
  }
}
</script>

<template>
  <Motion as="div" class="fixed bottom-8 -translate-x-1/2 left-1/2 z-2 p-2 flex items-center gap-1 group" @keydown="handleKeydown" tabindex="0" role="tablist">
    <NavItem v-for="item, index in items" :item :index />
    <Motion
      tag="div"
      class="absolute size-8 bg-black dark:bg-white rounded-full origin-center group-active:scale-95"
      :animate="{ left: `${indicatorPos}px`, }"
      :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
    />
  </Motion>

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
  </Motion>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
