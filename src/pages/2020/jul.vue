<template>
  <main v-once>
    <Graphix :description="description" edition="Jul 2020" ref="graphix"/>
  </main>
</template>

<script>
import { useHead } from '#imports'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ogImagePath from '../../assets/images/2020/jul/a-banknote-in-simplex-wind.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { BanknoteInSimplexWind } from '../../scenes/banknote-in-simplex-wind.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2020/jul/`
export const title = 'Jul 2020: A Banknote in Simplex Wind | Purvis Research'
export const description = 'A Banknote In Simplex Wind'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const ogTitle = 'Jul 2020'
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
    'name': 'jul 2020',
    'item': canonicalUrl
  }]
})

export default {
  components: {
    Graphix
  },
  setup() {
    useHead({
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: ogImageUrl },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content: ogTitle },
        { property:'og:url', content: canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', textContent: jsonld }
      ],
    })

    const graphix = ref(null)
    let engine

    onMounted(async () => {
      const { value: { $refs: { canvas } } } = graphix
      if (!detectWebGL(canvas)) return
      engine = new ThreeEngine(canvas, { maxFPS: 0 })
      engine.scene = new BanknoteInSimplexWind()
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
$dollar-green-color: #293132;
$dollar-mint-color: #c5cea9;
$hover-color: $dollar-mint-color;
$text-color: $dollar-green-color;

main {
  color: $text-color;
}

:deep(a):not(.inherit-color):not(:hover) {
  color: $hover-color;
}
</style>
