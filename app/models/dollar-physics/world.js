/* global Ammo */
import { Bill } from './bill.js'
import { Wind } from './wind.js'

class World {

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

    const wind = new Wind()
    wind.timeScale = 1/6
    wind.minVelocity.op_mul(0.1)
    wind.maxVelocity.op_mul(0.1)

    Object.assign(this, {
      broadphase,
      collisionConfiguration,
      dispatcher,
      physicsWorld,
      solver,
      softBodySolver,
      wind
    })
  }

  loadBill(attributes) {
    const { physicsWorld, wind } = this
    const softBodyWorldInfo = physicsWorld.getWorldInfo()
    const bill = new Bill({ ...attributes, softBodyWorldInfo })
    physicsWorld.addSoftBody(bill)
    wind.bodies.push(bill)
    Object.assign(this, { bill })
  }

  destroy() {
    // Destroy references from top down:
    this.wind.destroy()
    this.physicsWorld.removeSoftBody(this.bill)
    Ammo.destroy(this.bill)
    Ammo.destroy(this.physicsWorld)
    Ammo.destroy(this.softBodySolver)
    Ammo.destroy(this.solver)
    Ammo.destroy(this.broadphase)
    Ammo.destroy(this.dispatcher)
    Ammo.destroy(this.collisionConfiguration)
  }

  update(deltaTime) {
    this.wind.update(deltaTime)
    this.physicsWorld.stepSimulation(deltaTime)
  }
}

export { World }
