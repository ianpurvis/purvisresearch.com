import {
  Body,
  Box,
  NaiveBroadphase,
  Vec3,
  World
} from 'cannon-es'


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

  load({ bodies }) {
    bodies.forEach(({
      collisionFilterGroup,
      collisionFilterMask,
      mass,
      position,
      quaternion,
      size
    }) => {
      const halfExtents = new Vec3().copy(size).scale(0.5)
      const shape = new Box(halfExtents)
      const body = new Body({
        // angularDamping: 0.9999,
        collisionFilterGroup,
        collisionFilterMask,
        // linearDamping: 0.9999,
        mass,
        position,
        quaternion,
        shape,
        sleepSpeedLimit: 1.5,
        sleepTimeLimit: 0.5
      })
      body.addEventListener('sleep', () => {
        body.mass *= 100
        body.angularDamping = 0.01
        body.linearDamping = 0.01
        body.wakeUp()
      })
      const worldPoint =  new Vec3(0, 0, 0)
      const impulse = new Vec3().copy(body.position).scale(0.5)
      body.applyImpulse(impulse, worldPoint)
      // body.angularVelocity.copy(body.position).normalize()
      this.world.addBody(body)
    })

    this.scope.postMessage({ name: 'onload', args: {} })
  }

  step({ deltaTime, positions, quaternions }) {
    this.world.step(deltaTime)
    // this.world.step(1/240, deltaTime, 10)

    for (let i = 0, body; i < this.world.bodies.length; i++) {
      body = this.world.bodies[i]
      positions[i*3+0] = body.position.x
      positions[i*3+1] = body.position.y
      positions[i*3+2] = body.position.z
      quaternions[i*4+0] = body.quaternion.x
      quaternions[i*4+1] = body.quaternion.y
      quaternions[i*4+2] = body.quaternion.z
      quaternions[i*4+3] = body.quaternion.w
    }

    this.scope.postMessage({
      name: 'onstep',
      args: {
        positions,
        quaternions,
      }
    }, [
      positions.buffer,
      quaternions.buffer
    ])
  }
}

export { ExploderPhysicsWorker }

// Boot up the worker :
new ExploderPhysicsWorker(self)
