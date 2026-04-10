<script setup lang="ts">

const isCollapsed = ref(false)

defineShortcuts({
  '[': () => { isCollapsed.value = !isCollapsed.value }
})

const sidebarUi = computed(() => ({
  root: [
    'border-0 min-w-2 transition-[width_400ms,top_250ms] ease-out',
    isCollapsed.value ? 'top-16 -left-16' : 'top-0 left-0'
  ]
}))
</script>

<template>
  <UDashboardSidebar
    v-model:collapsed="isCollapsed"
    collapsible
    resizable
    :ui="sidebarUi"
  >
    Test
  </UDashboardSidebar>
</template>
