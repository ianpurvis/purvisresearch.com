export default {
  beforeDestroy() {
    window.removeEventListener('resize', this.layoutAspects)
  },
  data() {
    return {
      title: 'page not found - purvis research'
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    fitHorizontal(element) {
      element.classList.remove('fit-vertical')
      element.classList.add('fit-horizontal')
    },
    fitVertical(element) {
      element.classList.remove('fit-horizontal')
      element.classList.add('fit-vertical')
    },
    layoutAspects() {
      let aspectFunc
      if (window.innerHeight > window.innerWidth) {
        aspectFunc = this.fitHorizontal
      } else {
        aspectFunc = this.fitVertical
      }
      document.querySelectorAll('.aspect').forEach(aspectFunc)
    }
  },
  mounted() {
    this.layoutAspects()
    window.addEventListener('resize', this.layoutAspects)
  }
}
