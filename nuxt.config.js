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
                    name: rule.use[0].options.name
                  }
                },
                rule.use[0]
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
      'nuxt-jsonld',
      'vue-analytics',
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
    hostname: 'https://purvisresearch.com',
    routes: [{
      url: '/',
      changefreq: 'monthly',
      priority: 1
    }]
  }
}
