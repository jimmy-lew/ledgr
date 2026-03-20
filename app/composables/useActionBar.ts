const DEFAULT_WIDTH = 228 // 224px content spacing + 4px padding
const DEFAULT_HEIGHT = 56 // 48px content height + 4px padding
const BORDER_RADIUS = 999

function objectMap<T extends object, K extends keyof T>(obj: T, f: (k: K, v: T[K]) => [K, T[K]]): T {
  const entries = Object.entries(obj) as [K, T[K]][]
  const mappedObject = entries.map(([k, v]) => f(k, v))
  return Object.fromEntries(mappedObject) as T
}

export const useActionBar = createSharedComposable(() => {
  const menuActive = ref(false)
  const searchActive = ref(false)
  const menuRef = ref<HTMLElement>()

  const width = ref(DEFAULT_WIDTH)

  const menuState = computed(() => {
    if (searchActive.value) return { width: 0, borderWidth: 0 }
    if (!menuActive.value || !menuRef.value) return { width: width.value, height: DEFAULT_HEIGHT, borderRadius: BORDER_RADIUS, borderWidth: 1 }
    const rect = menuRef.value.getBoundingClientRect()
    return { width: width.value, height: rect.height + 8, borderRadius: 24, borderWidth: 1 }
  })

  const searchMenuState = computed(() => {
    if (!searchActive.value) return { width: 56, height: 56 }
    return { width: 240, height: 48 }
  })

  const setMenuRef = (el: any) => { if (el) menuRef.value = el.$el || el }
  const toggleMenu = () => { menuActive.value = !menuActive.value }

  return {
    menuActive, menuState, toggleMenu, setMenuRef,
    searchActive, searchMenuState,
  }
})
