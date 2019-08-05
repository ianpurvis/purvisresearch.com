const defaults = {
  coveragePathIgnorePatterns: [
    'spec/.*'
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
