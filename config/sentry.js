export default (config, { isProduction }) => {

  const sentry = [
    '@nuxtjs/sentry', {
      clientIntegrations: {
        Dedupe: {},
        ExtraErrorData: {},
        ReportingObserver: {},
        RewriteFrames: {},
        Vue: {
          attachProps: true,
          logErrors: true
        }
      },
      disableServerSide: true,
      initialize: isProduction,
    }
  ]

  config.modules = [ ...config.modules || [], sentry ]
}
