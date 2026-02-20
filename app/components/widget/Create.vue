<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

type WidgetType = 'goal' | 'expenses' | 'budget'

const emit = defineEmits<{
  close: [],
  created: [widget: GoalWidget | ExpensesWidget | BudgetWidget]
}>()

const isOpen = defineModel<boolean>({ default: false })

const selectedType = ref<WidgetType | null>('goal')

// Goal form
const goalName = ref('')
const goalCurrent = ref(0)
const goalFinal = ref(1000)
const goalDue = ref('')
const modelValue = shallowRef(new CalendarDate(2026, 1, 10))

function selectType(type: WidgetType) {
  selectedType.value = type
}

function back() {
  selectedType.value = null
}

function reset() {
  selectedType.value = null
  goalName.value = ''
  goalCurrent.value = 0
  goalFinal.value = 1000
  goalDue.value = ''
}

function submit() {
  if (!selectedType.value) return

  let widget: Widget

  const id = crypto.randomUUID()

  if (selectedType.value === 'goal') {
    widget = {
      id,
      type: 'goal',
      name: goalName.value,
      current: goalCurrent.value,
      final: goalFinal.value,
      due: goalDue.value,
    }
  } else if (selectedType.value === 'expenses') {
    widget = { id, type: 'expenses', categories: [] }
  } else {
    widget = { id, type: 'budget' }
  }

  emit('created', widget)
  isOpen.value = false
  reset()
}

watch(isOpen, (v) => { if (!v) reset() })
</script>

<template>
  <UModal
    v-model:open="isOpen"
    closeIcon=" "
    :ui="{
      content: 'ring-0 bg-transparent bg-linear-to-b from-black/12 via-white/30 to-black/5 backdrop-blur-[2px] p-px',
      overlay: 'bg-black/20 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="bg-white/60 inset-px rounded-[7px] overflow-hidden font-mono">
        <div class="px-6 pt-6 pb-4 border-b border-black/5 flex items-center gap-3">
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
          <div class="p-6 space-y-4">
            <template v-if="selectedType === 'goal'">
              <UFormField label="Goal name" required>
                <UInput
                  v-model="goalName"
                  placeholder="e.g. Emergency fund"
                  :ui="{base: 'bg-transparent'}"
                  class="w-full"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-3">
                <UFormField label="Current amount">
                  <UInputNumber
                    v-model="goalCurrent"
                    :min="0"
                    placeholder="0"
                    :ui="{base: 'bg-transparent'}"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Target amount" required>
                  <UInputNumber
                    v-model="goalFinal"
                    :min="1"
                    placeholder="1000"
                    :ui="{base: 'bg-transparent'}"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Due date">
                <UPopover>
                  <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" class="bg-transparent">
                    {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Select a date' }}
                  </UButton>

                  <template #content>
                    <UCalendar v-model="modelValue" class="p-2" />
                  </template>
                </UPopover>
              </UFormField>

              <!-- Live preview -->
              <div class="flex flex-col items-center rounded-xl p-4 space-y-2 bg-black/5">
                <p class="flex items-center text-xs font-medium gap-1">
                  <span class="relative flex size-1.5 justify-center items-center">
                    <span class="absolute -translate-x-1/2 left-1/2 size-1.5 rounded-full animate-ping bg-green-400 opacity-75"></span>
                    <span class="relative size-1 rounded-full bg-green-500"></span>
                  </span>
                  Live Preview</p>
                <div class="flex flex-col shrink-0 rounded-xl p-3 text-sm bg-default dark:bg-zinc-850 w-40 h-48">
                  <WidgetGoal name="Emergency fund" :current="0" :final="1000" due="10/1/2026" />
                </div>
              </div>
            </template>
          </div>

          <div class="px-6 pb-6 flex gap-2 justify-end">
            <UButton variant="ghost" color="neutral" @click="emit('close')">Cancel</UButton>
            <UButton
              :disabled="selectedType === 'goal' && !goalName"
              @click="submit"
            >
              Add widget
            </UButton>
          </div>
        </Motion>

      </div>
    </template>
  </UModal>
</template>
