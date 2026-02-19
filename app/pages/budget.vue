<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
    <div class="bg-black w-fit rounded-4xl p-6 shadow-2xl text-white">

      <h1 class="text-center text-[22px] font-black tracking-wide mt-2 mb-8">
        Expense Tracker
      </h1>

      <div class="relative w-full flex items-center justify-center mb-10">
         <svg width="240" height="120" viewBox="0 0 240 120" class="overflow-visible">
          <g transform="">
            <circle
              v-for="segment in chartSegments"
              :key="segment.name"
              cx="120" cy="120" :r="radius"
              fill="none"
              :stroke="segment.color"
              stroke-linecap="round"
              stroke-width="16"
              :stroke-dasharray="`${segment.visualLength}, ${circumference}`"
              :stroke-dashoffset="segment.offset"
              class="transition-all duration-1000 ease-out rotate-180 origin-[50%_100%]"
            />
          </g>

          <!-- stroke-linecap="round" -->
        </svg>

        <div class="absolute h-screen w-px bg-red-400 left-1/2 -translate-x-1/2"></div>

        <div class="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
          <div class="text-[32px] font-semibold tracking-tight leading-none mb-1">
            ${{ totalAmount }}
          </div>
          <div class="text-[13px] text-gray-400 font-bold">Total Expense</div>
        </div>
      </div>

      <!-- <div class="flex justify-between items-center text-[13px] font-medium text-gray-500 mb-8 px-1">
        <span v-for="month in months" :key="month"
          :class="[month === activeMonth ? 'bg-[#7048e8] text-white' : 'hover:text-gray-300', 'px-3 py-1.5 rounded-full cursor-pointer transition-all']">
          {{ month }}
        </span>
      </div> -->

      <div class="space-y-6">
        <div v-for="category in categories" :key="category.name" class="flex items-center gap-4">
          <div class="size-10.5 rounded-full bg-[#1e2028] flex items-center justify-center border border-gray-800/50">
            <UIcon :name="category.icon" :class="`w-5 h-5 ${category.textColor}`" />
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <span class="font-medium">{{ category.name }}</span>
              <span class="font-semibold">${{ category.amount }}</span>
            </div>
            <div class="flex justify-between gap-1">
              <div v-for="i in 36" :key="i" class="h-4 w-0.75 flex-1 rounded-sm transition-colors duration-700"
                :class="i <= Math.round((category.amount / totalAmount) * 36) ? category.bgColor : 'bg-[#262833]'">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeMonth = ref('Dec')
const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const radius = 120
const circumference = computed(() => Math.PI * 2 * radius)

const categories = ref([
  { name: 'Transfers', amount: 400, color: '#6366f1', textColor: 'text-indigo-400', bgColor: 'bg-indigo-500', icon: 'i-lucide-refresh-ccw' },
  { name: 'Shopping', amount: 250, color: '#e879f9', textColor: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500', icon: 'i-lucide-shopping-cart' },
  { name: 'Food & Beverages', amount: 100, color: '#34d399', textColor: 'text-emerald-400', bgColor: 'bg-emerald-400', icon: 'i-lucide-utensils' },
  { name: 'Utility/Bills', amount: 85, color: '#38bdf8', textColor: 'text-sky-400', bgColor: 'bg-sky-400', icon: 'i-lucide-receipt' },
])

const totalAmount = computed(() => categories.value.reduce((sum, item) => sum + item.amount, 0))

const chartSegments = computed(() => {
  const arcLength = circumference.value / 2
  const gap = (16 * categories.value.length - 1) / categories.value.length
  let currentOffset = 0

  return categories.value.map((cat, index) => {
    // Calculate the raw length based on proportion of the total arc
    const rawLength = (cat.amount / totalAmount.value) * arcLength
    const visualLength = rawLength - gap
    currentOffset += gap / (categories.value.length + 1)

    const segment = {
      ...cat,
      visualLength,
      // The offset is negative because SVG rotation/stroke logic moves clockwise
      offset: -currentOffset
    }

    currentOffset += rawLength
    return segment
  })
})
</script>
