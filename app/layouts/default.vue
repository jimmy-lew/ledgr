<script setup lang="ts">
const items = [
  { icon: 'lucide:home' },
  { icon: 'lucide:chart-line' },
  {
    icon: 'lucide:plus',
    items: [
      { icon: 'lucide:scan-line', title: 'Add statement' },
      { icon: 'lucide:flag', title: 'Add goal' },
      { icon: 'lucide:refresh-cw', title: 'Add subscription' },
    ],
  },
  { icon: 'lucide:chart-pie' },
  { icon: 'lucide:user-round' }
]
</script>

<template>
<div class="relative">
  <div class="min-h-screen flex flex-col bg-[#edf0ea] dark:bg-[oklch(15%_0_0)]">
    <slot />
  </div>
   <HomeBar :items/>
</div>
</template>

<style scoped>

</style>
