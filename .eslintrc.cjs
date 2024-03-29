module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/vue3-essential',
    'airbnb-base',
    '@vue/typescript/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parserOptions: {
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['vue', 'prettier', '@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'class-methods-use-this': 0,
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'import/prefer-default-export': 'off',
    camelcase: 'warn',
    'vue/no-unused-components': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-undef': 'off',
    'max-len': 'off',
    'global-require': 'off',
    'no-return-await': 'off',
    'import/first': 'off',
    'no-plusplus': 'off',
    'guard-for-in': 'warn',
    'no-unused-expressions': 'warn',
    'import/extensions': 'off',
    'no-useless-catch': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'warn',
    'no-multi-assign': 'off',
    'no-return-assign': 'warn',
    'no-restricted-syntax': 'off',
    'no-use-before-define': 'warn',
    'implicit-arrow-linebreak': 'off',
    'no-restricted-globals': 'off',
    'newline-per-chained-call': 'off',
    'no-throw-literal': 'off',
    'no-continue': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
    'no-void': 'warn',
    'object-curly-newline': 'warn',
    'operator-linebreak': 'warn',
    'no-useless-constructor': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-await-in-loop': 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-end-tags': 'error',
    '@typescript-eslint/no-empty-interface': 'warn',
    'no-lonely-if': 'off',
    'no-unused-vars': ['off', { varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unused-vars': ['off', { varsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    'vue/valid-attribute-name': 'off',
    'vue/valid-model-definition': 'off',
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/no-multi-spaces': 'error',
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      },
    ],
    'vue/require-prop-types': ['error'],
    'vue/require-valid-default-prop': ['error'],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
