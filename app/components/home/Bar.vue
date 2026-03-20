<script setup lang="ts">
const items = [
  { icon: 'lucide:home', to: '/' },
  { icon: 'lucide:chart-pie', to: '/budget' },
  { icon: 'lucide:scan-line', to: '' },
]
</script>

<template>
  <ActionBar :items class="rounded-3xl"/>
</template>
