module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: 'eslint:recommended',
  globals: {
    fetch: 'off',
    globalThis: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  overrides: [
    {
      files: [
        '*.config.js',
        '.*rc.js',
        'bin/**/*.js',
        'lib/**/*.js'
      ],
      env: {
        node: true
      },
    },
    {
      files: [
        '**/*.spec.js'
      ],
      env: {
        'jest/globals': false,
        node: true
      },
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style'
      ],
      plugins: [
        'jest'
      ]
    },
    {
      files: [
        '**/*.vue',
      ],
      extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
      ],
      env: {
        node: true
      },
      plugins: [
        'vue'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  root: true,
  rules: {
    indent: [ 'error', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    quotes: [ 'error', 'single', { 'avoidEscape': true } ],
    semi: [ 'error', 'never' ]
  }
}
