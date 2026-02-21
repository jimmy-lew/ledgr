 <script setup lang="ts">
import { WidgetBudget, WidgetGoal } from '#components';

const emit = defineEmits<{
  close: [],
  created: [widget: Widget]
}>()

const config: Record<WidgetType, WidgetConfig> = {
  goal: {
    label: 'Goal',
    icon: 'i-lucide-target',
    description: 'Track your savings progress',
    fields: [
      { key: 'name', label: 'Goal Name', type: 'input', props: { placeholder: 'New Car' }, fieldClass: 'col-span-2' },
      { key: 'current', label: 'Saved', type: 'number', props: { min: 0, placeholder: '0' } },
      { key: 'final', label: 'Target', type: 'number', props: { min: 1, placeholder: '1000' } },
      { key: 'due', label: 'Due Date', type: 'date', fieldClass: 'col-span-2'},
    ],
    component: WidgetGoal,
  },
  budget: {
    label: 'Budget',
    icon: 'i-lucide-pie-chart',
    description: 'Monthly limit tracking',
    component: WidgetBudget
  },
  expenses: {
    label: 'Expenses',
    icon: 'i-lucide-credit-card',
    description: 'Automatic expense tracking',
  },
  test: {
    label: 'Test',
    icon: 'i-lucide-flask-conical',
    description: 'Monthly limit tracking',
  },
}

const state = ref({})
const active = ref(config.goal)
const fields = computed<FormField[]>(() => active.value.fields ?? [])

const handleSelect = (widget: WidgetConfig) => {
  active.value = widget.component ? widget : { label: widget.label, icon: 'lucide:triangle-alert', description: 'Widget not yet implemented...' }
}

function submit() {
  if (!active.value) return
}

watch(active, (n, o) => { if (n !== o) { state.value = {} } })
</script>

<template>
  <UModal
    closeIcon=" "
    :ui="{
      content: 'ring-0 bg-transparent bg-linear-to-b from-black/12 via-white/30 to-black/5 dark:from-white/20 dark:via-black/30 dark:to-white/5 backdrop-blur-[2px] p-px',
      overlay: 'backdrop-blur-[2px]',
    }"
  >
    <template #content>
      <div class="bg-white/60 dark:bg-black/70 inset-px rounded-[7px] overflow-hidden font-mono">
        <div class="px-4 pt-4 pb-2 border-b border-black/5 dark:border-white/20 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <Motion
              :initial="{ opacity: 0, y: 4 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.22 }"
            >
              <p class="text-xs font-medium tracking-widest text-muted uppercase">
                New Widget
              </p>
              <h2 class="text-base font-semibold leading-snug">
                Configure
              </h2>
            </Motion>
          </div>

          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors ml-auto"
            @click="emit('close')"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <Motion
          :initial="{ opacity: 0, x: 16 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.24 }"
        >
          <div class="px-4 pt-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <div class="flex gap-2 p-1 max-w-full overflow-x-auto">
              <button
                v-for="widget in config"
                :key="widget.label"
                @click="handleSelect(widget)"
                :class="[
                  'min-w-20 flex flex-col items-center py-2 px-1 ring-1 ring-black/5 dark:ring-white/5 rounded-lg transition-all gap-1.5 dark:hover:bg-white/15',
                  active.label === widget.label ? 'shadow-sm bg-black/5 dark:bg-black/40' : ''
                ]"
              >
                <UIcon :name="widget.icon" :class="['w-5 h-5', active.label === widget.label ? 'text-primary' : '']" />
                <span class="text-[10px] font-bold uppercase tracking-widest">{{ widget.label }}</span>
              </button>
            </div>

            <Motion
              :initial="{ opacity: 0, scale: 0.98 }"
              :animate="{ opacity: 1, scale: 1 }"
            >
              <FormBuilder v-if="fields.length > 0" v-model="state" :fields class="grid grid-cols-2 gap-x-4 gap-y-2"/>

              <div v-else class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <UIcon :name="active.icon" class="w-10 h-10 text-zinc-300 mb-2" />
                <p class="text-sm font-medium text-zinc-600">{{ active.description }}</p>
                <p class="text-xs text-zinc-400 mt-1">No additional configuration required.</p>
              </div>
            </Motion>
            <div v-if="active.component" class="flex flex-col items-center rounded-xl p-4 space-y-2 bg-black/5 dark:bg-black">
              <p class="flex items-center text-xs font-medium gap-1">
                <span class="relative flex size-1.5 justify-center items-center">
                  <span class="absolute -translate-x-1/2 left-1/2 size-1.5 rounded-full animate-ping bg-green-400 opacity-75"></span>
                  <span class="relative size-1 rounded-full bg-green-500"></span>
                </span>
                Live Preview</p>
              <div class="flex flex-col shrink-0 rounded-xl p-3 text-sm bg-default dark:bg-zinc-850 w-40 h-48">
                <component :is="active.component" v-bind="state"/>
              </div>
            </div>
          </div>

          <div class="p-4 flex gap-2 justify-end">
            <UButton variant="ghost" color="neutral" @click="emit('close')">Cancel</UButton>
            <UButton @click="submit">
              Add widget
            </UButton>
          </div>
        </Motion>

      </div>
    </template>
  </UModal>
</template>
