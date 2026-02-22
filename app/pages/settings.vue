<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(_isDark: boolean) { colorMode.preference = _isDark ? 'dark' : 'light' }
})
</script>

<template>
<div class="flex flex-col gap-2 p-6">
  <h1 class="text-xl font-bold">Settings</h1>
  <div class="flex flex-col gap-px mt-2">
    <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-2xl last:rounded-b-2xl">
      Workspace
      <span class="flex items-center gap-2">
        WIP
        <UIcon name="lucide:chevrons-up-down" />
      </span>
    </div>
    <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-2xl last:rounded-b-2xl">
      Notifications
      <span class="flex items-center gap-2">
        Disabled
        <UIcon name="lucide:move-up-right" />
      </span>
    </div>
    <button @click="isDark = !isDark" class="flex items-center justify-between bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 p-3 first:rounded-t-2xl last:rounded-b-2xl">
      Appearance
      <span class="flex items-center gap-2 capitalize">
        {{ colorMode.preference }}
        <UIcon name="lucide:chevrons-up-down" />
      </span>
    </button>
  </div>
</div>
</template>
