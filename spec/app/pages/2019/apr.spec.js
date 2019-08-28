import { shallowMount } from '@vue/test-utils'
import Component from '~/pages/2019/apr.vue'

describe('apr.vue', () => {
  let wrapper

  it('is a Vue instance', () => {
    wrapper = shallowMount(Component, {
      stubs: ['nuxt-link']
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
