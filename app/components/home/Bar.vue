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
  {
    icon: 'lucide:chart-pie',
    items: [
      { icon: 'lucide:chart-line', title: 'Insights', click: () => router.push('/insights') },
      { icon: 'lucide:chart-pie', title: 'Budget', click: () => router.push('/budget') },
    ]
  },
  {
    icon: 'lucide:plus',
    items: [
      { icon: 'lucide:scan-line', title: 'Add statement', click: handleAddStatement },
      { icon: 'lucide:square-dashed', title: 'Add widget', click: handleAddWidget },
      { icon: 'lucide:refresh-cw', title: 'Add subscription' },
    ],
  },
  {
    icon: 'lucide:chevrons-up-down',
    items: [
      { icon: 'lucide:home', title: 'Home', click: () => router.push('/')},
      { icon: 'lucide:settings', title: 'Settings', click: () => router.push('/settings')},
      { type: 'divider' } as const,
      { icon: 'lucide:arrow-up-down', title: 'Customize', click: () => customiseDrawer.open()},
    ]
  },
]
</script>

<template>
  <!-- <NavBar :items/> -->

  <NavLinearAndroidBar :items/>
</template>
