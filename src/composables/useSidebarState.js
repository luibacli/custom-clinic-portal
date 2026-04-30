import { ref } from 'vue'

const collapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

export function useSidebarState() {
  const toggle = () => {
    collapsed.value = !collapsed.value
    localStorage.setItem('sidebarCollapsed', String(collapsed.value))
  }
  return { collapsed, toggle }
}
