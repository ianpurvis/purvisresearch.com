export default ({ GOOGLE_ANALYTICS_ID, NODE_ENV }) => ({

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
          enabled: NODE_ENV === 'development',
          sendHitTask: NODE_ENV === 'production'
        }
      }
    ]
  ]
})
