import Tight from 'vue-tight'
import Unobfuscate from '~/directives/unobfuscate.js'
import { WebGL } from '~/models/webgl.js'

export default {
  errorCaptured(error) {
    if (error instanceof WebGL.WebGLNotAvailableError) {
      console.warn(error.message)
      return false
    }
    throw error
  },
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
