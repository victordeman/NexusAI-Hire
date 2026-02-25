import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'frontend',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html'),
        interview: resolve(__dirname, 'frontend/interview.html'),
        dashboard: resolve(__dirname, 'frontend/dashboard.html'),
        register: resolve(__dirname, 'frontend/register.html'),
      },
    },
  },
});
