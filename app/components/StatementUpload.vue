<script setup lang="ts">
const value = ref<File | null>(null)
const { summary, isLoading, error, parseStatement } = useBankStatement()

const emit = defineEmits<{ close: [] }>()

const submit = async () => {
  if (!value.value)
    return
  await parseStatement(value.value)
  emit('close')
}
</script>

<template>
<UDrawer>
  <template #content>
  <div class="flex flex-col h-screen gap-2 py-4 px-6">
    <div class="grid grid-cols-3 items-center">
      <div class="col-span-1"></div>
      <h1 class="col-span-1 font-bold text-center">Statement</h1>
      <div class="col-span-1 flex items-center justify-end">
        <button
          class="size-10 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center duration-75 transition-all active:scale-90 text-lg font-medium"
          @click="emit('close')"
        >
          <UIcon name="lucide:x" />
        </button>
      </div>
    </div>
      <UFileUpload
        v-model="value"
        accept="application/pdf"
        label="Drop your DBS statement here"
        description="Max 50MiB"
        :ui="{ base: 'bg-transparent' }"
      />
      <div class="flex items-center justify-end">
        <UButton @click="submit" label="Submit" />
      </div>
  </div>
  </template>
</UDrawer>
</template>
