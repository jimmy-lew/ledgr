<script setup lang="ts">
import type { NavItem } from '~/types';

const props = defineProps<{ item: NavItem, index: number }>()
const emit = defineEmits<{ select: [] }>()
const router = useRouter()
const handleSelect = (e: Event) => {
  emit('select')
  if (props.item.to) router.push(props.item.to)
}
</script>

<template>
	<button
		@click="handleSelect"
    class="relative flex items-center justify-center h-12 text-xl font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
  >
    <UIcon :name="item.icon" />
  </button>
</template>
