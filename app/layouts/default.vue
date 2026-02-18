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
  { icon: 'lucide:square' },
  { icon: 'lucide:user-round' }
]
</script>

<template>
<div class="relative">
  <div class="min-h-screen flex flex-col bg-[#edf0ea] dark:bg-default">
    <slot />
  </div>
   <HomeBar :items/>
</div>
</template>

<style scoped>

</style>
