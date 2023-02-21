export default {
  bind(el, binding) {
    const attribute = binding.arg
    const obfuscated = binding.value
    binding.unobfuscate = () => {
      const unobfuscated = obfuscated.replace('@@', '.')
      el.setAttribute(attribute, unobfuscated)
    }
    el.addEventListener('mouseover', binding.unobfuscate, { once: true })
    el.setAttribute(attribute, obfuscated)
  },
  unbind(el, binding) {
    el.removeEventListener('mouseover', binding.unobfuscate)
  }
}
