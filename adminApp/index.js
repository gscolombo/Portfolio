import { createApp } from "vue";
import App from "./components/App.vue";

export default () => {
  const app = createApp(App);
  app.config.unwrapInjectedRef = true;
  app.mount("#app");
};
