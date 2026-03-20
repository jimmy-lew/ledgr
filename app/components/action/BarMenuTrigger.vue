<script setup lang="ts">
const { toggleMenu, menuActive } = useActionBar()
const el = ref()

onClickOutside(el, toggleMenu)
defineShortcuts({ escape: toggleMenu })
</script>

<template>
	<button
    @click="() => toggleMenu()"
    class="relative flex items-center justify-center w-14 h-12 text-xl font-medium transition-all duration-200 active:scale-90 rounded-full z-10"
    :class="[ menuActive ? 'text-transparent' : 'text-black dark:text-white' ]"
  >
    <UIcon name="lucide:chevrons-up-down" />
  </button>
</template>
