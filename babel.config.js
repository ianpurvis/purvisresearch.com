module.exports = (api) => {
  api.assertVersion('^7.0')

  let config = {}

  if (api.env('test')) {
    config = {
      presets: [
        ['@babel/preset-env', {
          corejs: 3,
          modules: 'commonjs',
          targets: {
            node: 'current'
          },
          useBuiltIns: 'usage'
        }]
      ]
    }
  }

  return config
}
