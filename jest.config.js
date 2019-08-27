const transformPatterns = [
  'three/examples/jsm',
  'three/build/three.module'
]

const defaults = {
  coveragePathIgnorePatterns: [
    'spec/.*'
  ],
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
        '\\.(gltf|glb)$': '<rootDir>/spec/mocks/file-mock.js',
        '\\?as=file$': '<rootDir>/spec/mocks/file-mock.js',
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
