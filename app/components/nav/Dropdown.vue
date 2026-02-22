<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{item: NavItem, index: number}>()

const { setSubItemRef, handleHoverEnd, hoveredItem, selectedItem, selectedSubItem, subItemSelect } = useNavBar()

const isHovered = computed(() => hoveredItem.value === props.index)
const isSelected = computed(() => selectedItem.value === props.index)
const initial = { opacity: 0, zIndex: 1 }
const animate = computed(() => {
  return { opacity: isHovered.value ? 1 : 0, zIndex: isHovered.value ? 2 : 1 }
})
</script>

<template>
	<Motion
	  v-if="item.items"
    :ref="setSubItemRef(index)"
    :initial
    :animate
    :transition="{ duration: 0.3 }"
    :class="['pt-3 px-3 flex flex-col items-center absolute overflow-y-scroll w-full']"
    @mouseleave="handleHoverEnd"
  >
    <button
      v-for="({type, icon: name, title, click}, i) in item.items"
      :key="i"
      class="w-full group text-sm transition-all duration-75 active:scale-90"
      @click="subItemSelect(index, i, click)"
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
        :class="isSelected && selectedSubItem === i ? 'bg-black/10 dark:bg-white/5' : ''"
      >
        <Icon v-if="name" :name/>
        {{ title }}
      </div>
    </button>
  </Motion>
</template>
