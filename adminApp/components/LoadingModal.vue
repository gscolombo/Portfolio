<script>
export default {
  props: {
    message: String,
  },
};
</script>

<template>
  <div id="loading-modal">
    <img src="img/loading.svg" alt="Ícone de carregamento" />
    <p>{{ message }}</p>
  </div>
</template>

<style lang="scss">
#loading-modal {
  background-color: #000000aa;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25vh 0;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  justify-content: center;
  img {
    min-width: 25%;
  }
  p {
    display: inline-block;
    text-align: center;
    @include typo(24, $cwhite, "sec");
  }
}
</style>
