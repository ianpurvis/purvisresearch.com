import {
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
} from 'three'
import ogImagePath from '~/assets/images/2020/jul.png'
import billImagePath from '~/assets/images/2020/jul/tubman-twenty.jpg'
import ThreeDemo from '~/mixins/three-demo.js'
import { ChaseCameraRig } from '~/models/chase-camera-rig.js'
import { Organization } from '~/models/organization.js'
import { Oscillator } from '~/models/oscillator.js'
import { TextureLoader } from '~/models/texture-loader.js'
import { DollarPhysicsWorker } from '~/workers/dollar-physics-worker.js'

export default {
  beforeDestroy() {
    this.physicsWorker.terminate()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2020/jul.html`
    this.description = 'A Banknote In Simplex Wind'
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
        'name': 'jul 2020',
        'item': this.canonicalUrl
      }]
    }
    this.ogImageUrl = `${Organization.default.url}${ogImagePath}`
    this.title = 'jul 2020 - purvis research'
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
        { property:'og:title', content:'Jul 2020' },
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
      this.camera.far = 1000

      const cameraRig = new ChaseCameraRig(this.camera, this.mesh)
      cameraRig.position.z = cameraRig.offset.z = 12
      this.scene.add(cameraRig)

      const chaseOscillator = new Oscillator({
        period: 20, // seconds
        amplitude: 0.1,
        yshift: 0.65,
      })

      Object.assign(this, { cameraRig, chaseOscillator })
    },
    async loadBill() {
      const geometry = new PlaneBufferGeometry(
        15.61,  // width = 156.1mm / 1000 mm per m * 100 scale
        6.63,   // height = 66.3mm / 1000 mm per m * 100 scale
        15,     // widthSegments
        6,      // heightSegments
      )
      geometry.deleteAttribute('normal')
      const textureLoader = new TextureLoader()
      const billTexture = await textureLoader.load(billImagePath)
      billTexture.repeat.y = 0.806640625 // 826px / 1024px padded height
      const material = new MeshBasicMaterial({
        map: billTexture,
        side: DoubleSide,
      })
      const mesh = new Mesh(geometry, material)
      mesh.frustumCulled = false

      this.scene.add(mesh)

      Object.assign(this, { mesh })
    },
    loadPhysics() {
      const physicsWorker = new DollarPhysicsWorker()
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
      this.mesh.geometry.attributes.position.needsUpdate = true
      window.requestAnimationFrame(this.update)
    },
    onstep({ vertices }) {
      this.mesh.geometry.attributes.position.array = vertices
      this.mesh.geometry.attributes.position.needsUpdate = true
      window.requestAnimationFrame(this.update)
    },
    startAnimating() {
      this.clock.start()
    },
    update() {
      this.deltaTime = this.clock.getDelta() * this.speedOfLife
      this.elapsedTime += this.deltaTime

      this.cameraRig.smoothing = this.chaseOscillator.cos(this.elapsedTime)
      this.cameraRig.update(this.deltaTime)

      this.render()

      this.physicsWorker.step({
        deltaTime: this.deltaTime,
        vertices: this.mesh.geometry.attributes.position.array,
      })
    },
  },
  mixins: [
    ThreeDemo
  ],
  async mounted() {
    await this.load().catch(this.logError)
  }
}
