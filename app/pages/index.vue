<script setup lang="ts">

const { searchActive } = useActionBar()

onMounted(() => {
  searchActive.value = false
})
</script>

<template>

<div class="flex items-center justify-between w-full pt-6">
  <h1 class="text-2xl font-bold">Home</h1>
  <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-white/5 h-12 px-4 py-2 text-lg">
    <UIcon name="lucide:edit" />
    <UIcon name="lucide:ellipsis" />
  </div>
</div>
<UTextarea
  variant="none"
  placeholder="Set a sleep schedule and ditch screens before bed."
  :max-rows="3"
  autoresize
  :ui="{ base: 'text-2xl px-0' } "
/>
<HomeGlanceInsights />
<HomeWidget />
<HomeGlanceTransactions />

<!-- <div class="relative flex flex-col items-center min-h-screen w-full font-mono overflow-hidden pb-24">
  Test -->
  <!-- <div class="absolute rounded-xl bg-cover bg-no-repeat bg-[url('https://i.pinimg.com/736x/d6/ac/44/d6ac44091afa772b3744f1ecad3d33e3.jpg')] w-72 h-42 right-12 top-12 sm:left-12"></div>
  <div class="absolute flex flex-col gap-4 p-8 rounded-xl bg-white/10 backdrop-blur-sm sm:backdrop-blur-xs shadow-md w-72 h-42 left-12 top-18 sm:top-12">
    <h2 class="text-white font-bold">Balance</h2>
    <div class="flex items-start justify-start gap-1">
      <h1 class="text-3xl font-black text-white">19128.33</h1>
      <span class="text-xs text-green-400 filter drop-shadow-lg drop-shadow-green-500">
        <UIcon name="lucide:chevron-up"/>
        67%
      </span>
    </div>
  </div>
  <HomeGlanceInsights />
  <HomeWidget />
  <HomeGlanceTransactions /> -->
<!-- </div> -->
</template>

<style scoped>
</style>
