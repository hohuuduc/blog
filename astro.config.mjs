import { defineConfig } from 'astro/config';
import angular from '@analogjs/astro-angular';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import { remarkReadingTime } from './src/utils/remark-reading-time';
import { remarkIframe } from './src/utils/remark-iframe';
import { remarkCollapse } from './src/utils/remark-collapse';

const tsconfig = fileURLToPath(new URL('./tsconfig.app.json', import.meta.url));

export default defineConfig({
  integrations: [
    angular({
      vite: {
        tsconfig
      }
    })
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkGfm, remarkIframe, remarkCollapse],
  },
  output: 'static',
  build: {
    assetsPrefix: `/${process.env.URL_PAGE}/`
  },
  experimental: {
    contentIntellisense: true
  },
  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "vi",
  }
});
