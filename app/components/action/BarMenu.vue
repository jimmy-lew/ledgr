<script setup lang="ts">
import { CustomiseDrawer, SettingsDrawer, StatementUpload, WidgetCreate } from '#components';

const { menuActive, setMenuRef } = useActionBar()
const router = useRouter()
const overlay = useOverlay()

const statementUploadModal = overlay.create(StatementUpload)
const createWidgetModal = overlay.create(WidgetCreate)
const customiseDrawer = overlay.create(CustomiseDrawer)
const settingsDrawer = overlay.create(SettingsDrawer)

const handleAddStatement = () => {
  statementUploadModal.open()
}

const handleAddWidget = () => {
  createWidgetModal.open()
}

const items = [
  { icon: 'lucide:home', title: 'Home', click: () => router.push('/')},
  { icon: 'lucide:chart-line', title: 'Insights', click: () => router.push('/insights') },
  { icon: 'lucide:chart-pie', title: 'Budget', click: () => router.push('/budget') },
  { icon: 'lucide:scan-line', title: 'Statements', click: handleAddStatement },
  { icon: 'lucide:square-dashed', title: 'Widgets', click: handleAddWidget },
  { icon: 'lucide:refresh-cw', title: 'Subscriptions' },
]

const initial = { opacity: 0 }
const animate = computed(() => ({ opacity: menuActive.value ? 1 : 0 }))
</script>

<template>
  <Motion
    as="div"
    :initial :animate
    :transition="{ duration: 0.3 }"
    class="absolute -top-10 flex items-center justify-between w-full px-3"
  >
    <div />
    <button
      class="flex items-center justify-center size-8 bg-white dark:bg-[#171717] border border-action-border rounded-full font-medium text-lg transition-all duration-75 active:scale-90"
      @click="settingsDrawer.open"
    >
      <UIcon name="lucide:settings" />
    </button>
  </Motion>
  <Motion
    :ref="setMenuRef"
    :initial :animate
    :transition="{ duration: 0.3 }"
    class="pt-3 px-3 flex flex-col items-center absolute overflow-y-scroll w-full text-black dark:text-white font-medium"
  >
    <button
      v-for="({icon: name, title, click}, i) in items"
      :key="i"
      class="w-full group font-medium transition-all duration-75 active:scale-90"
      @click="() => { }"
    >
      <div
        class="
        flex items-center gap-3.5
        rounded-full px-2 py-2.5 mx-auto w-full
        duration-300
        group-active:bg-black/5 group-hover:bg-black/5
        dark:group-active:bg-white/5 dark:group-hover:bg-white/5
        group-active:px-3 group-hover:px-3
        "
      >
          <Icon v-if="name" :name class="size-5"/>
        {{ title }}
      </div>
    </button>

    <USeparator class="px-2 py-0.5" :ui="{ border: 'bg-black/5 dark:bg-white/10' }"/>
    <button
      class="w-full group font-medium transition-all duration-75 active:scale-90 first:bg-white/5 first:rounded-full"
      @click="customiseDrawer.open"
    >
      <div
        class="
        flex items-center gap-4
        rounded-full mx-auto w-full
        px-2.5 py-1.5
        duration-300 group-active:px-3 group-hover:px-3
        "
      >
         Customize
      </div>
    </button>
  </Motion>
</template>
