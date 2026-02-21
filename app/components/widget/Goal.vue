<script setup lang="ts">
import type { GoalWidget } from '~/types'
const props = defineProps<Omit<GoalWidget, 'type'| 'id'>>()

const STROKE_WIDTH = 8
const RADIUS = 40
const CX = RADIUS + STROKE_WIDTH
const CY = RADIUS + STROKE_WIDTH
const circumference = 2 * Math.PI * RADIUS // ≈ 251.33

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
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle
          :cx="CX" :cy="CY" :r="RADIUS"
          stroke-linecap="round"
          :stroke-width="STROKE_WIDTH"
          class="stroke-black/10 dark:stroke-zinc-800 fill-none"
        />
        <Motion
          as="circle"
          :cx="CX" :cy="CY" :r="RADIUS"
          :transform="`rotate(-90, ${CX}, ${CY})`"
          stroke-linecap="round"
          :stroke-width="STROKE_WIDTH"
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
