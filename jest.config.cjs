const transformPatterns = [
  'd3-ease',
  'three/examples/jsm',
  'three/build/three.module'
]

const defaults = {
  coveragePathIgnorePatterns: [
    'lib/draco/.*',
    'spec/.*'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(${transformPatterns.join('|')}))`
  ],
}

module.exports = {
  collectCoverage: true,
  projects: [
    {
      ...defaults,
      displayName: 'app',
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/spec/mocks/file-mock.js',
        '\\.(eot|otf|ttf|woff|woff2)$': '<rootDir>/spec/mocks/file-mock.js',
        '\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/spec/mocks/file-mock.js',
        '\\.(gltf|glb|glsl)$': '<rootDir>/spec/mocks/file-mock.js',
        '\\.(wasm)$': '<rootDir>/spec/mocks/file-mock.js',
        'draco/(.*)$': '<rootDir>/lib/draco/$1',
        '~(.*)$': '<rootDir>/app/$1',
      },
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/spec/app/**/*.spec.js'
      ],
    }
  ]
}
