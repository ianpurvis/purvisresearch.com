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
import {
  easeBackInOut,
  easeCubicInOut,
  easeExpIn,
} from 'd3-ease'
import { DEGREES_TO_RADIANS } from '~/assets/javascripts/constants.js'
import HalftoneMaterial from '~/assets/javascripts/halftone_material.js'
import { lerp } from '~/assets/javascripts/math.js'
import { delay } from '~/assets/javascripts/promise_delay.js'
import { sample } from '~/assets/javascripts/random.js'
import TextureLoader from '~/assets/javascripts/texture_loader.js'
import * as Random from '~/assets/javascripts/random.js'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'
import tatami from '~/assets/images/2019/jan/tatami-bw.png'
import neko from '~/assets/images/2019/jan/neko-bw.png'
import monster from '~/assets/images/2019/jan/monster-bw.png'
import logo from '~/assets/images/2019/jan/logo-bw.png'

const Videos = [
  'anmitsu.mp4',
  'awaodori.mp4',
  'ayu.mp4',
  'dude.mp4',
  'dynamic.mp4',
  'maruko.mp4',
  'mochitsuki.mp4',
  'rope.mp4',
  'suica.mp4',
  'sumo.mp4',
  'tteokbokki.mp4',
].map(file => require(`~/assets/videos/2019/jan/${file}`))

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
      title: "jan 2019 - purvis research",
      video_url: Random.sample(Videos),
    }
  },
  watch: {
    video_url: function(newValue, oldValue) {
      if (newValue == null) {
        this.startVideo()
      }
      else if (oldValue == null) {
        this.stopVideo()
      }
      // Wait a tick for the video element to be regenerated,
      // then point the video texture at it.
      this.$nextTick().then(() => {
        this.nekoTV.screen.material.map.image = this.$refs.video
      })
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
    changeChannel() {
      this.video_url = Random.sample([null].concat(Videos))
    },
    load() {
      this.loadCamera()
      this.loadAmbientLight()
      return this.loadFloor()
        .then(this.loadLogo)
        .then(this.loadNekoTV)
        .then(this.loadMonsterTV)
        .then(this.loadNightLights)
    },
    loadCamera() {
      this.camera.position.setScalar(3)
      this.camera.lookAt(this.scene.position)
      this.track()
    },
    loadFloor() {
      return Promise.resolve(
        new TextureLoader().load(tatami)
      ).then(texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(9, 9)
        let material = new MeshPhongMaterial({
          map: texture,
          opacity: 0.0,
        })
        let geometry = new PlaneGeometry(9, 9)
        geometry.rotateX(-90 * DEGREES_TO_RADIANS)
        this.floor = new Mesh(geometry, material)
        this.scene.add(this.floor)
        this.floor.position.set(0.11, 0, 0)
        return this.transitionOpacity(this.floor, 1.0)
      })
    },
    loadLogo() {
      return Promise.resolve(
        new TextureLoader().load(logo)
      ).then(texture => {
        let material = new MeshBasicMaterial({
          map: texture,
        })
        let geometry = new PlaneGeometry(0.30, 0.30 * 1.39)
        geometry.rotateX(-90 * DEGREES_TO_RADIANS)
        this.logo = new Mesh(geometry, material)
        this.scene.add(this.logo)
        this.logo.position.set(-3.0, 0, -1.0)
      })
    },
    loadAmbientLight() {
      this.ambientLight = new AmbientLight(...Object.values({
        color: 0xFBCEB1,
        intensity: 1.0,
      }))
      this.scene.add(this.ambientLight)
    },
    loadNightLights() {
      this.ceilingLight = new SpotLight(...Object.values({
        color: 0xFBCEB1,
        intensity: 0.0,
        distance: 4.0,
        angle: 0.5 * Math.PI/2,
        penumbra: 1.0,
        decay: 1.0,
      }))
      this.scene.add(this.ceilingLight)
      this.ceilingLight.position.set(0, 3, 0)

      this.spotLight = new SpotLight(...Object.values({
        color: 0xFBCEB1,
        intensity: 0.0,
        distance: 2.5,
        angle: 0.5 * Math.PI/2,
        penumbra: 1.0,
        decay: 1.0,
      }))
      this.scene.add(this.spotLight)
      this.spotLight.position.copy(this.nekoTV.screen.position)

      this.spotLight.target = new Object3D()
      this.scene.add(this.spotLight.target)
      this.spotLight.target.position.set(3, 0, 0.95)
    },
    loadMonsterTV() {
      return Promise.resolve(
        new TextureLoader().load(monster)
      ).then(texture => {
        let material = new SpriteMaterial({
          depthTest: false,
          map: texture,
          opacity: 0.0,
        })
        let tv = new Sprite(material)
        tv.scale.setScalar(2)

        texture = new VideoTexture(this.$refs.video)
        material = new HalftoneMaterial({
          map: texture,
          opacity: 0.0,
          transparent: true,
        })
        let geometry = new PlaneGeometry(1.10, 0.92)
        geometry.rotateY(90 * DEGREES_TO_RADIANS)
        let screen = new Mesh(geometry, material)
        screen.scale.setScalar(0.5)
        screen.position.set(0.70, 1.01, 1.05).multiplyScalar(0.5)
        tv.add(screen)
        tv.screen = screen

        this.scene.add(tv)
        this.monsterTV = tv
      })
    },
    loadNekoTV() {
      return Promise.resolve(
        new TextureLoader().load(neko)
      ).then(texture => {
        let material = new SpriteMaterial({
          depthTest: false,
          map: texture,
          opacity: 0.0,
        })
        let tv = new Sprite(material)
        tv.scale.setScalar(2)

        texture = new VideoTexture(this.$refs.video)
        material = new HalftoneMaterial({
          map: texture,
          opacity: 0.0,
          transparent: true,
        })
        let geometry = new PlaneGeometry(1.10, 0.90)
        geometry.rotateY(90 * DEGREES_TO_RADIANS)
        let screen = new Mesh(geometry, material)
        screen.scale.setScalar(0.5)
        screen.position.set(0.55, 1.00, 1.14).multiplyScalar(0.5)
        tv.add(screen)
        tv.screen = screen

        this.scene.add(tv)
        this.nekoTV = tv
        return Promise.all([
          this.transitionOpacity(tv, 1.0),
          this.transitionOpacity(tv.screen, 1.0)
        ])
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
    track() {
      let targetSize = new Vector3(2.25, 2.25)
      this.animations.push({
        startTime: this.clock.elapsedTime,
        duration: 60 * 60 * 24,
        tick: (t, duration) => {
          let {aspect} = this.frame()
          Object.assign(this.camera, {
            left: targetSize.x * aspect / -2,
            right: targetSize.x * aspect / 2,
            top: targetSize.y / 2,
            bottom: targetSize.y / -2,
            near: 0,
            far: 1000
          })
          this.camera.updateProjectionMatrix()
        },
      })
    },
    transitionIntensity(light, value) {
      return new Promise((resolve, reject) => {
        let intensity = light.intensity
        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: 10.0,
          tick: (t, duration) => {
            light.intensity = lerp(intensity, value, easeCubicInOut(t/duration))
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    transitionOpacity(object, value) {
      return new Promise((resolve, reject) => {
        let opacity = object.material.opacity
        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: 1.0,
          tick: (t, duration) => {
            object.material.opacity = lerp(opacity, value, easeBackInOut(t/duration))
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
        delay(7.0).then(this.transitionTV),
      ])
    },
    transitionToDay() {
      return Promise.all([
        this.transitionIntensity(this.ambientLight, 1.0),
        this.transitionIntensity(this.ceilingLight, 0.0),
        this.transitionIntensity(this.spotLight, 0.0),
        delay(7.0).then(this.transitionTV),
      ])
    },
    transitionTV() {
      return new Promise((resolve, reject) => {
        let nekoOpacity = this.nekoTV.material.opacity
        let monsterOpacity = this.monsterTV.material.opacity

        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: 1.5,
          tick: (t, duration) => {
            let easeGlitch = (t) => t < 1.0 ? sample([t, t, 0.50, 0.75]) : t
            let easeWithGlitch = easeGlitch(easeExpIn(t/duration))

            let tickOpacityNeko = lerp(nekoOpacity, monsterOpacity, easeWithGlitch)
            this.nekoTV.material.opacity = tickOpacityNeko
            this.nekoTV.screen.material.opacity = tickOpacityNeko

            let tickOpacityMonster = lerp(monsterOpacity, nekoOpacity, easeWithGlitch)
            this.monsterTV.material.opacity = tickOpacityMonster
            this.monsterTV.screen.material.opacity = tickOpacityMonster
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    update() {
      // Update animations
      if (!this.clock.running) return
      let globalElapsedTime = this.clock.getElapsedTime()
      this.animations.forEach((animation, index) => {
        let {startTime, duration, tick, resolve, reject} = animation
        let elapsedTime = Math.min(globalElapsedTime - startTime, duration)
        try {
          tick(elapsedTime, duration)
        } catch (error) {
          this.animations.splice(index, 1)
          if (reject) reject(error)
        }
        if (elapsedTime >= duration) {
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
    this.load().then(async () => {
      while (this.clock.running) {
        await delay(6.0).then(this.changeChannel)
      }
    })
  }
}
