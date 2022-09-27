<script>
import Background from "./Background.vue";
import AddProjectButton from "./addProjectButton.vue";
import eraseAllButton from "./eraseAllButton.vue";
import WorkGrid from "./WorkGrid.vue";
import GridPlaceholder from "./GridPlaceholder.vue";
import WorkPanel from "./WorkPanel.vue";
import { computed } from "@vue/reactivity";

export default {
  async created() {
    const url = location.origin + "/.netlify/functions/db/works";
    const res = await fetch(url);
    const works = (await res.json()).documents || [];
    this.works = works;
  },
  data() {
    return {
      works: [],
      openPanel: false,
      newWork: false,
    };
  },
  provide() {
    return {
      openPanel: computed(() => this.openPanel),
      newWork: computed(() => this.newWork),
    };
  },
  methods: {
    // Update work's grid
    updateWorkGrid(res, method) {
      switch (method) {
        case "POST":
          this.works.push(res);
          this.newWork = false;
          break;
        case "PATCH":
          const updatedWorkIndex = this.works.findIndex(
            (work) => work.id == res.id
          );
          this.works[updatedWorkIndex] = res;
          break;
        case "DELETE":
          this.works = res || [];
      }
    },
  },
  components: {
    Background,
    AddProjectButton,
    eraseAllButton,
    WorkGrid,
    GridPlaceholder,
    WorkPanel,
  },
};
</script>

<template>
  <Background />
  <div class="wrapper">
    <div class="upper-panel-container">
      <h1>Painel de administração de portfólio</h1>
      <div class="buttons-wrapper">
        <AddProjectButton
          @click="
            this.openPanel = true;
            this.newWork = true;
          "
        />
        <eraseAllButton />
      </div>
    </div>
    <WorkGrid
      :works="this.works"
      v-if="this.works.length"
      :open-panel="this.openPanel"
      @update-grid="updateWorkGrid"
      @closePanel="this.openPanel = false"
    />
    <GridPlaceholder v-if="!this.works.length" />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  vertical-align: baseline;
}

img {
  max-width: 100%;
  display: block;
}

.wrapper {
  max-width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: fit-content(100%) 1fr;
}

h1 {
  @include typo(48, $cwhite, "main");
  text-align: center;
  padding-top: 100px;
}

.buttons-wrapper {
  margin: 0 auto;
  display: flex;
  gap: 40px;
  justify-content: space-evenly;
  margin-top: 50px;
  padding: 0 12.5% 40px 12.5%;
  border-bottom: 1px solid $red;
}
</style>
