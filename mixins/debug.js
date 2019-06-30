import '~/assets/stylesheets/debug.scss'

export default {
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup() {
      if (event.defaultPrevented) return
      switch (event.key) {
        case 'd': this.toggleDebugMode()
      }
    },
    toggleDebugMode() {
      document.documentElement.toggleAttribute('debug')
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyup)
  }
}
