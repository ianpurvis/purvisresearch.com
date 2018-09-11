module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'p u r v i s _ r e s e a r c h',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'P U R V I S _ R E S E A R C H _ O N L I N E' }
    ],
    link: [
      { rel:"apple-touch-icon", sizes:"180x180", href:"/favicons/apple-touch-icon.png" },
      { rel:'icon', type:'image/x-icon', href:'/favicons/favicon2.ico' },
      { rel:"manifest",  href:"/manifest.json" },
      { rel:"mask-icon", href:"/favicons/safari-pinned-tab.svg", color:"#f5f5f5" },
      { rel:"stylesheet", href:"https://fonts.googleapis.com/css?family=Libre+Barcode+128+Text" },
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
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      }

      // Load glb models as arraybuffer
      config.module.rules.push({
        test: /\.glb$/,
        loader: 'arraybuffer-loader',
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
    publicPath: 'http://purvisresearch.com/'
  },

  css: [
    '@/assets/stylesheets/app.scss'
  ],

  generate: {
    subFolders: false
  },

  modules: [
    [ '@nuxtjs/google-analytics', { id: 'UA-106821101-1' } ]
  ],

  router: {
    extendRoutes (routes, resolve) {
      // Return array to replace nuxt generated routes:
      return routes
        .map(route => {
          route.path += '\.html'
          return route
        })
        .concat(
          { path: '/', component: resolve(__dirname, 'pages/2018/sept.vue') },
          { path: '/nov_2017\.html', redirect: '/2017/nov.html' },
          { path: '/oct_2017\.html', redirect: '/2017/oct.html' },
          { path: '/sept_2017\.html', redirect: '/2017/sept.html' },
        )
    }
  }
}
