<script setup>
definePageMeta({
  layout: 'blank',
})

const router = useRouter()
</script>

<template>
  <div class="h-svh">
    <div class="m-auto h-full w-full flex flex-col items-center justify-center gap-2">
      <h1 class="text-[7rem] font-black leading-tight">
        503
      </h1>
      <span class="font-medium">Website is under maintenance!</span>
      <p class="text-center text-muted-foreground">
        The site is not available at the moment. <br>
        We'll be back online shortly.
      </p>
      <div class="mt-6 flex gap-4">
        <UButton variant="outline" @click="router.back()" color="neutral">
          Go Back
        </UButton>
        <UButton @click="router.push('/')" color="neutral">
          Back to Home
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
