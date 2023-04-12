<template>
  <main>
    <Stretch class="error">404</Stretch>
  </main>
</template>

<script>
import { useHead } from '#imports'
import Stretch from '~/components/stretch.vue'

export const title = 'Not Found | Purvis Research'

export default {
  components: {
    Stretch
  },
  setup() {
    useHead({
      title
    })
  }
}
</script>

<style lang="scss" scoped>
.error {
  height: 100vh;
  width: 100vw;
}
</style>
