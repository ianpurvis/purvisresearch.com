<template>
  <main v-once>
    <Graphix :description="description" edition="Nov 2017" ref="graphix"/>
  </main>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ogImagePath from '~/assets/images/2017/nov/a-3d-character-exploder-in-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '~/models/organization.js'
import { CharacterExploderScene } from '../../scenes/character-exploder.js'
import { detectWebGL } from '~/models/webgl.js'

const org = Organization.default
const canonicalUrl = `${org.url}/2017/nov.html`
const title = 'Nov 2017: A 3D Character Exploder in WebGL | Purvis Research'
const description = 'A 3d character exploder in WebGL.'
const jsonld = JSON.stringify({
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
    'name': 'nov 2017',
    'item': canonicalUrl
  }]
})

export default {
  components: {
    Graphix
  },
  head () {
    return {
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Nov 2017' },
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
      const engine = new ThreeEngine(canvas, { maxFPS: 30 })
      engine.scene = new CharacterExploderScene()
      await engine.play()
    })

    onBeforeUnmount(() => {
      if (engine) engine.dispose()
    })

    return { description, graphix }
  }
}
</script>

<style lang="scss" scoped>
:deep(a):not(.inherit-color):not(:hover) {
  color: #0efab6;
}
</style>
