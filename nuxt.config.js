import organization from './structured_data/organization.js'

const isProduction = (process.env.NODE_ENV === 'production')

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'purvis research',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: organization.description }
    ],
    link: [
      { rel:"apple-touch-icon", sizes:"180x180", href:"/favicons/apple-touch-icon.png" },
      { rel:'icon', type:'image/x-icon', href:'/favicons/favicon2.ico' },
      { rel:"manifest",  href:"/manifest.json" },
      { rel:"mask-icon", href:"/favicons/safari-pinned-tab.svg", color:"#f5f5f5" },
    ],
    script: [
      { hid: 'jsonld', type: 'application/ld+json', innerHTML: JSON.stringify(organization) }
    ],
    __dangerouslyDisableSanitizersByTagID: { 'jsonld': 'innerHTML' },
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      presets({ isServer }) {
        return [
          [ '@nuxt/babel-preset-app', {
            corejs: 3,
            targets: isServer ? {
              node: 'current'
            } : {
              chrome: '41',
              ie: '9'
            },
          }]
        ]
      },
      // Polyfill CommonJS modules using 'require' syntax:
      sourceType: 'unambiguous',
    },
    extend (config, { isDev, isClient, loaders }) {
      config.node = {
        fs: "empty"
      }

      // Inline fonts up to 10k
      loaders.fontUrl.limit = 10000

      // Load glb models as arraybuffer
      config.module.rules.push({
        test: /\.glb$/,
        loader: 'arraybuffer-loader',
        exclude: /(node_modules)/
      })

      // Load glsl models as string
      config.module.rules.push({
        test: /\.glsl$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/
      })

      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css'
    },
    publicPath: '/_/',
    // Transpile npm packages lacking ES5 compatibility:
    transpile: [
      'nuxt-jsonld'
    ],
  },

  css: [
    '@/assets/stylesheets/app.scss'
  ],

  generate: {
    subFolders: false
  },

  modules: [
    '@nuxtjs/google-analytics',
    '@nuxtjs/sitemap'
  ],

  plugins: [
    '~/plugins/nuxt-jsonld'
  ],

  router: {
    extendRoutes (routes, resolve) {
      routes.forEach(route => {
        if (!route.path.endsWith('/')) {
          route.path += '\.html'
        }
      })
      // Return array to replace nuxt generated routes:
      return routes
    }
  },

  'google-analytics': {
    id: 'UA-106821101-1',
    debug: {
      enabled: !isProduction,
      sendHitTask: isProduction
    }
  },

  sitemap: {
    exclude: [
      '/404.html',
    ],
    hostname: organization.url,
    routes: [{
      url: '/',
      changefreq: 'monthly',
      priority: 1
    }]
  }
}
