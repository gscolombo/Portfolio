<script>
import WorkPanel from "./WorkPanel.vue";

export default {
  props: ["works", "openPanel"],
  emits: ["updateGrid", "closePanel"],
  data() {
    return {
      workSelected: null,
      workTemplate: {
        title: "",
        description: "",
        iframeLink: "",
        repoLink: "",
        dataURL: "",
      },
    };
  },
  methods: {
    // Close work panel
    closeWorkPanel(refs) {
      refs.panel.classList.add("closing");

      setTimeout(() => {
        this.$emit("closePanel");
        this.workSelected = null;
        this.workTemplate = {
          title: "",
          description: "",
          iframeLink: "",
          repoLink: "",
          dataURL: "",
        };
      }, 500);
    },
  },
  components: {
    WorkPanel,
  },
};
</script>

<template>
  <ul class="work-grid">
    <li
      v-for="work in this.works"
      @click="
        () => {
          workSelected = { ...work };
        }
      "
      :key="work._id"
      :style="{
        animationDelay: 0.125 * works.indexOf(work) + 's',
      }"
    >
      <img :src="work.dataURL" alt="" />
      {{ work.title }}
    </li>
    <WorkPanel
      v-if="workSelected || openPanel"
      :work="workSelected || workTemplate"
      @update-grid="(res, method) => this.$emit('updateGrid', res, method)"
      @close-panel="closeWorkPanel"
    />
    <p v-if="!works">Nenhum projeto encontrado.</p>
  </ul>
</template>

<style lang="scss">
@keyframes appearGrowing {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
ul.work-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: fit-content(100%) fit-content(100%);
  gap: 20px;
  padding: 20px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: 0;
  p {
    @include typo(24, $cwhite, "sec");
    grid-column: 2 / 4;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  li {
    padding-bottom: 10px;
    opacity: 0.75;
    transition: all 0.25s;
    cursor: pointer;
    text-align: center;
    @include typo(16, $cwhite, "sec");
    transform: scale(0);
    animation: appearGrowing 0.5s forwards ease;
    img {
      margin-bottom: 10px;
    }
    &:hover {
      opacity: 1;
      box-shadow: 0 1px $red;
    }
  }
}
</style>
