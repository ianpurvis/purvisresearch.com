module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'specs/fixtures'
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    "~(.*)$": "<rootDir>/$1",
  },
}
