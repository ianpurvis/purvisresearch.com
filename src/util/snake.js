import { getCurrentInstance } from 'vue'

export function snake(value) {
  const { proxy: { $options: { _scopeId } } } = getCurrentInstance()
  return value.replace(/\s/g, `<span class="underscore" ${_scopeId}>&nbsp;</span>`)
}
