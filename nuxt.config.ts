// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxt/hints', '@nuxt/fonts', '@nuxt/ui', 'motion-v/nuxt'],
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  imports: { dirs: ['types/**'] },
  colorMode: { preference: 'system' },
  icon: { mode: 'svg' },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
