const defaults = {
  coveragePathIgnorePatterns: [
    'spec/.*'
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!three/examples/jsm/.*)'
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
