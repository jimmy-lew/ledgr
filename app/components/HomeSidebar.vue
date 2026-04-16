<script setup lang="ts">

const route = useRoute()

const sidebarKey = computed(() => route.path.startsWith('/settings') ? 'settings' : 'default')

const { data: sidebarData } = await useAsyncData(
  `sidebar-${sidebarKey.value}`,
  () => queryCollection('sidebar').where('stem', '=', `sidebar/${sidebarKey.value}`).first(),
  { watch: [sidebarKey] })

const items = computed(() => sidebarData.value?.items ?? [])

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
      <ul class="flex flex-col">
          <UButton v-for="item in items" v-bind="item" variant="ghost" color="neutral" :ui="{ leadingIcon: 'size-4' }"/>
      </ul>
  </UDashboardSidebar>
</template>
