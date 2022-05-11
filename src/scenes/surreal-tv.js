import {
  AmbientLight,
  Color,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SpotLight,
  VideoTexture
} from 'three'
import {
  easeBackInOut,
  easeQuadIn,
} from 'd3-ease'
import monsterTexturePath from '../assets/images/2019/apr/monster-bw.png'
import nekoTexturePath from '../assets/images/2019/apr/neko-bw.png'
import tatamiAlphaTexturePath from '../assets/images/2019/apr/tatami-alpha.png'
import { Animator, delay, transition } from '../models/animator.js'
import { DEGREES_TO_RADIANS } from '../models/constants.js'
import HalftoneMaterial from '../models/halftone-material.js'
import { OrthographicCamera } from '../models/orthographic-camera.js'
import { TextureLoader } from '../models/texture-loader.js'

const Colors = {
  black: new Color(0x000000),
  eggshell: new Color(0xf0ead6),
  mint: new Color(0xe2ffdc),
  white: new Color(0xffffff),
  whitesmoke: new Color(0xf5f5f5),
}

class SurrealTVScene extends Scene {

  constructor(video) {
    super()
    this.animator = new Animator()
    this.camera = new OrthographicCamera()
    this.textureLoader = new TextureLoader()
    this.video = video
  }

  async delay(duration) {
    await this.animator.resolve(delay(duration))
  }

  async load() {
    await this.loadCamera()
    await this.loadAmbientLight()
    await this.loadSubfloor()
    await this.loadFloor()
    await Promise.all([
      this.loadNekoTV(),
      this.loadScreen(),
    ])
    await this.loadMonsterTV()
    await this.loadScreenLight()
    await this.loadMonsterLight()
  }

  loadAmbientLight() {
    const light = Object.assign(new AmbientLight(), {
      color: Colors.white,
      intensity: 1.0,
    })
    this.add(light)
    this.ambientLight = light
  }

  loadCamera() {
    const { camera } = this
    camera.position.setScalar(3)
    camera.lookAt(this.position)
  }

  async loadFloor() {
    const alphaMap = await this.textureLoader.load(tatamiAlphaTexturePath)
    alphaMap.wrapS = alphaMap.wrapT = RepeatWrapping
    alphaMap.repeat.set(9, 9)
    const material = new MeshPhongMaterial({
      alphaMap,
      color: Colors.black,
      opacity: 0.0,
      transparent: true,
    })
    const geometry = new PlaneGeometry(9, 9)
    geometry.rotateX(-90 * DEGREES_TO_RADIANS)
    const floor = new Mesh(geometry, material)
    floor.position.set(0.11, 0, 0)
    this.add(floor)
    this.floor = floor
    await this.transitionOpacity(floor, 1000)
  }

  loadMonsterLight() {
    const light = Object.assign(new SpotLight(), {
      angle: 90 * DEGREES_TO_RADIANS,
      color: Colors.mint,
      distance: 1.6,
      intensity: 0,
      penumbra: 1,
    })
    light.position.set(-0.25, 0.2, 1)
    this.monsterTV.add(light)
    this.monsterLight = light
  }

  async loadMonsterTV() {
    const map = await this.textureLoader.load(monsterTexturePath)
    const material = new MeshPhongMaterial({
      color: Colors.whitesmoke,
      map,
      transparent: true,
      opacity: 0.0,
    })
    const geometry = new PlaneGeometry(2, 2)
    const tv = new Mesh(geometry, material)
    // Simulate sprite rendering:
    tv.lookAt(this.camera.position)
    tv.position.lerp(this.camera.position, 0.5)
    this.add(tv)
    this.monsterTV = tv
  }

  async loadNekoTV() {
    const map = await this.textureLoader.load(nekoTexturePath)
    const material = new MeshPhongMaterial({
      color: Colors.whitesmoke,
      map,
      transparent: true,
      opacity: 0.0,
    })
    const geometry = new PlaneGeometry(2, 2)
    const tv = new Mesh(geometry, material)
    // Simulate sprite rendering:
    tv.lookAt(this.camera.position)
    tv.position.lerp(this.camera.position, 0.5)
    this.add(tv)
    this.nekoTV = tv
    await this.transitionOpacity(tv, 1000)
  }

  async loadScreen() {
    const map = new VideoTexture(this.video)
    const material = new HalftoneMaterial({
      map,
      opacity: 0.0,
      transparent: true,
    })
    const geometry = new PlaneGeometry(1.01, 0.84)
    geometry.rotateY(90 * DEGREES_TO_RADIANS)
    const screen = new Mesh(geometry, material)
    screen.position.set(0.56, 0.91, 1.00)
    this.add(screen)
    this.screen = screen
    await this.transitionOpacity(screen, 1000)
    screen.transparent = false
  }

  loadScreenLight() {
    const light = Object.assign(new SpotLight(), {
      angle: 90 * DEGREES_TO_RADIANS,
      color: Colors.eggshell,
      distance: 2,
      intensity: 0,
      penumbra: 1,
    })
    light.position.copy(this.screen.position)

    const target = new Object3D()
    target.position.set(1, 0, 0) // TODO correct geometry rotation and use negative z
    light.add(target)
    light.target = target

    this.add(light)
    this.screenLight = light
  }

  loadSubfloor() {
    const material = new MeshPhongMaterial({
      color: Colors.whitesmoke,
      opacity: 0.0,
      transparent: true,
    })
    const geometry = new PlaneGeometry(9, 9)
    geometry.rotateX(-90 * DEGREES_TO_RADIANS)
    const subfloor = new Mesh(geometry, material)
    subfloor.position.set(0.11, -0.01, 0)
    this.add(subfloor)
    this.subfloor = subfloor
  }

  resize(width, height) {
    this.camera.cover(width, height, 2.25, 2.25)
  }

  async run() {
    await this.delay(3000)
    await this.transitionToNight(8000)
    await this.transitionIntensity(this.monsterLight, 1, 5000)
    await this.delay(3000)
    await this.transitionIntensity(this.monsterLight, 0, 6000)
    await this.transitionToDay(8000)
  }

  async transitionIntensity(target, value, duration = 1000) {
    await this.animator.resolve(transition(target, 'intensity', value, duration, easeQuadIn))
  }

  async transitionOpacity(target, value, duration = 1000) {
    function ease(t) { return easeBackInOut(t, 0.5) }
    await this.animator.resolve(transition(target.material, 'opacity', value, duration, ease))
  }

  async transitionToNight(duration) {
    const { ambientLight, monsterTV, nekoTV, screenLight, subfloor } = this
    await Promise.all([
      this.transitionOpacity(subfloor, 1, duration),
      this.transitionIntensity(ambientLight, 0, duration)
    ])
    await Promise.all([
      this.transitionIntensity(screenLight, 1, duration * 1/2),
      this.transitionOpacity(nekoTV, 0, duration * 5/8),
      this.transitionOpacity(monsterTV, 1, duration * 5/8),
    ])
  }

  async transitionToDay(duration) {
    const { ambientLight, monsterTV, nekoTV, screenLight, subfloor } = this
    await Promise.all([
      this.transitionIntensity(screenLight, 0, duration * 1/2),
      (async () => {
        await this.delay(duration * 1/4)
        await Promise.all([
          this.transitionOpacity(nekoTV, 1, duration * 5/8),
          this.transitionOpacity(monsterTV, 0, duration * 5/8),
        ])
      })(),
      (async () => {
        await this.delay(duration * 3/8)
        await Promise.all([
          this.transitionIntensity(ambientLight, 1, duration * 5/8),
          this.transitionOpacity(subfloor, 0, duration * 5/8)
        ])
      })()
    ])
  }

  update(deltaTime) {
    this.animator.update(deltaTime)

    if (this.camera.needsUpdate)
      this.camera.updateProjectionMatrix()
  }
}

export { SurrealTVScene }
