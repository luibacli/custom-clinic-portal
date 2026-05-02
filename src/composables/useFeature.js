import { computed } from 'vue'
import { useTenantStore } from '../stores/tenantStore'
import { useAuthTenantStore } from '../stores/authTenantStore'

const DEFAULTS = {
  messaging:     true,
  appointments:  true,
  qrScan:        true,
  mails:         true,
  users:         true,
  analytics:     false,
  exportReports: false,
  smsReminders:  false,
}

export function useFeature() {
  const tenantStore = useTenantStore()
  const authTenantStore = useAuthTenantStore()

  /**
   * Returns a computed boolean for the given feature key.
   * Falls back to DEFAULTS when tenant data isn't loaded yet.
   */

 // Check if auth tenant data is available
  const isEnabled = (key) =>
    computed(() => {
      const val = tenantStore.tenant?.features?.[key] ?? authTenantStore.tenant?.data?.features?.[key]
      return val !== undefined ? val : (DEFAULTS[key] ?? false)
    })

  return { isEnabled }
}
