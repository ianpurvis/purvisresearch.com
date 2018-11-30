import {
  PlaneGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  ShaderChunk,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  UniformsLib,
  UniformsUtils,
  Vector3,
  VideoTexture,
  OrthographicCamera,
  RepeatWrapping,
} from 'three'
import { DEGREES_TO_RADIANS } from '~/assets/javascripts/constants.js'
import halftone_shader from '~/assets/shaders/halftone_test.glsl'
import Random from '~/assets/javascripts/random.js'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'

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
          url: require('~/assets/images/2018/nov/neko-bw.png'),
          position: new Vector3(0.55, 1, 1.14),
          geometry: new PlaneGeometry(1.10, 0.88),
        },{
          url: require('~/assets/images/2018/nov/monster-bw.png'),
          position: new Vector3(0.70, 1.01, 1.05),
          geometry: new PlaneGeometry(1.10, 0.90),
        },{
          url: require('~/assets/images/2018/nov/kontrol-bw.png'),
          position: new Vector3(0.68, 1.16, 1.05),
          geometry: new PlaneGeometry(1.22, 0.92),
        }
      ]),
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
      return navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.$refs.video.srcObject = stream

        let texture = new VideoTexture(this.$refs.video)
        texture.minFilter = LinearFilter
        texture.magFilter = LinearFilter

        let material = new ShaderMaterial({
          defines: {
            USE_MAP: true,
          },
          extensions: {
            derivatives: true,
          },
          uniforms: UniformsUtils.merge([
            UniformsLib.common,
          ]),
          fragmentShader: halftone_shader,
          vertexShader: ShaderChunk.meshbasic_vert,
        })
        material.uniforms.map.value = texture

        this.videoBox = new Mesh(this.illustration.geometry, material)
        this.scene.add(this.videoBox)
      }).then(() =>
        new TextureLoader().load(this.illustration.url)
      ).then(texture => {
        let material = new SpriteMaterial({ map: texture })
        this.sprite = new Sprite(material)
        this.sprite.material.depthTest = false
        this.sprite.scale.setScalar(2)
        this.scene.add(this.sprite)
      }).then(() =>
        new TextureLoader().load(require('~/assets/images/2018/nov/tatami-bw.png'))
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
      })
    },
    update() {
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load().then(this.layout)
  }
}

