<template>
  <main v-once>
    <Graphix ref="graphix" :description="description" edition="Sep 2017" />
  </main>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ogImagePath from '~/assets/images/2017/sept/an-emoji-particle-flow-in-webgl.png'
import Graphix from '~/components/graphix.vue'
import { Organization } from '~/models/organization.js'
import { detectWebGL } from '~/models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2017/sept.html`
export const title = 'Sep 2017: An Emoji Particle Flow in WebGL | Purvis Research'
export const description = 'An emoji particle flow in WebGL.'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const jsonld = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [{
    '@type': 'ListItem',
    'position': 1,
    'name': 'purvis research',
    'item': org.url
  },{
    '@type': 'ListItem',
    'position': 2,
    'name': 'sept 2017',
    'item': canonicalUrl
  }]
})

export default {
  components: {
    Graphix
  },
  head() {
    return {
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: ogImageUrl },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Sept 2017' },
        { property:'og:url', content: canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: jsonld }
      ],
    }
  },
  setup() {
    const graphix = ref(null)
    let engine

    onMounted(async () => {
      const { value: { $refs: { canvas } } } = graphix
      if (!detectWebGL(canvas)) return
      const { PixiEngine } = await import('../../engines/pixi-engine.js')
      const { EmojiParticleFlowScene } = await import('../../scenes/emoji-particle-flow.js')
      engine = new PixiEngine(canvas, { maxFPS: 30 })
      const { clientHeight, clientWidth } = canvas
      engine.scene = new EmojiParticleFlowScene(clientWidth, clientHeight)
      await engine.play()
    })

    onBeforeUnmount(() => {
      if (engine) engine.dispose()
    })

    return { description, graphix }
  }
}
</script>
