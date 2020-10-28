import { transfer, wrap } from 'comlink'
import {
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Scene,
} from 'three'
import billImagePath from '../assets/images/2020/jul/tubman-twenty.jpg'
import { PerspectiveCamera } from '../models/perspective-camera.js'
import { ChaseCameraRig } from '../models/chase-camera-rig.js'
import { cos } from '~/models/oscillators.js'
import { TextureLoader } from '../models/texture-loader.js'
import workerUrl from '../workers/dollar-physics-worker.js?worker&url'

class BanknoteInSimplexWind extends Scene {

  constructor() {
    super()
    this.camera = new PerspectiveCamera()
  }

  dispose() {
    this.physicsWorker.terminate()
  }

  async load() {
    await this.loadBill()
    this.loadCamera()
    await this.loadPhysics()
  }

  loadCamera() {
    this.camera.far = 1000
    const cameraRig = this.cameraRig = new ChaseCameraRig(this.camera, this.mesh)
    cameraRig.position.z = cameraRig.offset.z = 12
    this.add(cameraRig)
  }

  async loadBill() {
    const geometry = new PlaneBufferGeometry(
      15.61,  // width = 156.1mm / 1000 mm per m * 100 scale
      6.63,   // height = 66.3mm / 1000 mm per m * 100 scale
      15,     // widthSegments
      6,      // heightSegments
    )
    geometry.deleteAttribute('normal')
    const textureLoader = new TextureLoader()
    const billTexture = await textureLoader.load(billImagePath)
    billTexture.repeat.y = 0.806640625 // 826px / 1024px padded height
    const material = new MeshBasicMaterial({
      map: billTexture,
      side: DoubleSide,
    })
    const mesh = new Mesh(geometry, material)
    mesh.frustumCulled = false

    this.add(mesh)

    Object.assign(this, { mesh })
  }

  async loadPhysics() {
    this.physicsWorker = wrap(new Worker(workerUrl, { type: 'module' }))

    const mass = 0.1 // 1g / 1000 g per kg * 100 scale
    let vertices = this.mesh.geometry.attributes.position.array
    let triangles = this.mesh.geometry.index.array
    const message = transfer({ mass, vertices, triangles }, [
      vertices.buffer,
      triangles.buffer
    ])
    ;({ triangles, vertices } = await this.physicsWorker.load(message))

    this.mesh.geometry.index.array = triangles
    this.mesh.geometry.attributes.position.array = vertices
    // Optimize usage for stepped drawing:
    this.mesh.geometry.attributes.position.usage = DynamicDrawUsage
    this.mesh.geometry.attributes.position.needsUpdate = true
  }

  resize(width, height) {
    this.camera.cover(width, height, 2.25, 2.25)
  }

  async update(deltaTime, elapsedTime) {
    deltaTime /= 1000 // use seconds for ammo and chase rig

    let vertices = this.mesh.geometry.attributes.position.array
    vertices = await this.physicsWorker.step({ deltaTime, vertices })
    this.mesh.geometry.attributes.position.array = vertices
    this.mesh.geometry.attributes.position.needsUpdate = true

    this.cameraRig.smoothing = cos(
      elapsedTime,
      20,   // period (seconds)
      0.1,  // amplitude
      0,    // xshift
      0.65  // yshift
    )
    this.cameraRig.update(deltaTime)

    if (this.camera.needsUpdate)
      this.camera.updateProjectionMatrix()
  }
}

export { BanknoteInSimplexWind }
