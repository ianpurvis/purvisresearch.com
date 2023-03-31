import { beforeEach, describe, expect, it } from 'jest-ctx'
import { Organization } from '~/models/organization.js'

describe('Organization', () => {
  let org

  describe('constructor(attributes)', () => {
    it('initializes @context to \'https://schema.org\'', () => {
      org = new Organization()
      expect(org).toHaveProperty('@context', 'https://schema.org')
    })
    it('initializes @type to \'Organization\'', () => {
      org = new Organization()
      expect(org).toHaveProperty('@type', 'Organization')
    })
    it('assigns itself all other attributes', () => {
      let attributes = {
        one: 'one',
        two: 'two',
        three: 'three'
      }
      org = new Organization(attributes)
      expect(org).toMatchObject(attributes)
    })
  })

  describe('.default', () => {
    beforeEach(() => {
      org = Organization.default
    })
    it('is an instance of organization', () => {
      expect(org).toBeInstanceOf(Organization)
    })
    it('is frozen', () => {
      expect(Object.isFrozen(org)).toBeTruthy()
    })
    it('is a schema.org Organization', () => {
      expect(org).toHaveProperty('@context', 'https://schema.org')
      expect(org).toHaveProperty('@type', 'Organization')
    })
    it('has required properties for google logo structured data', () => {
      expect(org).toHaveProperty('logo')
      expect(org).toHaveProperty('url')
    })
  })
})
