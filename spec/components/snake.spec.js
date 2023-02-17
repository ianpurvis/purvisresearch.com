import { mount } from '@vue/test-utils'
import Snake from '~/components/snake.vue'


const examples = [
  {
    name: 'no children',
    given: '<Snake/>',
    expected: '<div class="snake"></div>'
  },
  {
    name: 'text with a space',
    given: '<Snake>element a</Snake>',
    expected: '<div class="snake">element<span class="underscore">&nbsp;</span>a</div>'
  },
  {
    name: 'multiple child elements',
    given: '<Snake><div>element a</div><div>element b</div></Snake>',
    expected: '<div class="snake">' +
    '<div>element<span class="underscore">&nbsp;</span>a</div>' +
    '<div>element<span class="underscore">&nbsp;</span>b</div>' +
    '</div>'
  },
  {
    name: 'attributes',
    given: '<Snake class="example" data-test="example"/>',
    expected: '<div class="example snake" data-test="example"></div>'
  },
  {
    name: 'implicit spaces',
    given: '<Snake>\n' +
      '<div>element a</div>\n' +
      '<div>element b</div>\n' +
      '</Snake>',
    expected: '<div class="snake">' +
      '<div>element<span class="underscore">&nbsp;</span>a</div>' +
      ' '  +
      '<div>element<span class="underscore">&nbsp;</span>b</div>' +
      '</div>'
  },
]

describe('Snake', () => {
  for (const { name, given: template, expected } of examples) {
    describe(`given ${name}`, () => {
      it('renders a snake', () => {
        const wrapper = mount({ template, components: { Snake } })
        const { element: { outerHTML } } = wrapper
        expect(outerHTML).toBe(expected)
      })
    })
  }
})
