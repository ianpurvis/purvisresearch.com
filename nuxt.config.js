import 'dotenv/config'
import { defineNuxtConfig } from '@nuxt/bridge'
import deepmerge from 'deepmerge'
import base from './config/base.js'
import googleAnalytics from './config/google-analytics.js'
import sentry from './config/sentry.js'

export default async () => {

  const env = { ...process.env, baseDir: __dirname }

  const factories = [
    base,
    googleAnalytics,
    sentry,
  ]

  let config = {}
  for (let factory of factories) {
    config = deepmerge(config, await factory(env) || {})
  }

  return defineNuxtConfig(config)
}
