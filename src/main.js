import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Importar fuente (opcional)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const app = createApp(App);

// Plugins
app.use(createPinia());
app.use(router);

// Directivas globales (opcional)
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

// Montar aplicación
app.mount('#app');