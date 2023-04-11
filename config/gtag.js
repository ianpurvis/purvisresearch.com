export default ({ GOOGLE_ANALYTICS_ID }) => ({
  gtag: {
    id: GOOGLE_ANALYTICS_ID
  },
  modules: [ 'nuxt-gtag' ]
})
