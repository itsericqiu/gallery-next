import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://photos.ericqiu.io',
  output: 'static',
  vite: {
    server: {
      allowedHosts: ['erics-macbook-pro.taile48ff4.ts.net'],
    },
  },
});
