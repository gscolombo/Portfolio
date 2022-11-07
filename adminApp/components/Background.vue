<script>
import bg from 'poly-bg';

export default {
  mounted() {
    const html = document.querySelector('html');
    bg('bg', 3, 3, html.clientWidth, html.clientHeight, false);
  },
};
</script>

<template>
  <div class="admin-background">
    <canvas id="bg"></canvas>
    <svg class="svg-background-filter">
      <rect width="100%" height="100%" fill="#000000" opacity="0.5" />
    </svg>
  </div>
</template>

<style lang="scss">
.admin-background {
  position: fixed;
  z-index: -1;
  max-width: 100%;
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(1px);
  }
}
</style>
