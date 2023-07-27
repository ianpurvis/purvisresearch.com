<template>
  <div class="mask" ref="maskRef">
    <div class="content" ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue'

export default {
  props: {
    maxScale: {
      type: Number,
      default: Number.MAX_VALUE,
    }
  },
  setup(props) {
    const contentRef = ref(null)
    const maskRef = ref(null)
    const scale = ref(1.0)
    const height = ref('unset')

    let observer
    onMounted(async () => {
      observer = new ResizeObserver(async () => {
        const { value: content } = contentRef
        const { value: mask } = maskRef

        scale.value = 1.0
        await nextTick()
        let maskBounds = mask.getBoundingClientRect()
        let contentBounds = content.getBoundingClientRect()

        // TODO Calculate scale based on orientation and aspect fit / aspect fill
        scale.value = Math.min(props.maxScale, maskBounds.right / contentBounds.right)

        // TODO Revise height workaround to avoid observer recursion
        // await nextTick()
        // contentBounds = content.getBoundingClientRect()
        // height.value = `${contentBounds.height}px`
      })
      observer.observe(maskRef.value)
    })
    onBeforeUnmount(() => observer.unobserve(maskRef.value))

    return { contentRef, height, maskRef, scale }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: inline-block;
  transform: scale(v-bind(scale));
  transform-origin: top left;
}

.mask {
  height: v-bind(height);
}
</style>
