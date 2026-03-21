<script setup lang="ts">
const { toggleMenu } = useActionBar()
</script>

<template>
	<button
		@click="toggleMenu"
    class="relative flex items-center justify-center w-14 h-12 text-xl font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
  >
    <UIcon name="lucide:chevrons-up-down" />
  </button>
</template>
