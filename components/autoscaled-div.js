export default {
  computed: {
    contentScale() {
      if (this.contentWidth <= 0) return 0
      let scale = this.elementWidth / this.contentWidth
      return Math.min(scale, this.maxScale)
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
  props: {
    maxScale: {
      type: Number,
      default: Number.MAX_VALUE,
    },
  },
}
