<script setup lang="ts">
const STROKE_WIDTH = 8
const RADIUS = 40
const CX = RADIUS + STROKE_WIDTH
const CY = RADIUS + STROKE_WIDTH
const circumference = 2 * Math.PI * RADIUS

const categories = [
  { name: 'Transfers', amount: 400, color: '#6366f1', textColor: 'text-indigo-400', bgColor: 'bg-indigo-500', icon: 'i-lucide-refresh-ccw' },
  { name: 'Shopping', amount: 250, color: '#e879f9', textColor: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500', icon: 'i-lucide-shopping-cart' },
  { name: 'Food', amount: 100, color: '#34d399', textColor: 'text-emerald-400', bgColor: 'bg-emerald-400', icon: 'i-lucide-utensils' },
  { name: 'Bills', amount: 85, color: '#38bdf8', textColor: 'text-sky-400', bgColor: 'bg-sky-400', icon: 'i-lucide-receipt' },
]

const totalAmount = categories.reduce((sum, item) => sum + item.amount, 0)

const chartSegments = computed(() => {
  const arcLength = circumference / 2
  const gap = (STROKE_WIDTH * categories.length - 1) / categories.length
  let currentOffset = 0

  return categories.map((cat) => {
    const rawLength = (cat.amount / totalAmount) * arcLength
    const visualLength = rawLength - gap
    currentOffset += gap / (categories.length + 1)

    const segment = {
      ...cat,
      visualLength,
      offset: -currentOffset
    }

    currentOffset += rawLength
    return segment
  })
})
</script>

<template>
  <div class="flex flex-col items-center w-full h-full gap-1">
    <div class="relative w-full flex items-center justify-center">
      <svg width="96" height="48" viewBox="0 0 96 48" class="overflow-visible">
        <circle
          v-for="segment in chartSegments"
          :key="segment.name"
          :cx="CX" :cy="CY" :r="RADIUS"
          fill="none"
          :stroke="segment.color"
          stroke-linecap="round"
          :stroke-width="STROKE_WIDTH"
          :stroke-dasharray="`${segment.visualLength}, ${circumference}`"
          :stroke-dashoffset="segment.offset"
          :transform="`rotate(-180, ${CX}, ${CY})`"
          class="transition-all duration-1000 ease-out"
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
      <div v-for="category in categories" :key="category.name" class="flex items-center gap-2">
        <div class="size-5 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center">
          <UIcon :name="category.icon" :class="`w-2.5 h-2.5 ${category.textColor}`" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-0.5">
            <span class="text-[8px] font-medium truncate">{{ category.name }}</span>
            <span class="text-[8px] font-semibold">${{ category.amount }}</span>
          </div>
          <div class="flex justify-between gap-0.5">
            <div v-for="i in 20" :key="i" class="h-2 w-0.5 flex-1 rounded-sm transition-colors duration-700"
              :class="i <= Math.round((category.amount / totalAmount) * 20) ? category.bgColor : 'bg-black/10 dark:bg-white/5'">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
