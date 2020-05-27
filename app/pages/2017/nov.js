import {
  BufferAttribute,
  BufferGeometry,
  LessDepth,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
} from 'three'
import ogImagePath from '~/assets/images/2017/nov.png'
import ThreeDemo from '~/mixins/three-demo.js'
import { Organization } from '~/models/organization.js'
import { ExploderPhysicsWorker } from '~/workers/exploder-physics-worker.js'

export default {
  beforeDestroy() {
    this.physicsWorker.terminate()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2017/nov.html`
    this.description = 'A 3d character exploder in WebGL.'
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
        'name': 'nov 2017',
        'item': this.canonicalUrl
      }]
    },
    this.particles = []
    this.speedOfLife = 0.4 // Slow motion
    this.title = 'nov 2017 - purvis research'
  },
  head () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Nov 2017' },
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
    layout() {
      this.camera.far = 10000
      this.camera.position.z = MathUtils.randInt(100, 150)
      this.camera.updateProjectionMatrix()
    },
    async load() {
      await ThreeDemo.methods.load.call(this)
      this.physicsWorker.load()
    },
    onload({ positions, normals }) {
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
      geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3))
      const material = new MeshNormalMaterial({
        depthFunc: LessDepth,
        flatShading: true,
        opacity: 0.7,
        transparent: false,
        wireframe: true,
      })
      const mesh = new Mesh(geometry, material)

      this.scene.add(mesh)

      Object.assign(this, { mesh, positions, normals })
    },
    onstep({ positions, normals }) {
      this.mesh.geometry.attributes.position.set(positions)
      this.mesh.geometry.attributes.position.needsUpdate = true
      this.mesh.geometry.attributes.normal.set(normals)
      this.mesh.geometry.attributes.normal.needsUpdate = true
      this.scene.visible = true

      Object.assign(this, { positions, normals })
    },
    update() {
      ThreeDemo.methods.update.call(this)
      if (!this.physicsWorker.isReady) return
      this.physicsWorker.step(
        this.deltaTime * this.speedOfLife,
        this.positions,
        this.normals
      )
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.physicsWorker = new ExploderPhysicsWorker()
    this.physicsWorker.onstep = this.onstep.bind(this)
    this.physicsWorker.onload = this.onload.bind(this)
    this.load().then(this.layout).catch(this.logError)
  }
}

