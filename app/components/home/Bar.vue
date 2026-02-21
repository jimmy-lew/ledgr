<script setup lang="ts">
import { LazyStatementUpload, LazyWidgetCreate } from '#components';

const overlay = useOverlay()

const statementUploadModal = overlay.create(LazyStatementUpload)
const createWidgetModal = overlay.create(LazyWidgetCreate)

const handleAddStatement = () => {
  statementUploadModal.open()
}

const handleAddWidget = () => {
  createWidgetModal.open()
}

const items = [
  { icon: 'lucide:home', to: '/' },
  { icon: 'lucide:chart-line', to: '/insights' },
  {
    icon: 'lucide:plus',
    items: [
      { icon: 'lucide:scan-line', title: 'Add statement', click: handleAddStatement },
      { icon: 'lucide:square-dashed', title: 'Add widget', click: handleAddWidget },
      { icon: 'lucide:refresh-cw', title: 'Add subscription' },
    ],
  },
  { icon: 'lucide:chart-pie', to: '/budget' },
  { icon: 'lucide:user-round', to: '/user' }
]
</script>

<template>
  <NavBar :items/>
</template>
