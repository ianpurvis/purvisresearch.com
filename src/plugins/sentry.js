import { init } from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app/nuxt'

export default defineNuxtPlugin(({ vueApp }) => {

  const {
    public: {
      SENTRY_DSN
    }
  } = useRuntimeConfig()

  init({
    app: vueApp,
    dsn: SENTRY_DSN
  })
})
