import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-config',
      writeBundle() {
        copyFileSync('public/config.json', 'dist/config.json');
      }
    }
  ],
  base: '/agenda_contactos_frontend/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});