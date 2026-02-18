<script setup lang="ts">
const _items = [{
  title: 'Home',
  icon: 'lucide:home'
}, {
  title: 'Transactions',
  icon: 'lucide:file-clock',
  items: [{
    title: 'Expenses',
    icon: 'lucide:chart-line',
    subtrailing: 'WIP'
  }, {
    title: 'Goals',
    icon: 'lucide:flag',
    subtrailing: 'WIP'
  }, {
    title: 'Subscriptions',
    icon: 'lucide:refresh-cw',
    subtrailing: 'WIP'
  }]
}, {
  title: 'Settings',
  icon: 'lucide:bolt',
  items: [{
    title: 'Profile',
    icon: 'lucide:user-round',
    subtrailing: 'WIP'
  }]
}]
</script>

<template>
<div class="relative">
  <div class="min-h-screen flex flex-col bg-[#edf0ea] dark:bg-default">
    <slot />
    <!-- <main class="flex-1 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5 p-7 max-md:p-4 max-w-345 w-full mx-auto items-start" >
    </main> -->
  </div>
   <ActionBar :items="_items" />
  <!-- <HomeBar /> -->
</div>
</template>

<style scoped>

</style>
