<script>
import LoadingModal from './LoadingModal.vue';
import Watermark from './Watermark.vue';

export default {
  props: {
    work: Object,
  },
  data() {
    return {
      reading: false,
    };
  },
  methods: {
    setDataURL(event) {
      const reader = new FileReader();

      let fileList =
        event.type == 'input' ? event.target.files : event.dataTransfer.files;
      let transfer;
      for (const file of fileList) {
        transfer = file;
      }

      this.reading = true;
      reader.readAsDataURL(transfer);

      reader.onloadend = async () => {
        const url = location.origin + '/.netlify/functions/convert';
        const params = {
          method: 'POST',
          body: reader.result,
        };
        const dataURL = await (await fetch(url, params)).text();

        this.reading = false;
        this.work.dataURL = dataURL;
      };
    },
  },
  components: { LoadingModal, Watermark },
};
</script>

<template>
  <div class="dropField">
    <div class="image-container" v-show="work.dataURL">
      <img :src="work.dataURL" />
      <Watermark @click="work.dataURL = ''">
        <img src="img/icons8-trash.svg" />
        <p>Remover imagem</p>
      </Watermark>
    </div>
    <input
      v-if="work.dataURL == ''"
      accept="image/*"
      type="file"
      name="dataURL"
      id="dataURL"
      @input="setDataURL"
    />
    <label v-show="!work.dataURL" for="dataURL" @drop="setDataURL"
      ><b>Solte uma imagem aqui</b>ou<b>carregue um arquivo</b>
    </label>
    <LoadingModal
      v-show="reading"
      message="Carregando imagem..."
      :style="{ minWidth: '100%', minHeight: '100%', padding: 0, bottom: 0 }"
    />
  </div>
</template>

<style lang="scss">
.dropField {
  position: relative;
  input {
    display: none;
    & + label {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      @include typo(24, $cwhite, 'sec');
      background-color: black;
      border: 1px solid $red;
      width: 100%;
      min-height: 360px;
      b {
        font-weight: bold;
      }
    }
  }
  .image-container {
    display: flex;
    max-height: 50vh;
    position: relative;
    background-color: $cwhite;
    img {
      position: relative;
      z-index: 0;
      object-fit: contain;
      max-width: 100%;
      display: block;
    }
    p {
      @include typo(16, black, 'sec');
      text-align: center;
      color: black !important;
      display: inline-block !important;
    }
  }
}
</style>
