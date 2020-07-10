import 'dotenv/config'
import base from './config/base.js'
import build from './config/build.js'
import googleAnalytics from './config/google-analytics.js'
import router from './config/router.js'
import sentry from './config/sentry.js'
import sitemap from './config/sitemap.js'

export default async () => {

  const env = {
    ...process.env,
    isProduction: (process.env.NODE_ENV === 'production')
  }

  const config = {}

  const adapters = [
    base,
    build,
    router,
    googleAnalytics,
    sentry,
    sitemap,
  ]

  for (let adapter of adapters) await adapter(config, env)

  return config
}
