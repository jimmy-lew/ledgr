<script setup lang="ts">
withDefaults(defineProps<{
  title?: string,
  icons?: string[]
}>(), {
  title: 'Home',
  icons: () => ['lucide:edit', 'lucide:ellipsis']
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-[oklch(96%_0_0)] dark:bg-[#070707] font-mono pt-4 gap-3.5">
    <div class="flex items-center justify-between w-full pt-6 px-5">
      <h1 class="text-2xl font-bold">{{ title }} </h1>
      <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-white/5 h-12 px-3.75 py-2 text-lg">
        <UIcon v-for="icon, i in icons" :key="i" :name="icon" class="transition-all duration-75 active:scale-90"/>
      </div>
    </div>
    <slot />
  </div>
  <ActionBar class="z-50"/>
</template>

<style scoped>

</style>
