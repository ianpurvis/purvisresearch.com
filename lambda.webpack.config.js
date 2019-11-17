const path = require('path')

module.exports = {
  entry: path.resolve('lib/proxy.js'),
  externals: /^aws-sdk/,
  mode: 'development',
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
    path: path.resolve('dist/lambda')
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    }
  },
  target: 'node',
}
