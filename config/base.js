import unskipVite from '../src/modules/unskip-vite.js'

export default () => ({
  app: {
    buildAssetsDir: '_'
  },
  bridge: {
    meta: true,
    vite: true
  },
  buildDir: 'src/.nuxt/',
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
  modules: [
    unskipVite
  ],
  srcDir: 'src',
  target: 'static',
  vite: {
    assetsInclude: [
      '**/*.glb',
      '**/*.glsl',
      '**/*.xml',
      'lib/draco/*',
    ],
    build: {
      assetsInlineLimit: 0,
    }
  }
})
