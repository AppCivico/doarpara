// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-08',
  app: {
    head: {
      noscript: [
        { textContent: 'JavaScript is required' },
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
    analyze: true,
    transpile: ['vue-i18n'],
  },
  css: ['@/assets/scss/index.scss'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  i18n: {
    baseUrl: process.env.BASE_URL,
    bundle: {
      optimizeTranslationDirective: false,
    },
    lazy: true,
    strategy: 'no_prefix',
    defaultLocale: 'pt-BR',
    locales: [
      {
        code: 'pt-BR',
        iso: 'pt-BR',
        file: 'pt-BR.ts',
      },
    ],
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/mdc',
    '@pinia-plugin-persistedstate/nuxt',
    '@sentry/nuxt/module',
    'nuxt-gtag',
  ],
  runtimeConfig: {
    public: {
      title: process.env.APP_TITLE
        || 'DoarPara',

      isIuguTesting: Number(process.env.IUGU_IS_TESTING) === 0
        ? 0
        : 1,

      campaignPoolingInterval: Number(process.env.CAMPAIGN_POOLING_INTERVAL)
        || 0,

      controlPanelOrigin: process.env.CONTROL_PANEL_ORIGIN || '',

      masks: {
        creditCardExpirationCsc: process.env.MASKS_CREDIT_CARD_EXPIRATION_CSC
          || "['###', '####']",
        creditCardExpirationDate: {
          mask: process.env.MASKS_CREDIT_CARD_EXPIRATION_DATE_MASK
            || "['##/##', '##/####']",
          placeholder: process.env.MASKS_CREDIT_CARD_EXPIRATION_DATE_PLACEHOLDER
            || 'MM/YY ou MM/YYYY',
        },
        creditCardNumber: process.env.MASKS_CREDIT_CARD_NUMBER
          || "['#### #### #### ####', '#### #### #### ##']",
        naturalPersonIdentification: process.env.MASKS_NATURAL_PERSON_IDENTIFICATION
          || '###.###.###-##',
        zipCode: process.env.MASKS_ZIP_CODE
          || '#####-###',
      },
      queryStringSpecialParameters: {
        amount: process.env.QUERY_STRING_SPECIAL_PARAMETERS_AMOUNT
          || 'amount',
        referrer: process.env.QUERY_STRING_SPECIAL_PARAMETERS_REFERRER
          || 'ref',
      },

      publicApiBase: process.env.PUBLIC_API
        || 'https://dapi.votolegal.com.br/public-api',
      privateApiBase: process.env.PRIVATE_API
        || 'https://dapi.votolegal.com.br',
      receiptsBase: process.env.RECEIPTS_BASE || '',
      postalService: {
        queryUrl: process.env.POSTAL_SERVICE_QUERY_URL
          || 'https://dapi.votolegal.com.br/api/cep?cep=',
        helperWebsiteUrl: process.env.POSTAL_SERVICE_HELPER_WEBSITE_URL
          || 'https://buscacepinter.correios.com.br/',
      },
      urlOfPrivacyPolicy: process.env.URL_OF_PRIVACY_POLICY || 'https://blog.doarpara.com.br/contrato/',
      urlOfUseTerms: process.env.URL_OF_USE_TERMS || 'https://blog.doarpara.com.br/contrato/',
    },
  },
  sentry: {
    sourceMapsUploadOptions: {
      org: 'appcivico',
      project: 'doarpara',
      authToken: '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',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules'],
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
