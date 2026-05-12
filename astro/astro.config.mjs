import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://floor.dsgn',
  outDir: './dist',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  trailingSlash: 'never',
});
