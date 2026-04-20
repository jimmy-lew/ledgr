<script setup lang="ts">
const route = useRoute()

console.log(route)
</script>

<template>
<div class="h-16"></div>
<div class="flex flex-col items-center px-10 pb-16">
  <div class="max-w-160">
    <h1 class="pl-4 flex flex-col w-full items-start text-2xl font-medium">Settings</h1>
    <NuxtPage />
  </div>
</div>
</template>
