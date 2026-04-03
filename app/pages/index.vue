<script setup lang="ts">

const { searchActive } = useActionBar()
</script>

<template>

<div class="flex flex-col gap-4 px-2">
  <!-- <div class="flex flex-col items-center rounded-2xl bg-white dark:bg-[oklch(0.1448_0_0)] shadow-base-sm px-6 py-3 aspect-video">
      <div class="flex flex-col items-center justify-center w-full h-full">
          <span class="text-muted">Balance</span>
          <h1 class="text-3xl font-bold">$20,000.00</h1>
      </div>
  </div>
  <HomeGlanceInsights />
  <HomeWidget /> -->
  <HomeGlanceTransactions />
</div>

</template>

<style scoped>
</style>
