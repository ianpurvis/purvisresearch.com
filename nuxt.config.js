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
      { rel:"apple-touch-icon", sizes:"180x180", href:"/apple-touch-icon.png" },
      { rel:'icon', type:'image/x-icon', href:'/favicon.ico' },
      { rel:"manifest",  href:"/manifest.json" },
      { rel:"mask-icon", href:"/safari-pinned-tab.svg", color:"#f5f5f5" },
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
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      }

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: [
      'pixi.js',
      'pixi-particles'
    ]
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
      return [
        {
          name: 'root',
          path: '/',
          component: resolve(__dirname, 'pages/aug_2018.vue')
        },
        {
          name: 'aug_2018',
          path: '/aug_2018\.html',
          component: resolve(__dirname, 'pages/aug_2018.vue')
        },
        {
          name: 'nov_2017',
          path: '/nov_2017\.html',
          component: resolve(__dirname, 'pages/nov_2017.vue')
        },
        {
          name: 'oct_2017',
          path: '/oct_2017\.html',
          component: resolve(__dirname, 'pages/oct_2017.vue')
        },
        {
          name: 'sept_2017',
          path: '/sept_2017\.html',
          component: resolve(__dirname, 'pages/sept_2017.vue')
        },
        {
          name: '404',
          path: '/404',
          component: resolve(__dirname, 'pages/404.vue')
        }
      ]
    }
  }
}
