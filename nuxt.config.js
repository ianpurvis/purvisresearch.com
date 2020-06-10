import 'dotenv/config'
import { dirname, relative } from 'path'
import sitemapConfig from './sitemap.config.js'
const isProduction = (process.env.NODE_ENV === 'production')

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
    extend(config, { isClient, isDev, isModern }) {

      const { chunk, other, wasm } =
        this.buildContext.options.build.filenames

      if (isClient && isDev) {
        config.devtool = 'inline-cheap-module-source-map'
      }

      config.node = {
        fs: 'empty'
      }

      // Load web-workers
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: chunk({ isDev, isModern })
        },
        exclude: /(node_modules)/
      })

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
              name: other({ isDev })
            }
          },{
            loader: 'extract-loader'
          },{
            loader: 'frack-loader'
          }
        ],
        exclude: /(node_modules)/
      })

      config.module.rules.push({
        test: /\.wasm$/,
        type: 'javascript/auto',
        include: /(node_modules)\/ammo.js/,
        loaders: 'file-loader',
        options: {
          name: wasm({ isDev, isModern })
        },
      })
    },
    filenames: {
      img: ({ isDev }) =>
        (resourcePath) => {
          const nestedPath = relative('app/assets/images', dirname(resourcePath))
          return isDev
            ? '[path][name].[ext]'
            : `img${nestedPath}/[name].[ext]?[contenthash:7]`
        },
      other: ({ isDev }) => isDev
        ? '[name].[ext]'
        : '[name].[contenthash:7].[ext]',
      wasm: ({ isDev, isModern }) => isDev
        ? `${isModern ? 'modern-' : ''}[name].[ext]`
        : 'wasm/[contenthash:7].[ext]'
    },
    loaders: {
      imgUrl: {
        limit: 0 // Never transform files into data urls
      }
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

  modern: 'client',

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
