export default () => ({
  css: [
    '~/assets/stylesheets/app.scss'
  ],
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
