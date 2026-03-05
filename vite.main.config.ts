import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // 1. Point this to your new main file location
      entry: 'src/main/main.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      // 2. These modules exist in Electron/Node; don't try to "bundle" them
      external: [
        'electron',
        'axios',
        'fs',
        'os',
        'path',
        'electron-squirrel-startup'
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
    // 3. This ensures the output goes where Electron expects it
    outDir: '.vite/build',
    watch: {},
    minify: false,
  },
});