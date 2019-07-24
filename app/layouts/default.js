import appleTouchIconUrl from '~/assets/images/logo-128x128.png?as=file'
import browserConfigUrl from '~/assets/browserconfig.xml'
import favicon16Url from '~/assets/images/logo-bw-16x16.png?as=file'
import favicon32Url from '~/assets/images/logo-bw-32x32.png?as=file'
import manifestUrl from '~/assets/manifest.json'
import maskIconUrl from '~/assets/images/logo-bw-16x16.svg?as=file'
import Debug from '~/mixins/debug.js'
import organization from '~/structured_data/organization.js'

export default {
  head() {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'apple-touch-icon', href: appleTouchIconUrl },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32Url },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16Url },
        { rel: 'manifest',  href: manifestUrl },
        { rel: 'mask-icon', color: '#363636', href: maskIconUrl },
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
  mixins: [
    Debug
  ],
}
