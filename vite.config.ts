import { defineConfig } from 'vite';
import { compile } from 'segify';
import { readFileSync } from 'fs';

let index = 0;

export default defineConfig({
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
  base: './',

  plugins: [
    {
      name: 'segify',
      async transform(code, id, options) {
        if (!id.endsWith('.seg')) return;

        global.segify_asset = './node_modules/segify/client/lib.mjs';
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
