import 'dotenv/config'
import Path from 'path'
import sitemapConfig from './sitemap.config.js'
const isProduction = (process.env.NODE_ENV === 'production')

function name(file) {
  const imagePath = Path.relative('app/assets/images', Path.dirname(file))
  return Path.join('img', imagePath, '[name].[ext]?[hash:7]')
}

export default {
  /*
  ** Headers of the page
  */
  head: {
    link: [
      { rel: 'preconnect', href: 'https://www.google-analytics.com' }
    ]
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
      configFile: true
    },
    extend (config, { isClient }) {

      if (isClient && !isProduction) {
        config.devtool = 'inline-cheap-module-source-map'
      }

      config.node = {
        fs: 'empty'
      }

      // Load web-workers
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        exclude: /(node_modules)/
      })

      // Override image loader to:
      // - match ico files
      // - force loading via file loader through the as=file resource query
      config.module.rules = config.module.rules
        .reduce((memo, rule) => {
          if (String(rule.test) === String(/\.(png|jpe?g|gif|svg|webp)$/i)) {
            rule = {
              test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
              oneOf: [
                {
                  resourceQuery: /as=file/,
                  loader: 'file-loader',
                  options: {
                    name
                  }
                },
                {
                  ...rule.use[0],
                  options: {
                    ...rule.use[0].options,
                    name
                  }
                }
              ]
            }
          }
          return memo.concat(rule)
        }, [])

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

      // Optimize svg files
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeViewBox: false },
            {
              addAttributesToSVGElement: {
                attribute: {
                  fill: '#363636'
                }
              }
            }
          ]
        },
        exclude: /(node_modules)/
      })

      config.module.rules.push({
        test: [
          /manifest\.json$/,
          /browserconfig\.xml$/,
        ],
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:7].[ext]'
            }
          },{
            loader: 'extract-loader'
          },{
            loader: 'frack-loader'
          }
        ],
        exclude: /(node_modules)/
      })
    },
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css'
    },
    publicPath: '/_/',
    // Transpile npm packages lacking ES5 compatibility:
    transpile: [
      'vue-analytics',
      /^three\/examples\/jsm/
    ],
  },

  css: [
    '~/assets/stylesheets/app.scss'
  ],

  generate: {
    dir: 'dist/app',
    subFolders: false
  },

  modules: [
    '@nuxtjs/google-analytics',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap'
  ],

  router: {
    extendRoutes(routes) {
      routes.forEach(route => {
        if (route.path === '/') {
          route.alias = '/index.html'
        } else {
          route.alias = `${route.path}.html`
        }
      })
      // Return array to replace nuxt generated routes:
      return routes
    }
  },

  srcDir: 'app',

  'google-analytics': {
    id: 'UA-106821101-1',
    debug: {
      enabled: !isProduction,
      sendHitTask: isProduction
    }
  },

  sentry: {
    clientIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: {
        attachProps: true,
        logErrors: true
      }
    },
    disableServerSide: true,
    initialize: isProduction,
  },

  sitemap: sitemapConfig
}
