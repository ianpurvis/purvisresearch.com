import { shallowMount } from '@vue/test-utils'
import Component from '~/pages/2017/sept.vue'

describe('sept.vue', () => {
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
