import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import Layout from '~/layouts/default.vue'

describe('default.vue', () => {

  beforeAll(() => ({ stubs: ['nuxt', 'nuxt-link'] }))
  beforeEach((options) => shallowMount(Layout, options))

  it('mounts', (wrapper) => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
