<script setup lang="ts">
const title = 'Ledgr'
const description = ''

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content' },
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

const toaster = {
  expand: false,
  position: 'bottom-center' as const,
  class: 'bottom-24 w-74',
}
</script>

<template>
  <UApp :toaster>
    <div class="flex flex-1 w-full h-full min-h-screen bg-neutral-50 sm:bg-white sm:dark:bg-[#070707]" data-vaul-drawer-wrapper>
        <HomeSidebar />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
  </UApp>
</template>
