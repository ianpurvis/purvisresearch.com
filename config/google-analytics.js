export default (config, { isProduction }) => {

  config.head = {
    link: [
      { rel: 'preconnect', href: 'https://www.google-analytics.com' }
    ]
  }

  const googleAnalytics = [
    '@nuxtjs/google-analytics', {
      id: 'UA-106821101-1',
      debug: {
        enabled: !isProduction,
        sendHitTask: isProduction
      }
    }
  ]

  config.modules = [ ...config.modules || [], googleAnalytics ]
}
