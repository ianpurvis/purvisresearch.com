import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import Component from '~/pages/2019/apr.vue'

describe('apr.vue', () => {
  let wrapper

  beforeEach(() => {
    global.console = {
      error: jest.fn(),
      warn: jest.fn()
    }
  })
  it('is a Vue instance', () => {
    wrapper = shallowMount(Component, {
      stubs: ['nuxt-link']
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
