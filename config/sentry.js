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
        },
        disableServerSide: true,
        initialize: NODE_ENV === 'production',
      }
    ]
  ]
})
