export default ({ isProduction }) => ({

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
        id: 'UA-106821101-1',
        debug: {
          enabled: !isProduction,
          sendHitTask: isProduction
        }
      }
    ]
  ]
})
