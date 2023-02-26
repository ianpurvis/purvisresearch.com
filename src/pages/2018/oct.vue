<template>
  <main v-once>
    <Graphix :description="description" edition="Oct 2018" ref="graphix"/>
  </main>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ogImagePath from '../../assets/images/2018/oct/screenprinting-a-3d-scan-with-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { ScreenPrintingA3DScan } from '../../scenes/screen-printing-a-3d-scan.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
const canonicalUrl = `${org.url}/2018/oct.html`
const title = 'Oct 2018: Screen Printing a 3D Scan With WebGL | Purvis Research'
const description = 'Screen printing a 3D scan with WebGL.'
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
    'name': 'oct 2018',
    'item': canonicalUrl
  }]
})

export default {
  components: {
    Graphix
  },
  head() {
    return {
      title: title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Oct 2018' },
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
      engine = new ThreeEngine(canvas, { maxFPS: 30 })
      engine.scene = new ScreenPrintingA3DScan()
      await engine.scene.load()
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
  color: #0ff;
}
</style>
