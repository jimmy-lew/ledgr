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

<div class="flex flex-col gap-1">
  <span class="font-medium text-muted text-sm mb-3 px-4">Recently viewed</span>
  <div class="flex flex-col w-full gap-1 px-1">
    <div class="w-full flex items-center gap-2 px-3 py-2 rounded-md active:bg-black/5 dark:active:bg-white/5">
      <UIcon name="icon-park-solid:check-one" class="text-[#555fbc] text-sm font-bold size-5" />
      <span class="font-medium">
        Load Game Feature
      </span>
    </div>
  </div>
</div>

</template>
