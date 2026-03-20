<script setup lang="ts">

</script>

<template>
	<div class="relative flex flex-col items-center font-mono px-8 py-4 gap-6">
    <div class="flex items-center justify-between w-full pt-8">
      <h1 class="text-xl font-black">Search</h1>
      <div class="flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 size-12 text-lg">
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
	</div>
</template>
