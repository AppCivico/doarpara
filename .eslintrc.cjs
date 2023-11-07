module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
  ],
  overrides: [
    {
      files: [
        'store/*.js',
        'store/*.ts'
      ],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: [
        'pages/**/*.vue',
        'layouts/default.vue',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
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
      'pinia',
      'vue',
    ],
  },
};
