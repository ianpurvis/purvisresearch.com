import {
  AmbientLight,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  SpotLight,
  Sprite,
  SpriteMaterial,
  Vector3,
  VideoTexture,
} from 'three'
import { easeBackInOut } from 'd3-ease'
import { DEGREES_TO_RADIANS } from '~/assets/javascripts/constants.js'
import HalftoneMaterial from '~/assets/javascripts/halftone_material.js'
import { delay } from '~/assets/javascripts/promise_delay.js'
import TextureLoader from '~/assets/javascripts/texture_loader.js'
import * as Random from '~/assets/javascripts/random.js'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'
import tatami from '~/assets/images/2019/jan/tatami-bw.png'
import neko from '~/assets/images/2019/jan/neko-bw.png'
import monster from '~/assets/images/2019/jan/monster-bw.png'
import logo from '~/assets/images/2019/jan/logo-bw.png'
const lerp = (a, b, f) => (a * (1.0 - f)) + (b * f)

export default {
  beforeDestroy() {
    this.stopVideo()
  },
  components: {
    ObfuscatedMailto
  },
  data() {
    return {
      animations: [],
      camera: new OrthographicCamera(),
      illustration: Random.sample([
        {
          url: neko,
          position: new Vector3(0.55, 1.00, 1.14),
          geometry: new PlaneGeometry(1.10, 0.90),
        },{
          url: monster,
          position: new Vector3(0.70, 1.01, 1.05),
          geometry: new PlaneGeometry(1.10, 0.92),
        }
      ]),
      textureLoader: new TextureLoader(),
      title: "jan 2019 - purvis research"
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"Screen printing a 3D scan with WebGL" },
        //{ property:"og:image", content: require("~/assets/images/2019/jan.png") },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Jan 2019" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    layout() {
      this.floor.position.set(0.11, 0, 0)

      this.logo.position.set(-3.0, 0, -1.0)

      this.videoBox.rotateY(90 * DEGREES_TO_RADIANS)
      this.videoBox.position.copy(this.illustration.position)

      this.spotLight.position.copy(this.videoBox.position)
      this.spotLight.target.position.set(3, 0, 0.95)

      this.ceilingLight.position.set(0, 3, 0)

      this.camera.position.setScalar(3)
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
        this.sprite.geometry.computeBoundingBox()
        this.scene.add(this.sprite)
      }).then(() =>
        this.textureLoader.load(tatami)
      ).then(texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(9, 9)
        let material = new MeshPhongMaterial({
          //color: 0xFBCEB1,
          map: texture,
        })
        let geometry = new PlaneGeometry(9, 9)
        geometry.rotateX(-90 * DEGREES_TO_RADIANS)
        this.floor = new Mesh(geometry, material)
        this.scene.add(this.floor)
      }).then(() =>
        this.textureLoader.load(logo)
      ).then(texture => {
        let material = new MeshBasicMaterial({
          map: texture,
        })
        let geometry = new PlaneGeometry(0.30, 0.30 * 1.39)
        geometry.rotateX(-90 * DEGREES_TO_RADIANS)
        this.logo = new Mesh(geometry, material)
        this.scene.add(this.logo)
      }).then(() => {
        let texture = new VideoTexture(this.$refs.video)
        let material = new HalftoneMaterial({
          map: texture
        })
        this.videoBox = new Mesh(this.illustration.geometry, material)
        this.scene.add(this.videoBox)

        this.ambientLight = new AmbientLight(...Object.values({
          color: 0xFBCEB1,
          intensity: 1.0,
        }))
        this.scene.add(this.ambientLight)

        this.ceilingLight = new SpotLight(...Object.values({
          color: 0xFBCEB1,
          intensity: 0.0,
          distance: 4.0,
          angle: 0.5 * Math.PI/2,
          penumbra: 1.0,
          decay: 1.0,
        }))
        this.scene.add(this.ceilingLight)

        this.spotLight = new SpotLight(...Object.values({
          color: 0xFBCEB1,
          intensity: 0.0,
          distance: 2.5,
          angle: 0.5 * Math.PI/2,
          penumbra: 1.0,
          decay: 1.0,
        }))
        this.scene.add(this.spotLight)

        this.spotLight.target = new Object3D()
        this.scene.add(this.spotLight.target)
      })
    },
    startVideo() {
      return navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        if (this._isDestroyed || this._isBeingDestroyed) return
        this.$refs.video.srcObject = stream
      }).catch(error => {
        if (error.name != 'NotAllowedError') throw error
      })
    },
    stopVideo() {
      let stream = this.$refs.video.srcObject
      if (!stream) return
      stream.getTracks().forEach(track => track.stop())
    },
    transitionIntensity(light, value) {
      return new Promise((resolve, reject) => {
        let intensity = light.intensity
        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: 5,
          tick: (t, duration) => {
            light.intensity = lerp(intensity, value, easeBackInOut(t/duration))
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    transitionToNight() {
      return Promise.all([
        this.transitionIntensity(this.ambientLight, 0.0),
        this.transitionIntensity(this.ceilingLight, 1.0),
        this.transitionIntensity(this.spotLight, 2.0),
      ])
    },
    transitionToDay() {
      return Promise.all([
        this.transitionIntensity(this.ambientLight, 1.0),
        this.transitionIntensity(this.ceilingLight, 0.0),
        this.transitionIntensity(this.spotLight, 0.0),
      ])
    },
    update() {
      if (!this.sprite) return

      let {aspect} = this.frame()
      let targetSize = new Vector3()
      this.sprite.geometry.boundingBox.getSize(targetSize)
      targetSize.multiplyScalar(2.25) // Add some margin

      Object.assign(this.camera, {
        left: targetSize.x * aspect / -2,
        right: targetSize.x * aspect / 2,
        top: targetSize.y / 2,
        bottom: targetSize.y / -2,
        near: 0,
        far: 1000
      })
      this.camera.updateProjectionMatrix()

      // Update animations
      let globalElapsedTime = this.clock.getElapsedTime()
      this.animations.forEach((animation, index) => {
        let {startTime, duration, tick, resolve, reject} = animation
        let elapsedTime = globalElapsedTime - startTime
        if (elapsedTime <= duration) {
          try {
            tick(elapsedTime, duration)
          } catch (error) {
            this.animations.splice(index, 1)
            if (reject) reject(error)
          }
        } else {
          this.animations.splice(index, 1)
          if (resolve) resolve()
        }
      })
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load()
      .then(this.layout)
      .then(this.startVideo)
      .then(async () => {
        while (this.clock.running) {
          await delay(6.0)
          await this.transitionToNight()
          await delay(6.0)
          await this.transitionToDay()
        }
      })
  }
}
