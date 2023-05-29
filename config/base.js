export default () => ({
  app: {
    buildAssetsDir: '_'
  },
  css: [
    '~/assets/stylesheets/app.scss'
  ],
  dir: {
    public: '../public'
  },
  runtimeConfig: {
    public: {
      SENTRY_DSN: undefined,
    }
  },
  srcDir: 'src',
  ssr: false,
  target: 'static',
  vite: {
    assetsInclude: [
      '**/*.glb',
      '**/*.glsl',
      '**/*.xml',
      'lib/draco/*',
    ],
    build: {
      assetsInlineLimit: 0
    }
  }
})
