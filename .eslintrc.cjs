require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    defineNuxtConfig: 'readonly',
    defineNuxtPlugin: 'readonly',
    vue: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@nuxt/eslint-config',
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'always',
      },
    ],
  },
  settings: {
    'import/core-modules': [ // these modules are included in nuxt.js
      'vue',
    ],
  },
};
