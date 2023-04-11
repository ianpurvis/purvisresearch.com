export default () => ({
  css: [
    '~/assets/stylesheets/app.scss'
  ],
  dir: {
    static: '../public'
  },
  generate: {
    subFolders: false
  },
  loading: {
    color: '#3B8070'
  },
  modern: 'client',
  srcDir: 'src',
  ssr: false,
  target: 'static'
})
