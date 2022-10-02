<template>
  <ul class="grid-placeholder">
    <li v-for="n in 8" :style="{ animationDelay: 0.125 * n + 's' }">
      <svg width="100%" height="100%">
        <rect width="100%" height="100%" rx="5" />
      </svg>
    </li>
  </ul>
</template>

<style lang="scss">
@keyframes wave {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

ul.grid-placeholder {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px 40px;
  padding: 20px;
  li {
    width: 100%;
    height: 100%;
    animation: wave 1s alternate infinite ease-in-out;
    display: flex;
    align-items: center;
    backdrop-filter: blur(5px);
    svg {
      opacity: 0.5;
      filter: drop-shadow(1px 1px 4px $cwhite)
        drop-shadow(-1px -1px 4px $cwhite);
      rect {
        fill: $cwhite;
      }
    }
  }
}
</style>
