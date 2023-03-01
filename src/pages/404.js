import Stretch from '~/components/stretch.vue'

export default {
  components: {
    Stretch
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
  }
}
