import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // 1. Point the root to your new renderer folder
  root: path.join(__dirname, 'src/renderer'),
  plugins: [react()],
  base: './',
  build: {
    outDir: path.join(__dirname, '.vite/renderer/main_window'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});