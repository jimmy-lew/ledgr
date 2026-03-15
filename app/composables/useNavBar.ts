const HOVER_DELAY = 400
const DEFAULT_WIDTH = 256
const DEFAULT_HEIGHT = 56
const BORDER_RADIUS = 999

function objectMap<T extends object, K extends keyof T>(obj: T, f: (k: K, v: T[K]) => [K, T[K]]): T {
  const entries = Object.entries(obj) as [K, T[K]][]
  const mappedObject = entries.map(([k, v]) => f(k, v))
  return Object.fromEntries(mappedObject) as T
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
  const activeGroup = computed(() => subItemRefs.value[hoveredItem.value])

  const containerState = computed(() => {
    if (!activeGroup.value) return { width: width.value, height: DEFAULT_HEIGHT, borderRadius: BORDER_RADIUS }
    const rect = activeGroup.value.getBoundingClientRect()
    return { width: 200, height: rect.height + 8, borderRadius: 18 }
  })
  const subContainerState = computed(() => objectMap(containerState.value, (k,v) => [k, v-2]))

  const select = (index: number, to?: string) => { selectedItem.value = index; if (to) router.push(to)}
  const subItemSelect = (index: number, si: number, cb?: () => void) => {
    select(index)
    selectedSubItem.value =  si
    hoveredItem.value = -1
    cb?.()
  }
  const handleHover = (index: number) => { hoveredItem.value = index }
  const _handleHoverEnd = () => {
    const isHoveringSubItem = subItemRefs.value.some(el => el.matches(':hover'))
    const isHoveringItem = itemRefs.value.some(el => el.matches(':hover'))
    if (!isHoveringItem && !isHoveringSubItem) { hoveredItem.value = -1 }
  }
  const handleHoverEnd = () => { setTimeout(_handleHoverEnd, HOVER_DELAY) }
  const setItemRef = (index: number) => (el: any) => { if (el) itemRefs.value[index] = el }
  const setSubItemRef = (index: number) => (el: any) => { if (el) subItemRefs.value[index] = el.$el || el }

  return {
    setItemRef, setSubItemRef,
    selectedItem, selectedSubItem, hoveredItem,
    handleHover, handleHoverEnd, select, subItemSelect,
    activeItemRef, activeItem, activeGroup,
    containerState, subContainerState
  }
})
