const HOVER_DELAY = 400
const DEFAULT_WIDTH = 228
const DEFAULT_HEIGHT = 56
const BORDER_RADIUS = 999

function objectMap<T extends object, K extends keyof T>(obj: T, f: (k: K, v: T[K]) => [K, T[K]]): T {
  const entries = Object.entries(obj) as [K, T[K]][]
  const mappedObject = entries.map(([k, v]) => f(k, v))
  return Object.fromEntries(mappedObject) as T
}

export const useActionBar = createSharedComposable(() => {
  const menuActive = ref(false)
  const menuRef = ref<HTMLElement>()

  const width = ref(DEFAULT_WIDTH)

  const menuState = computed(() => {
    if (!menuActive.value || !menuRef.value) return { width: width.value, height: DEFAULT_HEIGHT, borderRadius: BORDER_RADIUS, zIndex: 0 }
    const rect = menuRef.value.getBoundingClientRect()
    return { width: width.value, height: rect.height + 8, borderRadius: 24, zIndex: 30 }
  })

  const setMenuRef = (el: any) => { if (el) menuRef.value = el.$el || el }
  const toggleMenu = () => { menuActive.value = !menuActive.value }

  return {
    menuActive, menuState, toggleMenu, setMenuRef,
  }
})
