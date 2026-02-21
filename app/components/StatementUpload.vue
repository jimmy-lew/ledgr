<script setup lang="ts">
const value = ref<File | null>(null)
const { summary, isLoading, error, parseStatement } = useBankStatement()

const emit = defineEmits<{
  close: [],
}>()

const submit = async () => {
  if (!value.value)
    return
  await parseStatement(value.value)
  emit('close')
}
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
      <div class="p-4">
        <UFormField label="Statement">
          <UFileUpload
            v-model="value"
            accept="application/pdf"
            label="Drop your DBS statement here"
            description="Max 50MiB"
          />
        </UFormField>
      </div>
      <div class="p-4 pt-0 flex gap-2 justify-end">
        <UButton @click="submit">
          Submit
        </UButton>
      </div>
    </div>
  </template>
</UModal>
</template>
