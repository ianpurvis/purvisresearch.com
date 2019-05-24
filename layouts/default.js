import appleTouchIconUrl from '~/assets/favicons/apple-touch-icon.png?as=file'
import browserConfigUrl from '~/assets/browserconfig.xml'
import faviconUrl from '~/assets/favicons/favicon2.ico?as=file'
import manifestUrl from '~/assets/manifest.json'
import maskIconUrl from '~/assets/favicons/safari-pinned-tab.svg?as=file'
import organization from '~/structured_data/organization.js'

export default {
  head() {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIconUrl },
        { rel: 'icon', type: 'image/x-icon', href: faviconUrl },
        { rel: 'manifest',  href: manifestUrl },
        { rel: 'mask-icon', color: '#f5f5f5', href: maskIconUrl },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: organization.description },
        { name: 'msapplication-config', content: browserConfigUrl }
      ],
      title: 'purvis research',
    }
  },
  jsonld() {
    return organization
  },
}
