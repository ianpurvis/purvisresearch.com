import Tight from 'vue-tight'
import Unobfuscate from '~/directives/unobfuscate.js'
import { WebGL } from '~/models/webgl.js'

export default {
  directives: {
    Tight,
    Unobfuscate
  },
  methods: {
    logError(error) {
      if (error instanceof WebGL.WebGLNotAvailableError) {
        console.warn(error.message)
      } else {
        this.$sentry.captureException(error)
        console.error(error)
      }
    },
    snake(value) {
      return value.replace(/\s/g, `<span class="underscore" ${this.$options._scopeId}>&nbsp;</span>`)
    },
  }
}
