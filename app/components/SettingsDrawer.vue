<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(_isDark: boolean) { colorMode.preference = _isDark ? 'dark' : 'light' }
})
</script>

<template>
  <UDrawer :overlay="false">
    <template #content>
      <div class="flex flex-col h-screen gap-2 p-6">
        <h1 class="font-bold text-center">Settings</h1>
        <div class="flex flex-col gap-px mt-2">
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-3xl last:rounded-b-3xl">
            Workspace
            <span class="flex items-center gap-2">
              WIP
              <UIcon name="lucide:chevrons-up-down" />
            </span>
          </div>
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-3xl last:rounded-b-3xl">
            Notifications
            <span class="flex items-center gap-2">
              Disabled
              <UIcon name="lucide:move-up-right" />
            </span>
          </div>
          <button @click="isDark = !isDark" class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-3xl last:rounded-b-3xl">
            Appearance
            <span class="flex items-center gap-2 capitalize">
              {{ colorMode.preference }}
              <UIcon name="lucide:chevrons-up-down" />
            </span>
          </button>
        </div>
        <div class="flex flex-col gap-px mt-2">
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-3xl last:rounded-b-3xl">
            Export data
            <span class="flex items-center gap-2">
              <UIcon name="lucide:move-up-right" />
            </span>
          </div>
        </div>
        <span class="w-full text-center text-xs text-muted mt-auto">
          Ledgr for Android 1.0.0 (220226-external)
        </span>
      </div>
    </template>
  </UDrawer>
</template>
