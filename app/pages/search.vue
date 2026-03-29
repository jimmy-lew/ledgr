<script setup lang="ts">
definePageMeta({
  layout: {
    props: {
      title: 'Search',
      icons: ['lucide:edit']
    },
  },
})
</script>

<template>
<!-- <div class="flex items-center justify-between w-full pt-6">
  <h1 class="text-2xl font-bold">Search</h1>
  <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-white/5 h-12 px-3.75 py-2 text-lg">
    <UIcon name="lucide:edit" class="transition-all duration-75 active:scale-90"/>
  </div>
</div> -->
<div class="flex flex-col w-full gap-1">
  <span class="font-medium text-muted text-sm mb-3">Recently viewed</span>
  <div class="w-full flex items-center gap-2 py-2">
    <UIcon name="icon-park-solid:check-one" class="text-[#555fbc] text-sm font-bold size-5" />
    <span class="font-medium">
      Load Game Feature
    </span>
  </div>
</div>
</template>
