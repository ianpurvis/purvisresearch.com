import Tight from 'vue-tight'
import Unobfuscate from '~/directives/unobfuscate.js'

export default {
  directives: {
    Tight,
    Unobfuscate
  },
  methods: {
    snake(value) {
      return value.replace(/\s/g, `<span class="underscore" ${this.$options._scopeId}>&nbsp;</span>`)
    },
  }
}
