jest.mock('three')

import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import { Mesh, Vector3 } from 'three'
import { Particle } from '~/models/particle.js'

describe('Particle', () => {
  let particle, geometry, material

  beforeEach(() => {
    geometry = 'mockGeometry'
    material = 'mockMaterial'
    particle = new Particle(geometry, material)
  })

  it('extends THREE.Mesh', () => {
    expect(particle).toBeInstanceOf(Mesh)
  })

  describe('constructor(geometry, material)', () => {
    it('passes geometry and material to the super constructor', () => {
      expect(Mesh.prototype.constructor)
        .toHaveBeenCalledWith(geometry, material)
    })
    it('initializes acceleration', () => {
      expect(particle.acceleration).toBeInstanceOf(Vector3)
    })
    it('initializes mass', () => {
      expect(particle.mass).toBe(1)
    })
    it('initializes velocity', () => {
      expect(particle.velocity).toBeInstanceOf(Vector3)
    })
  })
})
