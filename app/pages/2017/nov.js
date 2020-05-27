import {
  Font,
  LessDepth,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
  TextBufferGeometry,
  Vector3,
} from 'three'
import ogImagePath from '~/assets/images/2017/nov.png'
import Inconsolata from '~/assets/models/Inconsolata_Regular.json'
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
      this.loadGraphics()
      this.loadPhysics()
    },
    loadGraphics() {
      const blastRadius = 60
      const font = new Font(Inconsolata)
      const characters = Array.from('abcdefghijklmnopqrstuvwxyz0123456789')
      const geometries = characters.map(character => new TextBufferGeometry(character, { font }))
      geometries.forEach(geometry => {
        geometry.center()
        geometry.computeBoundingBox()
      })
      const material = new MeshNormalMaterial({
        depthFunc: LessDepth,
        opacity: 0.7,
        transparent: false,
        wireframe: true,
      })
      const meshes = geometries.map(geometry => new Mesh(geometry, material))
      meshes.forEach(mesh => {
        mesh.rotation.set(
          MathUtils.degToRad(MathUtils.randInt(0, 360)),
          MathUtils.degToRad(MathUtils.randInt(0, 360)),
          MathUtils.degToRad(MathUtils.randInt(0, 360)),
        )
        mesh.position.set(
          MathUtils.randInt(-blastRadius, blastRadius),
          MathUtils.randInt(-blastRadius, blastRadius),
          MathUtils.randInt(-blastRadius, blastRadius),
        )
        mesh.scale.setScalar(MathUtils.randFloat(0.25, 1))
        this.scene.add(mesh)
      })

      this.scene.visible = false

      Object.assign(this, { meshes })
    },
    loadPhysics() {
      const size = new Vector3()
      const bodies = this.meshes.map(mesh => {
        mesh.geometry.boundingBox.getSize(size)
        return {
          collisionFilterGroup: 2,
          collisionFilterMask: 1,
          mass: mesh.scale.x,
          position: {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
          },
          quaternion: {
            x: mesh.quaternion.x,
            y: mesh.quaternion.y,
            z: mesh.quaternion.z,
            w: mesh.quaternion.w,
          },
          size
        }
      })
      // size.setScalar(60)
      // const blast = {
      //   collisionFilterGroup: 1,
      //   collisionFilterMask: 2,
      //   mass: 10000,
      //   size
      // }
      // bodies.push(blast)
      this.physicsWorker.load(bodies)
    },
    onstep({ bodies }) {
      for (let i = 0, mesh, body; i < this.meshes.length; i++) {
        mesh = this.meshes[i]
        body = bodies[i]
        mesh.position.copy(body.position)
        mesh.quaternion.copy(body.quaternion)
      }
      this.scene.visible = true
    },
    update() {
      ThreeDemo.methods.update.call(this)
      if (!this.physicsWorker.isReady) return
      this.physicsWorker.step(this.deltaTime * this.speedOfLife)
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.physicsWorker = new ExploderPhysicsWorker()
    this.physicsWorker.onstep = this.onstep.bind(this)
    this.load().then(this.layout).catch(this.logError)
  }
}

