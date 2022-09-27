<template>
  <div class="watermark">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.watermark {
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: $cwhite + AA;
  backdrop-filter: blur(5px);
  opacity: 0;
  transition: opacity 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 1;
  }
}
</style>
