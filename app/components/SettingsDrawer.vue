<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(_isDark: boolean) { colorMode.preference = _isDark ? 'dark' : 'light' }
})
</script>

<template>
  <UDrawer>
    <template #content>
      <div class="flex flex-col h-screen gap-2 py-4 px-6">
        <div class="grid grid-cols-3 items-center">
          <div class="col-span-1"></div>
          <h1 class="col-span-1 font-bold text-center">Settings</h1>
          <h1 class="col-span-1 flex items-center justify-end">
            <button
              class="size-10 bg-white/5 rounded-full flex items-center justify-center duration-75 transition-all active:scale-90 text-lg font-medium"
            >
              <UIcon name="lucide:x" />
            </button>
          </h1>
        </div>
        <div class="flex flex-col gap-px mt-2">
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 px-4 py-3 first:rounded-t-3xl last:rounded-b-3xl">
            Workspace
            <span class="flex items-center gap-2">
              WIP
              <UIcon name="lucide:chevrons-up-down" />
            </span>
          </div>
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 px-4 py-3 first:rounded-t-3xl last:rounded-b-3xl">
            Notifications
            <span class="flex items-center gap-2">
              Disabled
              <UIcon name="lucide:move-up-right" />
            </span>
          </div>
          <button @click="isDark = !isDark" class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 px-4 py-3 first:rounded-t-3xl last:rounded-b-3xl">
            Appearance
            <span class="flex items-center gap-2 capitalize">
              {{ colorMode.preference }}
              <UIcon name="lucide:chevrons-up-down" />
            </span>
          </button>
        </div>
        <div class="flex flex-col gap-px mt-2">
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 px-4 py-3 first:rounded-t-3xl last:rounded-b-3xl">
            Export data
            <span class="flex items-center gap-2">
              <UIcon name="lucide:move-up-right" />
            </span>
          </div>
          <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 px-4 py-3 first:rounded-t-3xl last:rounded-b-3xl">
            License
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
