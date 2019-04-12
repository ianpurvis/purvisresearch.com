export default {
  computed: {
    contentScale() {
      return this.contentWidth > 0 ? this.elementWidth / this.contentWidth : 0
    },
    style() {
      return {
        transform: `scale(${this.contentScale})`,
      }
    }
  },
  data() {
    return {
      elementWidth: 0,
      contentWidth: 0,
    }
  },
  methods: {
    watchDOM() {
      if (this._isDestroyed || this._isBeingDestroyed) return
      this.elementWidth = this.$el.clientWidth
      this.contentWidth = this.$refs.content.clientWidth
      window.requestAnimationFrame(this.watchDOM)
    },
  },
  mounted() {
    this.$nextTick(this.watchDOM)
  },
}
