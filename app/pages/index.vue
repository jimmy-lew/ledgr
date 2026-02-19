<script setup lang="ts">
</script>

<template>
<div class="relative flex flex-col items-center min-h-screen w-full bg-[oklch(96%_0_0)] dark:bg-[oklch(0%_0_0)] font-mono overflow-hidden">
  <!-- <div class="relative flex flex-col items-center min-h-screen w-full bg-default overflow-hidden"> -->
   <!-- <div class="absolute -top-20 -left-25 w-72 h-72 bg-blue-600/40 rounded-full blur-[90px]"></div>
  <div class="absolute -top-10 -left-5 w-64 h-52 bg-emerald-500 rounded-full blur-[100px]"></div> -->
  <div class="absolute rounded-xl bg-cover bg-no-repeat bg-[url('https://i.pinimg.com/736x/d6/ac/44/d6ac44091afa772b3744f1ecad3d33e3.jpg')] w-72 h-42 right-12 top-12"></div>
  <div class="absolute flex flex-col gap-4 p-8 rounded-xl bg-white/10 backdrop-blur-sm shadow-md w-72 h-42 left-12 top-18">
    <h2 class="text-white font-bold">Balance</h2>
    <div class="flex items-start justify-start gap-1">
      <h1 class="text-3xl font-black text-white">22000.00</h1>
      <span class="text-xs text-green-400 filter drop-shadow-lg drop-shadow-green-500">
        <UIcon name="lucide:chevron-up"/>
        67%
      </span>
    </div>
  </div>
  <HomeGlanceInsights />
  <HomeWidgets />
  <HomeGlanceTransactions />
</div>
</template>

<style scoped>
</style>
