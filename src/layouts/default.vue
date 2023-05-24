<template>
  <nuxt/>
</template>

<script>
import { useHead } from '#imports'
import appleTouchIconUrl from '~/assets/images/logo-128x128.png'
import browserConfigUrl from '~/assets/browserconfig.xml?url'
import favicon16Url from '~/assets/images/logo-bw-16x16.png'
import favicon32Url from '~/assets/images/logo-bw-32x32.png'
import manifestUrl from '~/assets/manifest.json?url'
import maskIconUrl from '~/assets/images/logo-bw-16x16.svg'
import { useDebug } from '~/mixins/debug.js'
import { Organization } from '~/models/organization.js'

const org = Organization.default
export const title = 'Purvis Research'
export const description = org.description
export const jsonld = JSON.stringify(org)
export {
  appleTouchIconUrl,
  browserConfigUrl,
  favicon16Url,
  favicon32Url,
  manifestUrl,
  maskIconUrl
}

export default {
  setup() {
    useHead({
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
        { hid: 'description', name: 'description', content: description },
        { name: 'msapplication-config', content: browserConfigUrl }
      ],
      script: [
        { type: 'application/ld+json', innerHTML: jsonld }
      ],
      title,
    })

    useDebug()
  }
}
</script>
