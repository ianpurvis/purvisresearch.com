<script>
import { h } from 'vue'

function underscore(replace = 1) {
  const className = ['underscore']
  const content = ['\xa0']
  if (replace > 1) {
    className.push('replace-2')
    content.push('\xa0')
  }
  return h('span', { class: className }, content.join(''))
}

function snakeify(vnode) {
  let result
  if (vnode.children) {
    // TODO replace with cloneVNode once export is available in vue 3x
    result = h(vnode.tag, vnode.children.flatMap(snakeify))
  } else if (vnode.text) {
    result = vnode.text.split(/\b/).map(word => {
      switch(word) {
      case ' ': return underscore()
      case ': ': return underscore(2)
      default: return word
      }
    })
  } else {
    result = vnode
  }
  return result
}

export default {
  setup(_, { slots }) {
    const children = slots.default ? slots.default() : []
    return () => h('div', { class: 'snake' }, children.flatMap(snakeify))
  }
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/initial-variables';
@import '~bulma/sass/utilities/derived-variables';
@import '~bulma/sass/utilities/mixins';

$mobile-width: 568px;

.snake {
  overflow-wrap: break-word;
  text-transform: lowercase;
  word-break: break-all;
}

.underscore {
  // Margin equals characters replaced * -(1ch + letter spacing)
  margin-right: 1 * -(1ch + 0.125ch);
  visibility: hidden;

  @include from($mobile-width) {
    // Margin equals characters replaced * -(1ch + letter spacing)
    margin-right: 1 * -(1ch + 0.06ch);
  }

  &::before {
    content: '_';
    visibility: visible;
  }

  &.replace-2 {
    // Margin equals characters replaced * -(1ch + letter spacing)
    margin-right: 2 * -(1ch + 0.125ch);

    @include from($mobile-width) {
      // Margin equals characters replaced * -(1ch + letter spacing)
      margin-right: 2 * -(1ch + 0.06ch);
    }
  }
}
</style>
