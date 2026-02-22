<script setup lang="ts">
import type { Widget } from '~/types'
const props = defineProps<{ item: Widget, index: number }>()
const model = defineModel<number>({ default: 0 })

const { meta } = await useWidget()

const component = computed(() => meta[props.item.type].component)
const isSelected = computed(() => model.value === props.index )

const handleSelect = () => {
  model.value = props.index
}
</script>

<template>
	<Motion
    as="div"
    :initial="{ opacity: 0, y: 16 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }"
    class="
      flex flex-col shrink-0 rounded-xl p-3 text-sm
      bg-default dark:bg-zinc-850 backdrop-blur-sm
      w-40 h-48 sm:w-60 sm:h-72
      cursor-pointer
      transition-shadow duration-300
    "
    :class="{ 'shadow-md': isSelected }"
    @click="handleSelect"
  >
    <component
      :is="component"
      v-bind="item"
    />
  </Motion>
</template>
