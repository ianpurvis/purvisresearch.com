export default ({ NODE_ENV }) => ({
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
        initialize: NODE_ENV === 'production',
      }
    ]
  ]
})
