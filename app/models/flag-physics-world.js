/* global Ammo */
import { FlagPhysicsBody } from '~/models/flag-physics-body.js'

class FlagPhysicsWorld {

  constructor() {
    const collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration()
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
    const broadphase = new Ammo.btDbvtBroadphase()
    const solver = new Ammo.btSequentialImpulseConstraintSolver()
    const softBodySolver = new Ammo.btDefaultSoftBodySolver()
    const physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration,
      softBodySolver
    )

    const gravity = new Ammo.btVector3(0, -9.8, 0)
    physicsWorld.setGravity(gravity)
    const softBodyWorldInfo = physicsWorld.getWorldInfo()
    softBodyWorldInfo.set_m_gravity(gravity)

    Object.assign(this, {
      broadphase,
      collisionConfiguration,
      dispatcher,
      physicsWorld,
      solver,
      softBodySolver,
    })
  }

  loadFlagBody(attributes) {
    const { physicsWorld } = this
    const softBodyWorldInfo = physicsWorld.getWorldInfo()
    const flagBody = new FlagPhysicsBody({ ...attributes, softBodyWorldInfo })
    physicsWorld.addSoftBody(flagBody)
    Object.assign(this, { flagBody })
  }

  serialize(buffer) {
    this.flagBody.serialize(buffer)
  }

  destroy() {
    // Destroy references from top down:
    Ammo.destroy(this.physicsWorld)
    Ammo.destroy(this.softBodySolver)
    Ammo.destroy(this.solver)
    Ammo.destroy(this.broadphase)
    Ammo.destroy(this.dispatcher)
    Ammo.destroy(this.collisionConfiguration)
    Ammo.destroy(this.flagBody)
  }

  update(deltaTime) {
    this.physicsWorld.stepSimulation(deltaTime)
  }
}

export { FlagPhysicsWorld }
