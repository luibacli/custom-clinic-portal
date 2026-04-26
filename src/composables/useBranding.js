import { computed } from 'vue'
import { useTenantStore } from '../stores/tenantStore'

const DEFAULT_COLOR = '#2563eb'

const isValidHex = (hex) => /^#[0-9a-fA-F]{6}$/.test(hex)

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`
}

const adjustBrightness = (hex, factor) => {
  const h = hex.replace('#', '')
  const r = Math.min(255, Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * factor)))
  const g = Math.min(255, Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * factor)))
  const b = Math.min(255, Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * factor)))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export const applyBrandingVars = (branding) => {
  const color = (branding?.primaryColor && isValidHex(branding.primaryColor))
    ? branding.primaryColor
    : DEFAULT_COLOR

  const root = document.documentElement
  root.style.setProperty('--brand',       color)
  root.style.setProperty('--brand-rgb',   hexToRgb(color))
  root.style.setProperty('--brand-dark',  adjustBrightness(color, 0.65))
  root.style.setProperty('--brand-light', adjustBrightness(color, 1.35))
}

export function useBranding() {
  const tenantStore = useTenantStore()

  const branding = computed(() => tenantStore.tenant?.branding ?? {})
  const primaryColor = computed(() => branding.value.primaryColor || DEFAULT_COLOR)

  const brandGradientStyle = computed(() => ({
    background: `linear-gradient(135deg, var(--brand-dark, #1e40af) 0%, var(--brand, #2563eb) 100%)`
  }))

  return { branding, primaryColor, brandGradientStyle }
}
