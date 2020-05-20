import {
  AmbientLight,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  SpotLight,
  Vector3,
  VideoTexture,
} from 'three'
import {
  easeBackInOut,
  easeQuadIn,
} from 'd3-ease'
import ThreeDemo from '~/mixins/three-demo.js'
import { DEGREES_TO_RADIANS } from '~/models/constants.js'
import HalftoneMaterial from '~/models/halftone_material.js'
import { Organization } from '~/models/organization.js'
import { Random } from '~/models/random.js'
import { TextureLoader } from '~/models/texture-loader.js'
import tatami from '~/assets/images/2019/apr/tatami-bw.png'
import tatamiAlpha from '~/assets/images/2019/apr/tatami-alpha.png'
import neko from '~/assets/images/2019/apr/neko-bw.png'
import monster from '~/assets/images/2019/apr/monster-bw.png'

const Colors = {
  black: 0x000000,
  eggshell: 0xf0ead6,
  ghostpink: 0xe2ffdc,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
}

export default {
  beforeDestroy() {
    this.stopVideo()
  },
  created() {
    // Non-reactive data:
    this.camera = new OrthographicCamera()
    this.canonicalUrl = `${Organization.default.url}/2019/apr.html`
    this.description = 'Surreal television with WebRTC and WebGL.'
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
        'name': 'apr 2019',
        'item': this.canonicalUrl
      }]
    },
    this.title = 'apr 2019 - purvis research'
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${require('~/assets/images/2019/apr.png')}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Apr 2019' },
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
    delay(duration) {
      return new Promise((resolve, reject) => {
        const animation = {
          startTime: this.elapsedTime,
          duration: duration,
          tick: (t, d) => {},
          resolve: resolve,
          reject: reject
        }
        this.animations.push(animation)
      })
    },
    isDesktopSafari() {
      let userAgent = window.navigator.userAgent
      return userAgent.match(/Safari/i) && !userAgent.match(/Mobile/i)
    },
    load() {
      return Promise
        .resolve(ThreeDemo.methods.load.call(this))
        .then(this.loadCamera)
        .then(this.loadAmbientLight)
        .then(this.loadSubfloor)
        .then(this.loadFloor)
        .then(() => Promise.all([
          this.loadNekoTV(),
          this.loadScreen(),
        ]))
        .then(this.loadMonsterTV)
        .then(this.loadScreenLight)
        .then(this.loadMonsterLight)
    },
    loadCamera() {
      this.camera.position.setScalar(3)
      this.camera.lookAt(this.scene.position)
      this.track()
    },
    loadFloor() {
      return Promise.all([
        new TextureLoader().load(tatami),
        new TextureLoader().load(tatamiAlpha)
      ]).then(([map, alphaMap]) => {
        [map, alphaMap].forEach(m => {
          m.wrapS = RepeatWrapping
          m.wrapT = RepeatWrapping
          m.repeat.set(9, 9)
        })
        let material = new MeshPhongMaterial({
          alphaMap: alphaMap,
          color: Colors.whitesmoke,
          emissive: Colors.black,
          map: map,
          opacity: 0.0,
          transparent: true,
        })
        let geometry = new PlaneGeometry(9, 9)
        geometry.rotateX(-90 * DEGREES_TO_RADIANS)
        this.floor = new Mesh(geometry, material)
        this.scene.add(this.floor)
        this.floor.position.set(0.11, 0, 0)
        return this.transitionOpacity(this.floor, 1.0)
      })
    },
    loadSubfloor() {
      let material = new MeshPhongMaterial({
        color: Colors.whitesmoke,
        emissive: Colors.black,
        opacity: 0.0,
        transparent: true,
      })
      let geometry = new PlaneGeometry(9, 9)
      geometry.rotateX(-90 * DEGREES_TO_RADIANS)
      this.subfloor = new Mesh(geometry, material)
      this.subfloor.position.set(0.11, -0.01, 0)
      this.scene.add(this.subfloor)
    },
    loadAmbientLight() {
      this.ambientLight = new AmbientLight(...Object.values({
        color: Colors.white,
        intensity: 1.0,
      }))
      this.scene.add(this.ambientLight)
    },
    loadMonsterLight() {
      let light = new SpotLight(...Object.values({
        color: Colors.ghostpink,
        intensity: 0.0,
        distance: 30.0,
        angle: 0.30 * Math.PI/2,
        penumbra: 1.0,
        decay: 1.0,
      }))
      light.position.copy(this.camera.position)
      light.position.setY(0)
      light.target = this.monsterTV
      this.scene.add(light)
      this.monsterLight = light
    },
    loadMonsterTV() {
      return Promise.resolve(
        new TextureLoader().load(monster)
      ).then(texture => {
        let material = new MeshPhongMaterial({
          color: Colors.whitesmoke,
          emissive: Colors.black,
          depthTest: false,
          map: texture,
          shininess: 0.0,
          transparent: true,
          opacity: 0.0,
        })
        let geometry = new PlaneGeometry(2, 2)
        let tv = new Mesh(geometry, material)
        // Simulate sprite rendering:
        tv.lookAt(this.camera.position)
        tv.position.lerp(this.camera.position, 0.5)
        this.scene.add(tv)
        this.monsterTV = tv
      })
    },
    loadNekoTV() {
      return Promise.resolve(
        new TextureLoader().load(neko)
      ).then(texture => {
        let material = new MeshPhongMaterial({
          color: Colors.whitesmoke,
          emissive: Colors.black,
          depthTest: false,
          map: texture,
          shininess: 0.0,
          transparent: true,
          opacity: 0.0,
        })
        let geometry = new PlaneGeometry(2, 2)
        let tv = new Mesh(geometry, material)
        // Simulate sprite rendering:
        tv.lookAt(this.camera.position)
        tv.position.lerp(this.camera.position, 0.5)
        this.scene.add(tv)
        this.nekoTV = tv
        return this.transitionOpacity(tv, 1.0)
      })
    },
    loadScreen() {
      let texture = new VideoTexture(this.$refs.video)
      let material = new HalftoneMaterial({
        depthTest: false,
        map: texture,
        opacity: 0.0,
        transparent: true,
      })
      let geometry = new PlaneGeometry(1.01, 0.84)
      geometry.rotateY(90 * DEGREES_TO_RADIANS)
      let screen = new Mesh(geometry, material)
      screen.position.set(0.56, 0.91, 1.00)
      this.scene.add(screen)
      this.screen = screen

      return this.transitionOpacity(this.screen, 1.0)
    },
    loadScreenLight() {
      let target = new Object3D()
      target.position.set(3, 0, 0.95)
      this.scene.add(target)

      let light = new SpotLight(...Object.values({
        color: Colors.eggshell,
        intensity: 0.0,
        distance: 4.0,
        angle: 0.5 * Math.PI/2,
        penumbra: 1.0,
        decay: 1.0,
      }))
      light.position.copy(this.screen.position)
      light.target = target
      this.scene.add(light)
      this.screenLight = light
    },
    startVideo() {
      let constraints = {
        audio: false,
        video: true,
      }
      if (this.isDesktopSafari()) {
        constraints.video = {
          aspectRatio: { ideal: 16/9 }
        }
      }
      return Promise.resolve(
        window.navigator.mediaDevices.getUserMedia(constraints)
      ).then(stream => {
        stream.getTracks().forEach(track => console.debug(track.getSettings()))
        if (this._isDestroyed || this._isBeingDestroyed) return
        this.$refs.video.srcObject = stream
      }).catch(error => {
        console.warn(`Could not acquire device camera (${error.message})`)
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
        tick: (t, d) => {
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
    transitionIntensity(light, value, duration=1.0) {
      return new Promise((resolve, reject) => {
        let intensity = light.intensity
        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: duration,
          tick: (t, d) => {
            light.intensity = MathUtils.lerp(intensity, value, easeQuadIn(t/d))
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    transitionOpacity(object, value, duration=1.0) {
      return new Promise((resolve, reject) => {
        let opacity = object.material.opacity
        this.animations.push({
          startTime: this.clock.elapsedTime,
          duration: duration,
          tick: (t, d) => {
            object.material.opacity = MathUtils.lerp(opacity, value, easeBackInOut(t/d, 0.5))
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    transitionToNight() {
      return Promise.all([
        this.transitionOpacity(this.subfloor, 1.0, 8.0),
        this.transitionIntensity(this.ambientLight, 0.0, 8.0)
      ]).then(() => Promise.all([
        this.transitionIntensity(this.screenLight, 1.0, 4.0),
        this.transitionOpacity(this.nekoTV, 0.0, 5.0),
        this.transitionOpacity(this.monsterTV, 1.0, 5.0),
      ]))
    },
    transitionToDay() {
      return Promise.all([
        this.transitionIntensity(this.screenLight, 0.0, 4.0),
        this.delay(2).then(() => Promise.all([
          this.transitionOpacity(this.nekoTV, 1.0, 5.0),
          this.transitionOpacity(this.monsterTV, 0.0, 5.0),
        ])),
        this.delay(3).then(() => Promise.all([
          this.transitionIntensity(this.ambientLight, 1.0, 5.0),
          this.transitionOpacity(this.subfloor, 0.0, 5.0)
        ])),
      ])
    },
    update() {
      ThreeDemo.methods.update.call(this)
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load()
      .then(this.startVideo)
      .then(async () => {
        while (this.clock.running) {
          await this.delay(3.0)
            .then(this.transitionToNight)
            .then(() => this.transitionIntensity(this.monsterLight, 0.9, 5.0))
            .then(() => this.delay(3.0))
            .then(() => this.transitionIntensity(this.monsterLight, 0.0, 6.0))
            .then(this.transitionToDay)
        }
      })
      .catch(this.logError)
  }
}
