<script setup lang="ts">
import { UCheckbox, UInput, DateInput, UInputNumber } from '#components';
import type { FormField } from '~/types'

const props = defineProps<{fields: FormField[]}>()
const emit = defineEmits<{
  submit: []
}>()
const state = defineModel<any>()

function getFieldComponent(field: FormField) {
  switch (field.type) {
    case 'date':
      return DateInput
    case 'boolean':
      return UCheckbox
    case 'number':
      return UInputNumber
    default:
      return UInput
  }
}

function santizeField(field: FormField) {
  const { label, ui, props, class: _class } = field
  return { label, ui: { base: 'bg-transparent', ...ui }, ...props, class: _class }
}
</script>

<template>
<UForm :state>
  <template v-for="field in fields" :key="field.key">
    <UFormField :name="field.key" :label="field.label">
      <component
        :is="getFieldComponent(field)"
        v-model="state[field.key]"
        v-bind="santizeField(field)"
      />
    </UFormField>
  </template>
</UForm>
</template>
