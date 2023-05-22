<template>
  <main v-once>
    <Graphix :description="description" edition="Apr 2019" ref="graphix"/>
    <video ref="video" autoplay muted playsinline></video>
  </main>
</template>

<script>
import { useHead } from '#imports'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { SurrealTVScene } from '../../scenes/surreal-tv.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2019/apr/`
export const title = 'Apr 2019: Surreal Television With WebRTC and WebGL | Purvis Research'
export const description = 'Surreal television with WebRTC and WebGL.'
export const ogImageUrl = `${org.url}/_/surreal-television-with-webrtc-and-webgl.97139405.png`
export const ogTitle = 'Apr 2019'
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
    'name': 'apr 2019',
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
        { type: 'application/ld+json', innerHTML: jsonld }
      ],
    })

    const video = ref(null)

    onMounted(async () => {
      const constraints = {
        audio: false,
        video: {
          aspect: 2,
          frameRate: 20,
          height: 64,
          resizeMode: 'crop-and-scale',
          width: 128
        }
      }
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia(constraints)
        if (video.value) {
          video.value.srcObject = stream
        } else {
          stream.getTracks().forEach(track => track.stop())
        }
      } catch (error) {
        console.warn(`Could not acquire device camera (${error.message})`)
      }
    })

    onBeforeUnmount(() => {
      const stream = video.value.srcObject
      if (!stream) return
      stream.getTracks().forEach(track => track.stop())
    })

    const graphix = ref(null)
    let engine

    onMounted(async () => {
      const { value: { $refs: { canvas } } } = graphix
      if (!detectWebGL(canvas)) return
      engine = new ThreeEngine(canvas, { maxFPS: 30 })
      engine.scene = new SurrealTVScene(video.value)
      const playPromise = engine.play()
      await engine.scene.load()
      while (!engine.paused) {
        await engine.scene.run()
      }
      await playPromise
    })

    onBeforeUnmount(() => {
      if (engine) engine.dispose()
    })

    return { description, graphix, video }
  }
}
</script>

<style lang="scss" scoped>
main {
  color: #fff;
}

:deep(a) {
  &:hover {
    color: #d3d3d3;
  }

  &:not(:hover) {
    color: #fff;
  }
}

video {
  background-color: #000;
  height: 16px;
  opacity: 0;
  position: absolute;
  width: 32px;
}
</style>
