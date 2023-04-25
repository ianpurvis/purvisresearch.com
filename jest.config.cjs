const transformPatterns = [
  'd3-ease',
  'three/examples/jsm',
  'three/build/three.module'
]

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}'
  ],
  coverageProvider: 'v8',
  injectGlobals: false,
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  moduleNameMapper: {
    '\\?.*(raw|url).*$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(css|scss)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(eot|otf|ttf|woff|woff2)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(gltf|glb|glsl)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(xml)$': '<rootDir>/spec/mocks/file-mock.js',
    '\\.(wasm)$': '<rootDir>/spec/mocks/file-mock.js',
    '~(.*)$': '<rootDir>/src/$1',
    '#imports': '<rootDir>/node_modules/@nuxt/bridge/dist/runtime/head/composables.mjs'
  },
  setupFilesAfterEnv: [
    '<rootDir>/spec/setup.js'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|cjs|mjs)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(${transformPatterns.join('|')}))`
  ],
}
