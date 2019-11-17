const { ProgressPlugin } = require('webpack')
const { resolve } = require('path')

module.exports = (env, { mode = 'development' }) => {

  env = { ...process.env, ...env }

  console.log(`Mode: ${mode}`)

  return {
    entry: './lambda/middleware/index.js',
    externals: /^aws-sdk/,
    mode,
    module: {
      rules: [
        {
          test: /\.js$/,
          type: 'javascript/esm',
          exclude: /node_modules/
        }
      ]
    },
    output: {
      filename: 'index.js',
      libraryTarget: 'commonjs2',
      path: resolve('dist/lambda')
    },
    plugins: [
      new ProgressPlugin(),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname)
      }
    },
    target: 'node',
  }
}
