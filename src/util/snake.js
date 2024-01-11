import { getCurrentInstance } from 'vue'

export function snake(value) {
  const { proxy: { $options: { __scopeId } } } = getCurrentInstance()
  return value.replace(/\s/g, (match) => {
    return `<span class="underscore" ${__scopeId}>${match}</span>`
  })
}
