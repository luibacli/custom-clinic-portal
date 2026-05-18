function capitalizeWords(value) {
  return value.replace(/\b\w/g, c => c.toUpperCase())
}

export default {
  mounted(el) {
    function handler(e) {
      if (el._capitalizeLock) return
      const value = e.target.value
      const transformed = capitalizeWords(value)
      if (transformed === value) return
      const start = e.target.selectionStart
      el._capitalizeLock = true
      e.target.value = transformed
      e.target.dispatchEvent(new Event('input', { bubbles: true }))
      e.target.setSelectionRange(start, start)
      el._capitalizeLock = false
    }
    el.addEventListener('input', handler)
    el._capitalizeCleanup = () => el.removeEventListener('input', handler)
  },
  unmounted(el) {
    el._capitalizeCleanup?.()
  }
}
