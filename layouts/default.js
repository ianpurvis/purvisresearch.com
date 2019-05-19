import organization from '~/structured_data/organization.js'

export default {
  head() {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon2.ico' },
        { rel: 'manifest',  href: '/manifest.json' },
        { rel: 'mask-icon', color: '#f5f5f5', href: '/favicons/safari-pinned-tab.svg' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: organization.description }
      ],
      title: 'purvis research',
    }
  },
  jsonld() {
    return organization
  },
}
