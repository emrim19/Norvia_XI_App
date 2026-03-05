import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // 1. Point to your new preload folder
      entry: 'src/preload/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        // 2. Ensure the output file name matches what windowManager expects
        entryFileNames: 'preload.js',
      },
    },
    outDir: '.vite/build',
    emptyOutDir: false, // Don't delete the main process files already there
  },
});