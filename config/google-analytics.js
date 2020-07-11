export default ({ isProduction, GOOGLE_ANALYTICS_ID }) => ({

  head: {
    link: [{
      href: 'https://www.google-analytics.com',
      rel: 'preconnect'
    }]
  },

  modules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: GOOGLE_ANALYTICS_ID,
        debug: {
          enabled: !isProduction,
          sendHitTask: isProduction
        }
      }
    ]
  ]
})
