// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxt/hints', '@nuxt/fonts', '@nuxt/ui'],
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
