import {
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshLambertMaterial,
  PlaneBufferGeometry,
} from 'three'
// import ogImagePath from '~/assets/images/2019/apr.png'
import ThreeDemo from '~/mixins/three-demo.js'
import { Organization } from '~/models/organization.js'
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
      this.loadFlag()
      this.loadCamera()
      this.loadPhysics()
      this.loadLights()
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
      const material = new MeshLambertMaterial({
        color: 0xFF0000,
        side: DoubleSide,
      })
      const mesh = new Mesh(geometry, material)

      this.scene.add(mesh)

      Object.assign(this, { mesh })
    },
    loadLights() {
      const directionalLight = new DirectionalLight()
      directionalLight.position.set(0, 0, 1)
      this.scene.add(directionalLight)
    },
    loadPhysics() {
      const physicsWorker = new FlagPhysicsWorker()
      physicsWorker.onload = this.onload.bind(this)
      physicsWorker.onstep = this.onstep.bind(this)
      physicsWorker.onerror = this.logError.bind(this)
      Object.assign(this, { physicsWorker })

      physicsWorker.load({
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
