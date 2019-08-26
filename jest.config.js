const transformPatterns = [
  'three/examples/jsm',
  'three/build/three.module'
]

const defaults = {
  coveragePathIgnorePatterns: [
    'spec/.*'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
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
        '~(.*)$': '<rootDir>/app/$1',
      },
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/spec/app/**/*\.spec\.js'
      ],
    },
    {
      ...defaults,
      displayName: 'lambda',
      moduleNameMapper: {
        '~(.*)$': '<rootDir>/$1',
      },
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/spec/lambda/**/*\.spec\.js'
      ]
    },
  ]
}
