import {
  Body,
  Box,
  NaiveBroadphase,
  Vec3,
  World
} from 'cannon-es'
import {
  Font,
  MathUtils,
  Matrix4,
  Quaternion,
  TextBufferGeometry,
  Vector3,
} from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/buffergeometryutils.js'
import inconsolata from '~/assets/models/Inconsolata_Regular.json'


class ExploderPhysicsWorker {

  constructor(scope) {
    scope.onmessage = this.onmessage.bind(this)

    const world = new World()
    world.allowSleep = true
    world.broadphase = new NaiveBroadphase()
    world.gravity.set(0, -9.82, 0)
    world.solver.iterations = 1
    world.quatNormalizeFast = true
    world.quatNormalizeSkip = 2

    Object.assign(this, {
      scope,
      world
    })
  }

  onmessage({ data: { name, args }}) {
    this[name](args)
  }

  load() {
    const font = new Font(inconsolata)
    const characters = Array.from('abcdefghijklmnopqrstuvwxyz0123456789')
    const geometries = characters.map(character => {
      const geometry = new TextBufferGeometry(character, { font })
      geometry.center()
      geometry.computeBoundingBox()
      return geometry
    })
    const shapes = geometries.map(geometry => {
      const size = geometry.boundingBox.getSize(new Vector3())
      const halfExtents = new Vec3().copy(size).scale(0.5)
      return new Box(halfExtents)
    })
    const bodies = shapes.map(shape => new Body({
      // angularDamping: 0.9999,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
      // linearDamping: 0.9999,
      mass: MathUtils.randFloat(0.25, 1),
      shape,
      sleepSpeedLimit: 1.5,
      sleepTimeLimit: 0.5
    }))

    // Store previous quaternion
    bodies.forEach(body => {
      body.previousQuaternion = new Quaternion()
      body.preStep = function() {
        this.previousQuaternion.copy(this.quaternion)
      }
    })

    // Set up the explosion:
    const blastRadius = 60
    bodies.forEach(body => {
      body.position.set(
        MathUtils.randInt(-blastRadius, blastRadius),
        MathUtils.randInt(-blastRadius, blastRadius),
        MathUtils.randInt(-blastRadius, blastRadius),
      )
      body.quaternion.setFromEuler(
        MathUtils.degToRad(MathUtils.randInt(0, 360)),
        MathUtils.degToRad(MathUtils.randInt(0, 360)),
        MathUtils.degToRad(MathUtils.randInt(0, 360)),
      )
      const worldPoint =  new Vec3(0, 0, 0)
      const impulse = new Vec3().copy(body.position).scale(0.5)
      body.applyImpulse(impulse, worldPoint)
      // body.angularVelocity.copy(body.position).normalize()
    })

    // Add body for blast
    // size.setScalar(60)
    // const blast = {
    //   collisionFilterGroup: 1,
    //   collisionFilterMask: 2,
    //   mass: 10000,
    //   size
    // }
    // bodies.push(blast)

    // body.addEventListener('sleep', () => {
    //   body.mass *= 100
    //   body.angularDamping = 0.01
    //   body.linearDamping = 0.01
    //   body.wakeUp()
    // })

    bodies.forEach(body => this.world.addBody(body))

    const mergedGeometry =
      BufferGeometryUtils.mergeBufferGeometries(geometries, true)

    Object.assign(this, { mergedGeometry })

    const positions = mergedGeometry.attributes.position.array
    const normals = mergedGeometry.attributes.normal.array

    this.scope.postMessage({ name: 'onload', args: {
      positions,
      normals
    }},[
      positions.buffer,
      normals.buffer
    ])
  }

  step({ deltaTime, positions, normals }) {
    this.world.step(deltaTime)

    const { position, normal } = this.mergedGeometry.attributes
    position.array = positions
    normal.array = normals

    const _matrix = new Matrix4()
    const _vector = new Vector3()
    const _quaternion = new Quaternion()
    let _body, _group
    for (let i = 0; i < this.world.bodies.length; i++) {
      _body = this.world.bodies[i]
      _vector.copy(_body.position)
      _vector.sub(_body.previousPosition)
      _quaternion.copy(_body.quaternion)
      _quaternion.multiply(_body.previousQuaternion.conjugate())
      _matrix.identity()
      _matrix.makeRotationFromQuaternion(_quaternion)
      _matrix.setPosition(_vector)

      _group = this.mergedGeometry.groups[i]
      for (let j = _group.start, k = _group.start + _group.count; j < k; j++) {
        _vector.x = position.getX(j)
        _vector.y = position.getY(j)
        _vector.z = position.getZ(j)
        _vector.applyMatrix4(_matrix)
        position.setXYZ(j, _vector.x, _vector.y, _vector.z)
      }
    }
    this.mergedGeometry.computeVertexNormals()

    this.scope.postMessage({
      name: 'onstep',
      args: {
        positions,
        normals,
      }
    }, [
      positions.buffer,
      normals.buffer
    ])
  }
}

export { ExploderPhysicsWorker }

// Boot up the worker :
new ExploderPhysicsWorker(self)
