import { onMounted, onUnmounted } from 'vue'
import '~/assets/stylesheets/debug.scss'

export function useDebug() {

  function handleKeyup({ defaultPrevented, key }) {
    if (!defaultPrevented && key === 'd') {
      document.documentElement.toggleAttribute('debug')
    }
  }

  onMounted(() => {
    window.addEventListener('keyup', handleKeyup)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyup)
  })
}
