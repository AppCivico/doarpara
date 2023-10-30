import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vue-i18n'],
  },
  devtools: { enabled: true },
  css: ['@/assets/scss/index.scss'],
  runtimeConfig: {
    public: {
      apiBase: 'https://dapi.votolegal.com.br/public-api',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/abstracts" as my;',
        },
      },
    },
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json'),
        ],
      }),
    ],
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
