import {
  BoxGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  VideoTexture,
} from 'three'
import { DEGREES_TO_RADIANS } from '~/assets/javascripts/constants.js'
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
      this.videoBox.position.x = -1
      this.videoBox.rotateX(15 * DEGREES_TO_RADIANS)
      this.videoBox.rotateY(45 * DEGREES_TO_RADIANS)

      this.graphix.position.x = 1

      this.camera.position.set(0, 0, 5)
    },
    load() {
      return navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.$refs.video.srcObject = stream

        let texture = new VideoTexture(this.$refs.video)
        texture.minFilter = LinearFilter
        texture.magFilter = LinearFilter

        let material = new MeshBasicMaterial({
          map: texture
        })

        let geometry = new BoxGeometry(1,1,1)

        this.videoBox = new Mesh(geometry, material)
        this.scene.add(this.videoBox)
      }).then(() =>
        new TextureLoader().load(require('~/assets/images/2018/hankiti.png'))
      ).then(texture =>
        new SpriteMaterial({ map: texture })
      ).then(material =>
        new Sprite(material)
      ).then(sprite => {
        sprite.scale.setScalar(2)
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

