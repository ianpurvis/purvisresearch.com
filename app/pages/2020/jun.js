import {
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
} from 'three'
// import ogImagePath from '~/assets/images/2019/apr.png'
import ThreeDemo from '~/mixins/three-demo.js'
import { Organization } from '~/models/organization.js'

export default {
  beforeDestroy() {
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2029/jun.html`
    this.description = ''
    this.jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'purvis research',
        'item': Organization.default.url
      },{
        '@type': 'ListItem',
        'position': 2,
        'name': 'jun 2020',
        'item': this.canonicalUrl
      }]
    }
    this.ogImageUrl = '' //`${Organization.default.url}${ogImagePath}`
    this.title = 'jun 2020 - purvis research'
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: this.ogImageUrl },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Jun 2020' },
        { property:'og:url', content: this.canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: this.canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: this.jsonld }
      ],
    }
  },
  methods: {
    async load() {
      await ThreeDemo.methods.load.call(this)
      this.loadFlag()
      this.loadCamera()
    },
    loadCamera() {
      this.camera.far = 100
      this.camera.position.z = 10
    },
    loadFlag() {
      const geometry = new PlaneBufferGeometry(...Object.values({
        width: 19,
        height: 10,
        widthSegments: 25,
        heightSegments: 13,
      }))
      const material = new MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true,
      })
      const mesh = new Mesh(geometry, material)

      this.scene.add(mesh)

      Object.assign(this, { mesh })
    },
    update() {
      ThreeDemo.methods.update.call(this)
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load().catch(this.logError)
  }
}
