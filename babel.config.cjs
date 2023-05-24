module.exports = (api) => {
  api.assertVersion('^7.0')
  api.cache(true)

  return {
    presets: [
      '@babel/preset-env'
    ],
    targets: {
      esmodules: true
    }
  }
}
