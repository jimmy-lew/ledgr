const HOVER_DELAY = 400
const DEFAULT_WIDTH = 192
const DEFAULT_HEIGHT = 48
const BORDER_RADIUS = 999

interface ContainerState {
  width: number
  height: number
  borderRadius: number
}

export const useNavBar = createSharedComposable(() => {
  const router = useRouter()
  const itemRefs = ref<HTMLElement[]>([])
  const subItemRefs = ref<HTMLElement[]>([])
  const activeItemRef = computed(() => itemRefs.value[activeItem.value])

  const width = ref(DEFAULT_WIDTH)

  const selectedItem = ref<number>(0)
  const selectedSubItem = ref<number>(-1)
  const hoveredItem = ref<number>(-1)
  const activeItem = computed(() => hoveredItem.value >= 0 ? hoveredItem.value : selectedItem.value )

  const containerState = ref<ContainerState>({ width: width.value, height: DEFAULT_HEIGHT, borderRadius: BORDER_RADIUS })
  // Kinda ugly, will refactor later
  const subContainerState = computed(() => Object.fromEntries(Object.entries(containerState.value).map(([k, v]) => [k, v - 2])))
  const baseContainerState = toRaw(containerState.value)
  const baseSubcontainerState = toRaw(subContainerState.value)

  const select = (index: number, to?: string) => { selectedItem.value = index; if (to) router.push(to)}
  const subItemSelect = (index: number, si: number, cb?: () => void) => {
    select(index)
    selectedSubItem.value =  si
    hoveredItem.value = -1
    containerState.value = baseContainerState
    cb?.()
  }
  const handleHover = (index: number) => {
    hoveredItem.value = index
    const el = subItemRefs.value[index]
    if (!el) {
      containerState.value = baseContainerState
      return
    }
    const rect = el.getBoundingClientRect()
    containerState.value = {
      width: Math.max(rect.width, width.value + 64),
      height: rect.height + 48,
      borderRadius: 18
    }
  }
  const _handleHoverEnd = () => {
    const isHoveringSubItem = subItemRefs.value.some(el => el.matches(':hover'))
    const isHoveringItem = itemRefs.value.some(el => el.matches(':hover'))
    if (!isHoveringItem && !isHoveringSubItem) {
      hoveredItem.value = -1
      containerState.value = baseContainerState
    }
  }
  const handleHoverEnd = () => { setTimeout(_handleHoverEnd, HOVER_DELAY) }
  const setItemRef = (index: number) => (el: any) => { if (el) itemRefs.value[index] = el }
  const setSubItemRef = (index: number) => (el: any) => { if (el) subItemRefs.value[index] = el.$el || el }

  // watch([selectedItem, hoveredItem, activeItem], ([s, h, a]) => console.log(s,h,a))

  return {
    setItemRef, setSubItemRef,
    selectedItem, selectedSubItem, hoveredItem, activeItem,
    handleHover, handleHoverEnd, select, subItemSelect,
    itemRefs, subItemRefs, activeItemRef,
    containerState, subContainerState
  }
})
