const path = require('path')

const extensionIsAnyOf = (...extensions) =>
  new RegExp(`\\.(${ extensions.join('|') })$`)

module.exports = (env, { mode = 'development' }) => {

  env = { ...process.env, ...env }

  console.log(`Mode: ${mode}`)

  return {
    entry: 's6',
    externals: /^aws-sdk/,
    mode,
    module: {
      rules: [
        {
          test: extensionIsAnyOf('js', 'jsx'),
          loader: 'babel-loader',
          exclude: /(node_modules)/
        }
      ]
    },
    output: {
      filename: 'index.js',
      libraryTarget: 'commonjs2',
      path: path.resolve('dist/lambda')
    },
    target: 'node',
  }
}
