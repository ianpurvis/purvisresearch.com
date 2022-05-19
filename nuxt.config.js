import 'dotenv/config'
import { defineNuxtConfig } from '@nuxt/bridge'
import deepmerge from 'deepmerge'
import base from './config/base.js'
import build from './config/build.js'
import googleAnalytics from './config/google-analytics.js'
import router from './config/router.js'
import sentry from './config/sentry.js'
import sitemap from './config/sitemap.js'

export default async () => {

  const env = { ...process.env, baseDir: __dirname }

  const factories = [
    base,
    build,
    router,
    googleAnalytics,
    sentry,
    sitemap,
  ]

  let config = {}
  for (let factory of factories) {
    config = deepmerge(config, await factory(env) || {})
  }

  return defineNuxtConfig(config)
}
