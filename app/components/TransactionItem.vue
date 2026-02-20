<script setup lang="ts">
const props = defineProps<{
  date: string
  type: string
  description: string
  withdrawal: number | null
  deposit: number | null
}>()

const [day, month, year] = props.date.split('/').map(p => parseInt(p, 10)) as [number, number, number]
const dateDisplay = computed(() => new Date(year, month - 1, day).toLocaleDateString())

const amt = computed(() => {
  return props.withdrawal === null ? `+${props.deposit}` : `-${props.withdrawal}`
})
</script>

<template>
<div class="flex items-start justify-between w-full hover:bg-black/5 dark:hover:bg-zinc-850 active:scale-95 duration-200 transition-all rounded-md px-3 py-2">
  <div class="flex items-center gap-2 grow">
    <div class="rounded-full bg-black/5 dark:bg-white/5 size-8 p-2">
      <UIcon name="lucide:arrow-right-left"/>
    </div>
    <div class="flex flex-col w-full">
      <span class="font-medium text-sm truncate max-w-7/8">{{ type }}</span>
      <span class="text-muted text-xs">{{ dateDisplay }}</span>
    </div>
  </div>
   <span class="text-sm"> {{ amt }} </span>
</div>
</template>
