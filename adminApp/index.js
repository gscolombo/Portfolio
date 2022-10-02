import { createApp } from 'vue';
import App from './components/App.vue';

// Remove drag-and-drop event listener from window object
['drop', 'dragover'].forEach((event) => {
  window.addEventListener(event, (e) => e.preventDefault());
});

const app = createApp(App);
app.config.unwrapInjectedRef = true;
app.mount('#app');
