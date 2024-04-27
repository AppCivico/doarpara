// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      noscript: [
        { children: 'JavaScript is required' },
      ],
    },
    layoutTransition: {
      name: 'page-slide-right',
      mode: 'out-in',
    },
    pageTransition: {
      name: 'page-slide-right',
      mode: 'out-in',
    },
  },
  build: {
    transpile: ['vue-i18n'],
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ['@/assets/scss/index.scss'],
  i18n: {
    defaultLocale: 'pt-BR',
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/mdc',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  runtimeConfig: {
    public: {
      publicApiBase: 'https://votolegal-test-api.appcivico.com/public-api',
      privateApiBase: 'https://votolegal-test-api.appcivico.com',
      receiptsBase: 'foo://bar',
      postalService: {
        queryUrl: 'https://dapi.votolegal.com.br/api/cep?cep=',
        helperWebsiteUrl: 'https://buscacepinter.correios.com.br/',
      },
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
        noImplicitAny: true,
        strict: true,
        strictNullChecks: true,
      },
      include: [
        './.eslintrc.cjs',
      ],
    },
  },
});
