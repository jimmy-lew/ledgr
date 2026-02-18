<script setup lang="ts">
</script>

<template>
<div class="relative flex flex-col items-center min-h-screen w-full bg-[oklch(96%_0_0)] overflow-hidden">
  <!-- <div class="relative flex flex-col items-center min-h-screen w-full bg-default overflow-hidden"> -->
   <!-- <div class="absolute -top-20 -left-25 w-72 h-72 bg-blue-600/40 rounded-full blur-[90px]"></div>
  <div class="absolute -top-10 -left-5 w-64 h-52 bg-emerald-500 rounded-full blur-[100px]"></div> -->
  <div class="absolute rounded-xl bg-cover bg-no-repeat bg-[url('https://i.pinimg.com/736x/d6/ac/44/d6ac44091afa772b3744f1ecad3d33e3.jpg')] w-72 h-42 right-12 top-12"></div>
  <div class="absolute flex flex-col gap-4 p-8 rounded-xl bg-white/10 backdrop-blur-sm shadow-md w-72 h-42 left-12 top-18">
    <h2 class="text-white font-bold">Balance</h2>
    <div class="flex items-start justify-start gap-1">
      <h1 class="text-3xl font-header font-black text-white">22,000.00</h1>
      <span class="text-xs text-green-400">
        <UIcon name="lucide:chevron-up"/>
        67%
      </span>
    </div>
  </div>
  <div class="relative px-6 w-full mt-64">
    <div class="flex items-center justify-between rounded-2xl bg-default p-2">
      <div class="flex flex-col gap-1 p-3 w-1/2">
        <span class="text-xs text-muted">
          Last month
        </span>
        <div class="flex items-start justify-start gap-1">
          <span class="text-xl font-bold">
            - 1,000
          </span>
          <span class="text-xs text-green-400">
            <UIcon name="lucide:chevron-down"/>
            1.5%
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-1 p-3 w-1/2">
        <span class="text-xs text-muted">
          Weekly
        </span>
        <div class="flex items-start justify-start gap-1">
          <span class="text-xl font-bold">
            - 52
          </span>
          <span class="text-xs text-green-400">
            <UIcon name="lucide:chevron-down"/>
            150.2%
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="px-6 w-full mt-6 overflow-y-auto py-2">
    <div class="flex min-w-fit gap-2 overflow-x-scroll">
      <div class="
        flex items-center justify-center
        rounded-lg p-2
        border-2 border-dashed border-default
        hover:bg-white/20
        active:scale-95
        transition-all duration-300
        w-12 h-48
      ">
        <UIcon name="lucide:plus" />
      </div>
      <div class="flex flex-col rounded-xl p-2 bg-default w-40 h-48">
      </div>
      <div class="flex flex-col rounded-xl p-2 bg-default w-40 h-48">
      </div>
    </div>
  </div>
  <div class="px-6 w-full flex items-center gap-1 mt-1">
    <div class="h-1 w-6 rounded-full bg-white"></div>
    <div class="h-1 w-2 rounded-full bg-black/10"></div>
    <div class="h-1 w-2 rounded-full bg-black/10"></div>
  </div>
  <div class="px-6 w-full flex flex-col mt-3 gap-2">
    <h3 class="text-muted">Recent transactions</h3>
    <div class="flex flex-col gap-1">
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
      <div class="h-16 w-full rounded-lg bg-white"></div>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>
