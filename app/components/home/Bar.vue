<script setup lang="ts">
import { LazyStatementUpload } from '#components';

const overlay = useOverlay()

const statementUploadModal = overlay.create(LazyStatementUpload)

const handleAddStatement = () => {
  statementUploadModal.open()
}

const items = [
  { icon: 'lucide:home', to: '/' },
  { icon: 'lucide:chart-line', to: '/insights' },
  {
    icon: 'lucide:plus',
    items: [
      { icon: 'lucide:scan-line', title: 'Add statement', click: handleAddStatement },
      { icon: 'lucide:flag', title: 'Add goal' },
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
