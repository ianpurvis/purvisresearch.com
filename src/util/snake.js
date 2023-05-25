import { getCurrentInstance } from 'vue'

export function snake(value) {
  const { proxy: { $options: { __scopeId } } } = getCurrentInstance()
  return value.replace(/\s/g, `<span class="underscore" ${__scopeId}>&nbsp;</span>`)
}
