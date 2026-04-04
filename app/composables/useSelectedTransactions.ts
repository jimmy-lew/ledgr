import { useLocalStorage } from '@vueuse/core'

export const useSelectedTransactions = () => {
  const selectedIds = useLocalStorage<string[]>('selected-transactions', [])

  const isSelected = (id: string) => selectedIds.value.includes(id)

  const select = (id: string) => {
    if (!isSelected(id)) {
      selectedIds.value.push(id)
    }
  }

  const deselect = (id: string) => {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    }
  }

  const toggle = (id: string) => {
    if (isSelected(id)) {
      deselect(id)
    } else {
      select(id)
    }
  }

  const clear = () => {
    selectedIds.value = []
  }

  const count = computed(() => selectedIds.value.length)

  return {
    selectedIds: readonly(selectedIds),
    isSelected,
    select,
    deselect,
    toggle,
    clear,
    count
  }
}
