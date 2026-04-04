<script setup lang="ts">
import { useRoute } from '#imports'

const { count } = useSelectedTransactions()

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

const slideDirection = computed(() => {
  return route.path > prevPath.value ? 'forward' : 'back'
})

const displayTitle = computed(() => {
  if (count.value > 0) {
    return `${count.value} Selected`
  }
  return props.title
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-[oklch(96%_0_0)] dark:bg-[#070707] font-mono pt-4 gap-2">
    <div class="fixed top-0 flex items-center justify-between w-full pt-10 px-5 shrink-0 z-50 ">
      <!-- <div class="absolute inset-0 backdrop-blur-3xl"></div> -->
      <GradientBlur class="rotate-180" />
      <h1 class="text-2xl font-bold z-10">{{ displayTitle }}</h1>
      <div class="flex items-center justify-center gap-4 rounded-full bg-black/5 dark:bg-[#131313] h-12 px-3 py-1 text-lg z-10">
        <UIcon v-for="icon, i in icons" :key="i" :name="icon" class="transition-all duration-75 active:scale-90"/>
      </div>
    </div>
    <div class="flex-1 min-h-0 overflow-hidden pt-22">
      <Transition name="page" mode="out-in">
        <div :key="route.path" :class="slideDirection">
          <slot />
        </div>
      </Transition>
    </div>
  </div>
  <ActionBar class="z-50" />
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
