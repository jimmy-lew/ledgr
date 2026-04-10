<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string,
  icons?: string[]
}>(), {
  title: 'Home',
  icons: () => ['lucide:edit', 'lucide:ellipsis']
})

const route = useRoute()
const prevPath = ref('')

watch(() => route.path, (newPath, oldPath) => {
  if (oldPath) {
    prevPath.value = oldPath
  }
})

const slideDirection = computed(() => route.path > prevPath.value ? 'forward' : 'back')
</script>

<template>
  <MobileHeader :title :icons />
  <div class="relative flex flex-col grow shrink min-w-0">
    <main class="relative flex flex-col grow shrink gap-2 sm:my-2 sm:mr-2 sm:rounded-xl sm:content-box pt-4 sm:p-0 bg-default sm:dark:bg-neutral">
      <div class="flex-1 min-h-0 overflow-hidden pt-22 sm:pt-0">
        <Transition name="page" mode="out-in">
          <div :key="route.path" :class="slideDirection" class="relative sm:absolute inset-0 overflow-hidden">
            <slot />
          </div>
        </Transition>
      </div>
    </main>
    <div class="w-full h-7 shrink"></div>
  </div>
</template>

<style>

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
}
.page-leave-to {
  opacity: 0;
}
.forward.page-enter-from {
  transform: translateX(30px);
}
.forward.page-leave-to {
  transform: translateX(-30px);
}
.back.page-enter-from {
  transform: translateX(-30px);
}
.back.page-leave-to {
  transform: translateX(30px);
}
</style>
