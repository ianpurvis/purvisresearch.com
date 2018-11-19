export default {
  methods: {
    unobfuscate() {
      let link = this.$refs.mailto
      link.href = link.href.replace('@@','.')
    }
  },
}

