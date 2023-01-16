import 'dotenv/config'
import { defineNuxtConfig } from 'nuxt/config'
import deepmerge from 'deepmerge'
import base from './config/base.js'
import gtag from './config/gtag.js'
import sitemap from './config/sitemap.js'

export default async () => {

  const env = { ...process.env, baseDir: __dirname }

  const factories = [
    base,
    gtag,
    sitemap,
  ]

  let config = {}
  for (let factory of factories) {
    config = deepmerge(config, await factory(env) || {})
  }

  return defineNuxtConfig(config)
}
