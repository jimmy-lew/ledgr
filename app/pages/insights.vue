<!-- <script setup lang="ts"></script>

<template><div /></template> -->
<template>
  <div class="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans antialiased overflow-hidden">

    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-[20%] -left-[10%] w-[60%] h-[150%] bg-gradient-to-b from-white/10 to-transparent blur-[120px] -rotate-[35deg] transform-gpu"></div>
      <div class="absolute -top-[10%] -left-[5%] w-[30%] h-[120%] bg-gradient-to-b from-white/5 to-transparent blur-[80px] -rotate-[30deg] transform-gpu"></div>
      <div class="absolute -top-[30%] -left-[15%] w-[40%] h-[140%] bg-gradient-to-b from-white/5 to-transparent blur-[150px] -rotate-[40deg] transform-gpu"></div>
    </div>

    <div class="relative w-full max-w-[440px] aspect-[4/5] bg-[#1a1a1a]/60 backdrop-blur-[30px] border border-white/10 rounded-[48px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-10 overflow-hidden flex flex-col">

      <div class="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
           style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 14px 14px;">
      </div>

      <div class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

      <div class="relative flex justify-center gap-2 mb-12">
        <div v-for="i in 6" :key="i"
             :class="['h-[3px] rounded-full transition-all duration-500',
                      i === 1 ? 'w-8 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'w-6 bg-white/10']">
        </div>
      </div>

      <div class="relative text-center mb-10">
        <div class="inline-flex flex-col items-center mb-6">
          <div class="relative w-20 h-20">
             <div class="absolute top-1 left-4 w-12 h-14 bg-white/20 rounded-lg rotate-[-8deg]"></div>
             <div class="absolute top-0 left-4 w-12 h-14 bg-white rounded-lg shadow-xl flex flex-col p-2 transform -rotate-3 overflow-hidden">
                <span class="text-[7px] font-bold text-gray-900 uppercase tracking-tighter mb-1">Contract</span>
                <div class="w-full h-[1px] bg-gray-200 mb-1"></div>
                <div class="w-full h-[1px] bg-gray-200 mb-1"></div>
                <div class="w-2/3 h-[1px] bg-gray-200"></div>
             </div>
             <div class="absolute bottom-0 left-0 w-20 h-14 bg-[#2a2a2a] rounded-xl border border-white/10 shadow-2xl flex items-end justify-center pb-2">
                <div class="w-6 h-1 bg-white/5 rounded-full"></div>
             </div>
          </div>
        </div>

        <h1 class="text-white text-[28px] font-bold tracking-tight mb-3">Choose offer type</h1>
        <p class="text-gray-400 text-sm leading-relaxed px-4">
          What type of collaboration do you have in mind?
        </p>
      </div>

      <div class="relative space-y-4 flex-grow">
        <button v-for="option in options" :key="option.title"
                class="group w-full flex items-center justify-between p-4 rounded-[24px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0d2a1a] border border-green-500/20">
              <UIcon :name="option.icon" class="w-6 h-6 text-green-500" />
            </div>
            <div class="text-left">
              <h3 class="text-white text-[15px] font-semibold">{{ option.title }}</h3>
              <p class="text-gray-500 text-[12px]">{{ option.description }}</p>
            </div>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 transition-all duration-300 group-hover:scale-110">
            <UIcon name="lucide:arrow-right" class="w-4 h-4 text-white group-hover:text-black transition-colors" />
          </div>
        </button>
      </div>

      <div class="relative flex items-center justify-between mt-8">
        <button class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-400 text-sm font-bold hover:text-white hover:bg-white/10 transition-all">
          <UIcon name="lucide:undo-2" class="w-4 h-4" />
          Back
        </button>
        <button class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-400 text-sm font-bold hover:text-white hover:bg-white/10 transition-all">
          Skip
          <UIcon name="lucide:fast-forward" class="w-4 h-4" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const options = [
  {
    title: 'Collaboration',
    description: 'Treated as partnership',
    icon: 'lucide:pencil'
  },
  {
    title: 'Paid Plan',
    description: 'Budget based, average $600',
    icon: 'lucide:briefcase'
  },
  {
    title: 'Unpaid Plan',
    description: 'Based on mutual benefits',
    icon: 'lucide:gift'
  }
]
</script>

<style scoped>
/* High-end glass texture effect */
.backdrop-blur-\[30px\] {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
}
</style>
