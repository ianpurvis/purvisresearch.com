module.exports = (api) => {
  api.assertVersion('^7.0')

  let presetAppOptions
  switch(api.env()) {
  case 'client':
    presetAppOptions = {
      corejs: 3,
      targets: {
        chrome: '41',
        ie: '9'
      }
    }
    break
  case 'modern':
    presetAppOptions = {
      bugfixes: true,
      corejs: 3,
      targets: {
        esmodules: true
      }
    }
    break
  case 'server':
    presetAppOptions = {
      corejs: 3,
      targets: {
        node: 'current'
      }
    }
    break
  case 'test':
    presetAppOptions = {
      corejs: 3,
      modules: 'commonjs',
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage'
    }
    break
  default:
    throw 'Unknown babel envName'
  }

  const config = {
    presets: [
      ['@nuxt/babel-preset-app', presetAppOptions]
    ],

    // Polyfill CommonJS modules using 'require' syntax:
    sourceType: 'unambiguous',
  }

  return config
}
