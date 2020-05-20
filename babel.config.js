module.exports = (api) => {
  api.assertVersion('^7.0')

  let presets
  switch(api.env()) {
  case 'client':
    presets = [
      ['@nuxt/babel-preset-app', {
        corejs: 3,
        targets: {
          chrome: '41',
          ie: '9'
        }
      }]
    ]
    break
  case 'server':
    presets = [
      ['@nuxt/babel-preset-app', {
        corejs: 3,
        targets: {
          node: 'current'
        }
      }]
    ]
    break
  case 'test':
    presets = [
      ['@babel/preset-env', {
        corejs: 3,
        modules: 'commonjs',
        targets: {
          node: 'current'
        },
        useBuiltIns: 'usage'
      }]
    ]
    break
  default:
    throw 'Unknown babel envName'
  }

  const config = {
    presets,

    // Polyfill CommonJS modules using 'require' syntax:
    sourceType: 'unambiguous',
  }

  return config
}
