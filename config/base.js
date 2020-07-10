export default config => {
  Object.assign(config, {
    css: [
      '~/assets/stylesheets/app.scss'
    ],
    generate: {
      dir: 'dist/app',
      subFolders: false
    },
    loading: {
      color: '#3B8070'
    },
    modern: 'client',
    srcDir: 'app',
  })
}
