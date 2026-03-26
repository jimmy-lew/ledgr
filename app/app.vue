<script setup lang="ts">
const title = 'Ledgr'
const description = ''

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=overlays-content' },
  ],
  link: [{ rel: 'icon', href: '/favicon.png' }],
  htmlAttrs: {
    lang: 'en',
    class: ''
  },
  bodyAttrs: { },
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: '',
  ogImage: '',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '',
  twitterCard: 'summary_large_image',
})

const router = useRouter()

defineShortcuts({
  'G-H': () => router.push('/'),
})
</script>

<template>
  <UApp>
    <div class="bg-white dark:bg-[#070707]" data-vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
