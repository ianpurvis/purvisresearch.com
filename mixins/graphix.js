import unobfuscate from '~/directives/unobfuscate.js'

export default {
  directives: {
    unobfuscate
  },
  methods: {
    snake(value) {
      return value.replace(/\s/g, `<span class="underscore" ${this.$options._scopeId}>&nbsp;</span>`)
    },
  }
}

