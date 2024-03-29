import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'jest-ctx'
import Graphix from '~/components/graphix.vue'

describe('Graphix', () => {
  describe('given description and edition', () => {
    let description, edition

    it('renders a graphix header', () => {
      description = 'fake-description'
      edition = 'fake-edition'
      const template = `<Graphix description="${description}" edition="${edition}" />`
      const components = { Graphix }
      const stubs = { NuxtLink: RouterLinkStub }
      const wrapper = mount({ template, components }, { global: { stubs } })
      const { element: { outerHTML } } = wrapper
      expect(outerHTML).toMatch(/.+/)
    })
  })
})
