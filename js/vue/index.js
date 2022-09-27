import { createApp } from "vue";
import Grid from "./Grid.vue";

export default () => {
  createApp(Grid).mount(".portfolio-wrapper .grid");
};
