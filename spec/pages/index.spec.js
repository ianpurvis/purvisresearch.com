import { shallowMount } from '@vue/test-utils'
import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import Component from '~/pages/index.vue'

describe('index.vue', () => {
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
