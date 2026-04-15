// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/hints',
    '@nuxt/fonts',
    '@nuxt/ui',
    'motion-v/nuxt',
    '@vite-pwa/nuxt'
  ],
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  imports: { dirs: ['types/**'] },
  colorMode: { preference: 'system' },
  icon: { mode: 'svg' },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'ledgr',
      short_name: 'ledgr',
      description: 'ledgr pwa app',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
