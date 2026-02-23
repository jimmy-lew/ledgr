<script setup lang="ts">
import type { GoalWidget } from '~/types'
const props = defineProps<Omit<GoalWidget, 'type'| 'id'>>()

const { circumference, circleProps, svgProps } = useDonutChart(96, 8, -90)

const percentage = computed(() => props.current / props.final)
const displayPercentage = computed(() => (percentage.value * 100).toFixed(1))

const targetDashArray = computed(() => {
  const filled = percentage.value * circumference
  return `${filled} ${circumference}`
})
</script>

<template>
  <div class="flex flex-col items-center gap-2 text-xs h-full">
    <div class="flex justify-between w-full">
      Goal
    </div>
    <div class="relative h-full w-full flex items-center justify-center">
      <span class="absolute -translate-x-1/2 left-1/2 font-bold text-lg">{{displayPercentage}}</span>
      <svg v-bind="svgProps">
        <circle v-bind="circleProps" class="stroke-black/10 dark:stroke-zinc-800 fill-none" />
        <Motion
          as="circle"
          v-bind="circleProps"
          :initial="{ strokeDasharray: `0 ${circumference}` }"
          :animate="{ strokeDasharray: targetDashArray }"
          :transition="{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }"
          class="stroke-green-400 fill-none"
        />
      </svg>
    </div>
    <div class="flex flex-col items-center gap-1">
      {{ name }}
      <span class="text-muted">{{ due }}</span>
    </div>
  </div>
</template>
