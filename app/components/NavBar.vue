<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ items: NavItem[] }>()

const { activeItemRef, containerState, subContainerState } = useNavBar()

const indicatorPos = computed(() => Math.max(activeItemRef.value?.offsetLeft ?? 8, 8))
</script>

<template>
  <div ref="navRef" class="fixed bottom-8 -translate-x-1/2 left-1/2 p-2 z-2">
    <div class="flex items-center gap-1 group">
      <NavItem v-for="item, index in items" :item :index />
      <Motion
        tag="div"
        class="absolute size-8 bg-black dark:bg-white rounded-full origin-center group-active:scale-95"
        :initial="false"
        :animate="{ left: `${indicatorPos}px`, }"
        :transition="{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }"
      />
    </div>
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
    <NavDropdown
      v-for="item, index in items"
      :key="index"
      :item
      :index
    />
  </Motion>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
