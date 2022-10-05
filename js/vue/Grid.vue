<script>
import setPortfolioGrid from '../modules/portfolioGrid.js';
import carousel from '../modules/carousel.js';
import navMenu from '../modules/navMenu';

export default {
  async created() {
    const url = location.origin + '/.netlify/functions/db/works';
    const res = await fetch(url);
    this.works = (await res.json()).documents;
  },
  beforeCreate() {
    this.mobile = innerWidth < 720;
  },
  data() {
    return {
      iframeLoaded: false,
      workSelected: null,
      works: this.works,
      carouselStarted: false,
    };
  },
  computed: {
    worksLoaded() {
      return this.works;
    },
  },
  updated() {
    if (this.mobile) {
      setPortfolioGrid();
    } else {
      navMenu();
      if (!this.carouselStarted) {
        carousel();
        this.carouselStarted = true;
      }
    }
    if (this.workSelected) document.body.classList.add('noScroll');
  },
  methods: {
    closeDetails(event) {
      const details = event.currentTarget.parentElement;
      details.classList.add('closing');

      setTimeout(() => {
        this.workSelected = null;
        this.iframeLoaded = false;
        document.body.classList.remove('noScroll');
      }, 500);
    },
  },
};
</script>

<template>
  <div class="loading" v-if="!works">
    <img src="img/loading.svg" />
    <p>Carregando projetos...</p>
  </div>
  <div
    v-if="mobile"
    class="work"
    v-for="work in worksLoaded"
    :key="work._id"
    :style="{ pointerEvents: this.workSelected ? 'none' : 'all' }"
    @click="
      () => {
        if (this.mobile) {
          workSelected = work;
        }
      }
    "
  >
    <img :src="work.dataURL" />
    <p>{{ work.title }}</p>
  </div>
  <div class="slide" v-if="!mobile">
    <div
      class="work"
      v-for="work in worksLoaded"
      :key="work._id"
      :style="{ pointerEvents: this.workSelected ? 'none' : 'all' }"
    >
      <img :src="work.dataURL" />
      <p>{{ work.title }}</p>
      <button @click="workSelected = work">Ver detalhes</button>
    </div>
  </div>
  <div class="details" v-if="workSelected" :class="{ show: workSelected }">
    <img @click="closeDetails" class="cross" src="img/cross.svg" alt="Fechar" />
    <div class="iframe-wrapper">
      <div class="loading" :class="{ concluded: iframeLoaded }">
        <img src="img/loading.svg" />
        <p>Carregando...</p>
      </div>
      <iframe
        @load="iframeLoaded = true"
        :src="workSelected.iframeLink"
        scrolling="no"
      ></iframe>
    </div>
    <div class="info-wrapper">
      <h4>{{ workSelected.title }}</h4>
      <p>{{ workSelected.description }}</p>
      <button>
        <a target="_blank" :href="workSelected.iframeLink">Acesse o site</a>
      </button>
      <button>
        <a target="_blank" :href="workSelected.repoLink"
          >Acesse o repositório</a
        >
        <img src="img/github-svgrepo-com.svg" alt="Logo do Github" />
      </button>
    </div>
  </div>
</template>
