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

const items = [
  { icon: 'lucide:home', to: '/' },
  { icon: 'lucide:chart-pie', to: '/budget' },
  { icon: 'lucide:scan-line', to: '' },
]
</script>

<template>
  <!-- <NavBar :items/> -->

  <ActionBar :items class="rounded-3xl"/>
</template>
