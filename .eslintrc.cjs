module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    Iugu: 'readonly',
    VotolegalFP: 'readonly',
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
  ],
  ignorePatterns: [
    '**/vendor/*.*'
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
