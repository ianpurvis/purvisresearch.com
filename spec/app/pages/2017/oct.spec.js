// Mock to prevent pixi dependencies from raising jsdom errors:
jest.mock('~/models/bezier_texture.js', () => {})
import { shallowMount } from '@vue/test-utils'
import Component from '~/pages/2017/oct.vue'

describe('oct.vue', () => {
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
