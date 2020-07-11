export default ({ GOOGLE_ANALYTICS_ID, NODE_ENV }) => {

  const disabled = (NODE_ENV !== 'production')

  return {
    head: disabled ? {} : {
      link: [{
        href: 'https://www.google-analytics.com',
        rel: 'preconnect'
      }]
    },
    modules: [
      [
        '@nuxtjs/google-analytics',
        {
          disabled,
          id: GOOGLE_ANALYTICS_ID
        }
      ]
    ]
  }
}
