<script setup lang="ts"></script>

<template>
<div class="relative px-6 w-full mt-64">
  <div class="flex items-center justify-between rounded-2xl bg-default dark:bg-zinc-850 p-2">
    <div class="flex flex-col gap-1 p-3 w-1/2">
      <span class="text-xs text-muted">
        Last month
      </span>
      <div class="flex items-start justify-start gap-1">
        <span class="text-lg font-bold">
          -1000
        </span>
        <span class="text-xs text-green-400 flex items-center gap-0 justify-start">
          <UIcon name="lucide:chevron-down"/>
          1.5%
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-1 p-3 w-1/2">
      <span class="text-xs text-muted">
        Weekly
      </span>
      <div class="flex items-start justify-start gap-1">
        <span class="text-lg font-bold">
          -52
        </span>
        <span class="text-xs text-green-400 flex items-center gap-0 justify-start">
          <UIcon name="lucide:chevron-down"/>
          150.2%
        </span>
      </div>
    </div>
  </div>
</div>

</template>
