// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      noscript: [
        { children: 'JavaScript is required' },
      ],
    },
    pageTransition: {
      name: 'page-slide-right',
      mode: 'out-in',
    },
  },
  build: {
    transpile: ['vue-i18n'],
  },
  devtools: { enabled: true },
  css: ['@/assets/scss/index.scss'],
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxtjs/mdc'],
  runtimeConfig: {
    public: {
      apiBase: 'https://dapi.votolegal.com.br/public-api',
      receiptsBase: 'foo://bar',
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
  },
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        allowJs: true,
        allowImportingTsExtensions: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        strictNullChecks: true,
      },
      include: [
        '.eslintrc.cjs',
      ],
    },
  },
});
