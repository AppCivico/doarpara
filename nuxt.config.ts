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
    defaultLocale: 'pt-BR',
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/mdc',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-gtag',
    '@nuxtjs/sentry',
  ],
  sentry: {
    dsn: 'https://aeb86c65c0f8bc43f849b547b2d62db7@o75154.ingest.us.sentry.io/4507295736594432', // Enter your project's DSN.
    // Additional module options go here.
  },
  runtimeConfig: {
    public: {
      title: process.env.APP_TITLE
        || 'DoarPara',

      isIuguTesting: Number(process.env.IUGU_IS_TESTING) === 0 ? 0 : 1,

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
        || 'https://votolegal-test-api.appcivico.com/public-api',
      privateApiBase: process.env.PRIVATE_API
        || 'https://votolegal-test-api.appcivico.com',
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
