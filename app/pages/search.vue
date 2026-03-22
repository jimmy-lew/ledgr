<script setup lang="ts">

const { searchActive } = useActionBar()

onMounted(() => {
  searchActive.value = true
})
</script>

<template>
<div class="flex items-center justify-between w-full pt-6">
  <h1 class="text-2xl font-bold">Search</h1>

  <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-white/5 h-12 px-3.75 py-2 text-lg">
    <UIcon name="lucide:edit" />
  </div>
</div>
<div class="flex flex-col w-full gap-1">
  <span class="font-medium text-muted text-sm mb-2">Recently viewed</span>
  <div class="w-full bg-black/5 dark:bg-white/5 h-12 rounded-md"></div>
  <div class="w-full bg-black/5 dark:bg-white/5 h-12 rounded-md"></div>
  <div class="w-full bg-black/5 dark:bg-white/5 h-12 rounded-md"></div>
  <div class="w-full bg-black/5 dark:bg-white/5 h-12 rounded-md"></div>
  <div class="w-full bg-black/5 dark:bg-white/5 h-12 rounded-md"></div>
</div>
</template>
