export default ({ isProduction }) => ({
  modules: [
    [
      '@nuxtjs/sentry',
      {
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
  ]
})
