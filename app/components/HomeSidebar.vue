<script setup lang="ts">

const route = useRoute()
const isSettingsPage = computed(() => route.path.startsWith('/settings'))

const sidebarKey = computed(() => isSettingsPage.value ? 'settings' : 'default')

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
  ],
  body: 'gap-2'
}))
</script>

<template>
  <UDashboardSidebar
    v-model:collapsed="isCollapsed"
    collapsible
    resizable
    :minSize="220"
    :ui="sidebarUi"
  >
    <div v-if="isSettingsPage" class="flex items-center h-11">
      <UButton
        icon="lucide:chevron-left"
        label="Back to app"
        to="/"
        variant="ghost"
        color="neutral"
        :ui="{ base: 'rounded-full', leadingIcon: 'size-4' }"
      />
    </div>
    <ul class="flex flex-col">
      <UButton v-for="item in items" v-bind="item" variant="ghost" color="neutral" :ui="{ base: 'rounded-lg', leadingIcon: 'size-4' }"/>
    </ul>
  </UDashboardSidebar>
</template>
