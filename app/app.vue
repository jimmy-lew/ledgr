<script setup lang="ts">
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [{ rel: 'icon', href: '/favicon.png' }],
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: { },
})

const title = 'Ledgr'
const description = ''

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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
