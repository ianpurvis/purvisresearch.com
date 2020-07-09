import 'dotenv/config'
import build from './config/build.js'
import router from './config/router.js'
import sitemap from './config/sitemap.js'

export default async () => {

  const isProduction = (process.env.NODE_ENV === 'production')

  return {
    build,

    css: [
      '~/assets/stylesheets/app.scss'
    ],

    generate: {
      dir: 'dist/app',
      subFolders: false
    },

    head: {
      link: [
        { rel: 'preconnect', href: 'https://www.google-analytics.com' }
      ]
    },

    loading: {
      color: '#3B8070'
    },

    modern: 'client',

    modules: [
      '@nuxtjs/google-analytics',
      '@nuxtjs/sentry',
      '@nuxtjs/sitemap'
    ],

    router,

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

    sitemap
  }
}
