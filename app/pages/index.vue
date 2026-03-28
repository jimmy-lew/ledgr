<script setup lang="ts">

const { searchActive } = useActionBar()
</script>

<template>

<div class="flex items-center justify-between w-full pt-6">
  <h1 class="text-2xl font-bold">Home</h1>
  <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-white/5 h-12 px-3.75 py-2 text-lg">
    <UIcon name="lucide:edit" />
    <UIcon name="lucide:ellipsis" />
  </div>
</div>
<div class="flex flex-col items-center rounded-2xl bg-white dark:bg-[oklch(0.1448_0_0)] shadow-base-sm px-6 py-3 aspect-video">
    <div class="flex flex-col items-center justify-center w-full h-full">
        <span class="text-muted">Balance</span>
        <h1 class="text-3xl font-bold">$20,000.00</h1>
    </div>
</div>
<HomeGlanceInsights />
<HomeWidget />
<HomeGlanceTransactions />
</template>

<style scoped>
</style>
