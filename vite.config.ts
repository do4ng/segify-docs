import { defineConfig } from 'vite';
import { compile } from 'segify';
import { readFileSync } from 'fs';

let index = 0;

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
        'typescript',
      ],
    },
  },
  base: './',

  plugins: [
    {
      name: 'segify',
      async transform(code, id, options) {
        if (!id.endsWith('.seg')) return;

        code = readFileSync(id).toString();
        const compiled = await compile(code);

        return {
          code: compiled,
          map: null,
        };
      },
    },
  ],
});
