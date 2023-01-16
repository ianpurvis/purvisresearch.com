import { defineNuxtConfig } from '@nuxt/bridge'

export default () => defineNuxtConfig({
  modules: [
    'nuxt-simple-sitemap'
  ],
  sitemap: {
    hostname: 'https://purvisresearch.com',
  }
})
