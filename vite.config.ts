import { defineConfig } from 'vite';
import { Segify } from 'vite-plugin-segify';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: './index.html',
        repl: './repl.html',
      },
      external: [
        'fs',
        'path',
        'node:fs',
        'node:path',
        'node:url',
        'node:module',
        'module',
        'typescript',
      ],
    },
  },
  base: './',

  plugins: [Segify()],
});
