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

    const gravity = new Ammo.btVector3(0, 0, 0)
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

  loadFlag(attributes) {
    const { physicsWorld } = this
    const softBodyWorldInfo = physicsWorld.getWorldInfo()
    const flag = new FlagPhysicsBody({ ...attributes, mass: 10, softBodyWorldInfo })
    physicsWorld.addSoftBody(flag)
    Object.assign(this, { flag })
  }

  saveFlag(target) {
    this.flag.serialize(target)
  }

  destroy() {
    // Destroy references from top down:
    this.physicsWorld.removeSoftBody(this.flag)
    Ammo.destroy(this.flag)
    Ammo.destroy(this.physicsWorld)
    Ammo.destroy(this.softBodySolver)
    Ammo.destroy(this.solver)
    Ammo.destroy(this.broadphase)
    Ammo.destroy(this.dispatcher)
    Ammo.destroy(this.collisionConfiguration)
  }

  update(deltaTime) {
    this.physicsWorld.stepSimulation(deltaTime)
  }
}

export { FlagPhysicsWorld }
