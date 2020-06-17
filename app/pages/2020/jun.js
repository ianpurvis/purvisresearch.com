import {
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
} from 'three'
// import ogImagePath from '~/assets/images/2019/apr.png'
import billImagePath from '~/assets/images/tubman-twenty.jpg'
import ThreeDemo from '~/mixins/three-demo.js'
import { Organization } from '~/models/organization.js'
import { TextureLoader } from '~/models/texture-loader.js'
import { FlagPhysicsWorker } from '~/workers/flag-physics-worker.js'

export default {
  beforeDestroy() {
    this.physicsWorker.terminate()
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
    ...ThreeDemo.methods,
    async load() {
      await ThreeDemo.methods.load.call(this)
      await this.loadBill()
      this.loadCamera()
      this.loadPhysics()
    },
    loadCamera() {
      this.camera.far = 100
      this.camera.position.z = 10
    },
    async loadBill() {
      const textureLoader = new TextureLoader()
      const billTexture = await textureLoader.load(billImagePath)
      const material = new MeshBasicMaterial({
        map: billTexture,
        side: DoubleSide,
      })
      const geometry = new PlaneBufferGeometry(...Object.values({
        width: 15.61, // 156.1mm / 1000 mm per m * 100 scale
        height: 6.63, // 66.3mm / 1000 mm per m * 100 scale
        widthSegments: 15,
        heightSegments: 6,
      }))
      const mesh = new Mesh(geometry, material)

      this.scene.add(mesh)

      Object.assign(this, { mesh })
    },
    loadPhysics() {
      const physicsWorker = new FlagPhysicsWorker()
      physicsWorker.onload = this.onload.bind(this)
      physicsWorker.onstep = this.onstep.bind(this)
      physicsWorker.onerror = this.logError.bind(this)
      Object.assign(this, { physicsWorker })

      physicsWorker.load({
        mass: 0.1, // 1g / 1000 g per kg * 100 scale
        vertices: this.mesh.geometry.attributes.position.array,
        triangles: this.mesh.geometry.index.array
      })
    },
    onload({ vertices, triangles }) {
      this.mesh.geometry.index.array = triangles
      this.mesh.geometry.attributes.position.array = vertices
      // Optimize usage for stepped drawing:
      this.mesh.geometry.attributes.position.usage = DynamicDrawUsage
      this.mesh.geometry.attributes.normal.usage = DynamicDrawUsage
      this.mesh.geometry.attributes.position.needsUpdate = true
      window.requestAnimationFrame(this.update)
    },
    onstep({ vertices, normals }) {
      this.mesh.geometry.attributes.position.array = vertices
      this.mesh.geometry.attributes.position.needsUpdate = true
      this.mesh.geometry.attributes.normal.array = normals
      this.mesh.geometry.attributes.normal.needsUpdate = true
      window.requestAnimationFrame(this.update)
    },
    startAnimating() {
      this.clock.start()
    },
    update() {
      this.deltaTime = this.clock.getDelta() * this.speedOfLife
      this.elapsedTime += this.deltaTime
      this.render()
      this.physicsWorker.step({
        deltaTime: this.deltaTime,
        vertices: this.mesh.geometry.attributes.position.array,
        normals: this.mesh.geometry.attributes.normal.array,
      })
    },
  },
  mixins: [
    ThreeDemo
  ],
  mounted() {
    this.load().catch(this.logError)
  }
}
