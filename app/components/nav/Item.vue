<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ item: NavItem, index: number }>()
const { setItemRef, handleHover, handleHoverEnd, hoveredItem, selectedItem, select } = useNavBar()

const isHovered = computed(() => hoveredItem.value === props.index)
const isSelected = computed(() => selectedItem.value === props.index)
</script>

<template>
	<button
    :ref="setItemRef(index)"
    @mouseenter="handleHover(index)"
    @mouseleave="handleHoverEnd"
    @click="select(index, item.to)"
    class="relative flex items-center justify-center size-8 text-sm font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
    :class="[
      isHovered ? 'text-white! dark:text-black!' : '',
      (isSelected && hoveredItem < 0) ? 'text-white dark:text-black' : 'text-black dark:text-white'
    ]"
  >
    <UIcon :name="item.icon" />
  </button>
</template>
