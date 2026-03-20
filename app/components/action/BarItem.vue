<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ item: NavItem, index: number }>()
const { menuActive } = useActionBar()
</script>

<template>
	<button
		@click="() => {}"
    class="relative flex items-center justify-center w-14 h-12 text-xl font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
    :class="[ menuActive ? 'text-transparent' : 'text-black dark:text-white' ]"
  >
    <UIcon :name="item.icon" />
  </button>
</template>
