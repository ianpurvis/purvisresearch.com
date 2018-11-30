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
      illustration: Random.sample([
        {
          url: require('~/assets/images/2018/nov/neko-bw.png'),
          position: new Vector3(-0.40, 0.1, 0),
        },{
          url: require('~/assets/images/2018/nov/monster-bw.png'),
          position: new Vector3(-0.20, 0.1, 0),
        },{
          url: require('~/assets/images/2018/nov/kontrol-bw.png'),
          position: new Vector3(-0.20, 0.25, 0),
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
      this.videoBox.rotateX(35 * DEGREES_TO_RADIANS)
      this.videoBox.rotateY(45 * DEGREES_TO_RADIANS)
      this.videoBox.position.copy(this.illustration.position)

      this.camera.position.set(0, 0, 3)
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

        let geometry = new PlaneGeometry(1, 0.75, 0)

        this.videoBox = new Mesh(geometry, material)
        this.scene.add(this.videoBox)
      }).then(() =>
        new TextureLoader().load(this.illustration.url)
      ).then(texture =>
        new SpriteMaterial({ map: texture })
      ).then(material =>
        new Sprite(material)
      ).then(sprite => {
        sprite.scale.setScalar(2)
        sprite.material.depthTest = false
        this.graphix = sprite
        this.scene.add(sprite)
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

