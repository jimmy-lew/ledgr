<script setup lang="ts">

</script>

<template>
<div class="gradient-blur">
  <div class=""></div>
</div>
</template>

<style>
.gradient-blur {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.gradient-blur > div,
.gradient-blur::before,
.gradient-blur::after {
  position: absolute;
  inset: 0;
}
.gradient-blur::before {
  content: "";
  z-index: 1;
  backdrop-filter: blur(1px);
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 25%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) 75%
  );
}
.gradient-blur::after {
  content: "";
  z-index: 2;
  backdrop-filter: blur(2px);
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 25%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 1) 75%,
    rgba(0, 0, 0, 1) 100%
  );
}

</style>
