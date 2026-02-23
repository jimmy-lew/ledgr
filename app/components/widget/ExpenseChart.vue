<script setup lang="ts">
const SIZE = 96
const HEIGHT = 48
const STROKE_WIDTH = 8

interface Category {
  name: string
  amount: number
  icon: string
  color: string
}

const props = defineProps<{categories: Category[]}>()

const totalAmount = props.categories.reduce((sum, item) => sum + item.amount, 0)

const { circumference, circleProps, svgProps } = useDonutChart(SIZE, STROKE_WIDTH, -180, HEIGHT)

const segments = computed(() => {
  const arcLength = circumference / 2
  const gap = (STROKE_WIDTH * props.categories.length - 1) / props.categories.length
  let offset = 0

  const categoryToSegment = (cat: Category) => {
    const rawLength = (cat.amount / totalAmount) * arcLength
    const visualLength = rawLength - gap
    offset -= gap / (props.categories.length + 1)
    const segment = {
      ...cat,
      visualLength,
      offset
    }

    offset -= rawLength
    return segment
  }

  return props.categories.map(categoryToSegment)
})
</script>

<template>
  <div class="flex flex-col items-center w-full h-full gap-1">
    <div class="relative w-full flex items-center justify-center">
      <svg v-bind="svgProps" class="overflow-visible">
        <circle
          v-for="{ name, color: stroke, visualLength, offset } in segments"
          v-bind="circleProps"
          :key="name"
          :stroke-dasharray="`${visualLength}, ${circumference}`"
          :stroke-dashoffset="offset"
          class="transition-all duration-1000 ease-out fill-none stroke"
          :style="{ stroke }"
        />
      </svg>
       <div class="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <div class="text-[12px] font-semibold tracking-tight leading-none">
          ${{ totalAmount }}
        </div>
        <div class="text-[8px] text-gray-400 font-bold">Total</div>
      </div>
    </div>

     <div class="w-full space-y-1.5 mt-1">
      <div v-for="{ name, icon, color, amount } in categories" :key="name" class="flex items-center gap-2">
        <div class="size-5 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center">
          <UIcon :name="icon" class="w-2.5 h-2.5" :style="{ color }"/>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-0.5">
            <span class="text-[8px] font-medium truncate">{{ name }}</span>
            <span class="text-[8px] font-semibold">${{ amount }}</span>
          </div>
          <div class="flex justify-between gap-0.5">
            <div
              v-for="i in 20"
              :key="i"
              class="h-2 w-0.5 flex-1 rounded-sm transition-colors duration-700 bg-black/10 dark:bg-white/5"
              :style="{backgroundColor: i <= Math.round((amount / totalAmount) * 20) ? color: ''}"
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
