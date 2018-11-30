import {
  PlaneGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
  VideoTexture,
  OrthographicCamera,
  RepeatWrapping,
} from 'three'
import { DEGREES_TO_RADIANS } from '~/assets/javascripts/constants.js'
import HalftoneMaterial from '~/assets/javascripts/halftone_material.js'
import TextureLoader from '~/assets/javascripts/texture_loader.js'
import Random from '~/assets/javascripts/random.js'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'
import tatami from '~/assets/images/2018/nov/tatami-bw.png'
import kontrol from '~/assets/images/2018/nov/kontrol-bw.png'
import neko from '~/assets/images/2018/nov/neko-bw.png'
import monster from '~/assets/images/2018/nov/monster-bw.png'

export default {
  beforeDestroy() {
  },
  components: {
    ObfuscatedMailto
  },
  data() {
    return {
      camera: new OrthographicCamera(...Object.values({
        left: -2,
        right: 2,
        top: 2,
        bottom: -2,
        near: 0,
        far: 1000
      })),
      illustration: Random.sample([
        {
          url: neko,
          position: new Vector3(0.55, 1, 1.14),
          geometry: new PlaneGeometry(1.10, 0.88),
        },{
          url: monster,
          position: new Vector3(0.70, 1.01, 1.05),
          geometry: new PlaneGeometry(1.10, 0.90),
        },{
          url: kontrol,
          position: new Vector3(0.68, 1.16, 1.05),
          geometry: new PlaneGeometry(1.22, 0.92),
        }
      ]),
      textureLoader: new TextureLoader(),
      title: "nov 2018 - purvis research"
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"Screen printing a 3D scan with WebGL" },
        //{ property:"og:image", content: require("~/assets/images/2018/nov.png") },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Nov 2018" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    layout() {
      this.videoBox.rotateY(90 * DEGREES_TO_RADIANS)
      this.videoBox.position.copy(this.illustration.position)

      this.floor.rotateX(-90 * DEGREES_TO_RADIANS)
      this.floor.position.set(0.11, 0, 0)

      this.camera.position.setScalar(2)
      this.camera.lookAt(this.scene.position)
    },
    load() {
      return Promise.resolve(
        this.textureLoader.load(this.illustration.url)
      ).then(texture => {
        let material = new SpriteMaterial({ map: texture })
        this.sprite = new Sprite(material)
        this.sprite.material.depthTest = false
        this.sprite.scale.setScalar(2)
        this.scene.add(this.sprite)
      }).then(() =>
        this.textureLoader.load(tatami)
      ).then(texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(9, 9)
        let material = new MeshBasicMaterial({
          map: texture,
        })
        let geometry = new PlaneGeometry(9, 9)
        this.floor = new Mesh(geometry, material)
        this.scene.add(this.floor)
      }).then(() => {
        let texture = new VideoTexture(this.$refs.video)
        texture.minFilter = LinearFilter
        texture.magFilter = LinearFilter
        let material = new HalftoneMaterial({
          map: texture
        })
        this.videoBox = new Mesh(this.illustration.geometry, material)
        this.scene.add(this.videoBox)
      })
    },
    update() {
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load()
      .then(this.layout)
      .then(() =>
        navigator.mediaDevices.getUserMedia({
          video: true
        })
      ).then(stream => {
        this.$refs.video.srcObject = stream
      })
  }
}

