<script setup lang="ts">
</script>

<template>
<div class="flex flex-col gap-2 w-full">
  <div class="relative flex flex-col items-center justify-end w-full h-[40vh] rounded-b-4xl bg-black overflow-hidden">
    <div class="absolute -top-20 -left-25 w-72 h-72 bg-blue-600/40 rounded-full blur-[90px]"></div>
    <div class="absolute -top-10 -left-5 w-64 h-52 bg-emerald-500 rounded-full blur-[100px]"></div>
    <div class="absolute rounded-3xl bg-cover bg-no-repeat bg-[url('https://i.pinimg.com/736x/d6/ac/44/d6ac44091afa772b3744f1ecad3d33e3.jpg')] w-72 h-42 right-12 bottom-18"></div>
    <div class="absolute flex flex-col gap-4 p-8 rounded-3xl bg-white/10 backdrop-blur-sm shadow-md w-72 h-42 left-12 bottom-12">
      <h2 class="text-white font-bold">Balance</h2>
      <h1 class="text-3xl font-header font-black text-white">22,000.00</h1>
    </div>
  </div>

  <div class="px-4 w-full">
    <div class="flex flex-col gap-6 rounded-2xl bg-black py-2 px-4">
      <div class="flex items-center justify-between text-white p-2">
        <div class="flex items-center gap-2">
          <span class="block size-2 rounded-full bg-green-400" />
          Income
        </div>
        <span class="font-bold">1,150</span>
      </div>
      <div class="flex items-center justify-between text-white p-2">
        <div class="flex items-center gap-2">
          <span class="block size-2 rounded-full bg-red-500" />
          Expenses
        </div>
        <span class="font-bold">1,150</span>
      </div>
      <div class="flex items-center justify-between text-white p-2">
        <div class="flex items-center gap-2">
          <span class="block size-2 rounded-full bg-emerald-400" />
          Remainder
        </div>
        <span class="font-bold">1,150</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
</style>
