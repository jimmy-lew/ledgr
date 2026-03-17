<script setup lang="ts">
import { CustomiseDrawer, StatementUpload, WidgetCreate } from '#components';

const overlay = useOverlay()
const router = useRouter()

const statementUploadModal = overlay.create(StatementUpload)
const createWidgetModal = overlay.create(WidgetCreate)
const customiseDrawer = overlay.create(CustomiseDrawer)

const handleAddStatement = () => {
  statementUploadModal.open()
}

const handleAddWidget = () => {
  createWidgetModal.open()
}

const items = [
  { icon: 'lucide:home', to: '/' },
  { icon: 'lucide:chart-pie', },
  { icon: 'lucide:scan-line', },
  {
    icon: 'lucide:chevrons-up-down',
    items: [
      { icon: 'lucide:home', title: 'Home', click: () => router.push('/')},
      // { icon: 'lucide:settings', title: 'Settings', click: () => router.push('/settings')},
      { icon: 'lucide:chart-line', title: 'Insights', click: () => router.push('/insights') },
      { icon: 'lucide:chart-pie', title: 'Budget', click: () => router.push('/budget') },
      { icon: 'lucide:scan-line', title: 'Statements', click: handleAddStatement },
      { icon: 'lucide:square-dashed', title: 'Widgets', click: handleAddWidget },
      { icon: 'lucide:refresh-cw', title: 'Subscriptions' },
      { type: 'divider' } as const,
      { icon: 'lucide:arrow-up-down', title: 'Customize', click: () => customiseDrawer.open()},
    ]
  },
]
</script>

<template>
  <!-- <NavBar :items/> -->

  <ActionBar :items class="rounded-3xl"/>
</template>
