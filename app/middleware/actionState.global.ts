export default defineNuxtRouteMiddleware((to, from) => {
  const { menuActive, searchActive } = useActionBar()
  searchActive.value = to.path === '/search'
})
