<script setup lang="ts">
const title = 'Ledgr'
const description = ''

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content' },
  ],
  link: [{ rel: 'icon', href: '/ledgr.svg' }],
  htmlAttrs: { lang: 'en' },
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
  'G-S': () => router.push('/settings/preferences')
})

const toaster = {
  expand: false,
  position: 'bottom-center' as const,
  class: 'bottom-24 sm:bottom-4 w-74',
}
</script>

<template>
  <UApp :toaster>
    <div class="flex flex-1 w-full h-full min-h-full bg-default sm:bg-neutral sm:dark:bg-default" data-vaul-drawer-wrapper>
      <NuxtPwaAssets />
      <HomeSidebar />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ActionBar class="z-50 sm:hidden" />
    </div>
  </UApp>
</template>
