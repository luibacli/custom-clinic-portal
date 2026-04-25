<template>
  <div v-if="isLoading" class="flex h-64 w-full items-center justify-center">
    <Loading />
  </div>

  <div
    v-else
    class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-gray-950 dark:via-slate-900 dark:to-black px-3 py-6 sm:px-4 sm:py-8"
  >
    <div class="mx-auto w-full max-w-md sm:max-w-xl lg:max-w-5xl">
      <div
        class="relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <!-- Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400"></div>
        <div class="absolute inset-0 bg-black/10"></div>

        <!-- Decorative Blobs -->
        <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/15 blur-3xl"></div>
        <div class="absolute top-8 right-0 h-40 w-40 rounded-full bg-cyan-100/30 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-sky-200/20 blur-3xl"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <!-- LEFT SIDE -->
          <div class="p-5 sm:p-6 lg:p-8 text-white">
            <!-- Top Row -->
            <div class="flex items-start justify-between gap-4">
              <!-- Badge -->
              <div
                class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] sm:text-xs backdrop-blur-md border border-white/20 shadow-sm"
              >
                <span class="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]"></span>
                Verified Patient Record
              </div>

              <!-- Clinic Logo -->
              <div
                class="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md shadow-lg overflow-hidden"
              >
                <img
                  v-if="tenantLogoUrl"
                  :src="tenantLogoUrl"
                  alt="Clinic Logo"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex items-center justify-center h-full w-full">
                  <i class="pi pi-building text-lg sm:text-xl text-white"></i>
                </div>
              </div>
            </div>

            <!-- Header -->
            <div class="mt-5 flex items-start justify-between gap-3">
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                  Patient Digital ID
                </h1>
                <p class="mt-2 max-w-sm text-xs sm:text-sm text-blue-50/90 leading-5">
                  Secure patient identity card for portal access, YAKAP verification,
                  and clinic reference.
                </p>
              </div>

              <div
                class="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md shadow-lg"
              >
                <i class="pi pi-id-card text-lg sm:text-xl"></i>
              </div>
            </div>

            <!-- Identity card -->
            <div class="mt-5 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] shrink-0 items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/15 text-lg sm:text-xl font-bold shadow-md"
                >
                  {{ initials }}
                </div>

                <div class="min-w-0">
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-blue-50/80">
                    Patient Name
                  </p>
                  <h2 class="mt-1 truncate text-lg sm:text-xl font-semibold">
                    {{ fullName || 'No Name Available' }}
                  </h2>
                  <p class="mt-1 truncate text-xs sm:text-sm text-blue-50/85">
                    {{ user.email || 'No email available' }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs"
                >
                  <i class="pi pi-shield text-[10px]"></i>
                  Active
                </span>

                <span
                  class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs"
                >
                  <i class="pi pi-heart text-[10px]"></i>
                  YAKAP Enrolled
                </span>
              </div>
            </div>

            <!-- Facility -->
            <div class="mt-5 rounded-[1.25rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 overflow-hidden"
                >
                  <img
                    v-if="tenantLogoUrl"
                    :src="tenantLogoUrl"
                    alt="Facility Logo"
                    class="h-full w-full object-cover"
                  />
                  <i v-else class="pi pi-building text-white text-base"></i>
                </div>

                <div class="min-w-0">
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-blue-50/80">
                    YAKAP Facility
                  </p>
                  <p class="mt-1 text-sm sm:text-base lg:text-lg font-semibold leading-snug truncate">
                    {{ tenantName || 'Health Facility' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p class="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-blue-50/70">
                  Card Status
                </p>
                <p class="mt-1 text-xs sm:text-sm font-semibold text-emerald-300">
                  Verified & Active
                </p>
              </div>

              <div class="text-right">
                <p class="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-blue-50/70">
                  Card Type
                </p>
                <p class="mt-1 text-xs sm:text-sm font-semibold">
                  Digital ID
                </p>
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE -->
          <div class="bg-white/95 dark:bg-slate-950/85 backdrop-blur-2xl p-5 sm:p-6 lg:p-8">
            <div class="mb-5 flex items-start justify-between gap-3">
              <div>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Patient Information
                </p>
                <h2 class="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  ID Details
                </h2>
                <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Registered portal details.
                </p>
              </div>

              <div
                class="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm sm:text-base font-bold text-white shadow-lg"
              >
                ID
              </div>
            </div>

            <div class="space-y-3">
              <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Full Name
                </p>
                <p class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white break-words">
                  {{ fullName || '—' }}
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                    Birthday
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white break-words">
                    {{ user.birthday || '—' }}
                  </p>
                </div>

                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                    Phone Number
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white break-words">
                    {{ user.phone || '—' }}
                  </p>
                </div>
              </div>

              <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Email Address
                </p>
                <p class="text-sm font-semibold text-slate-900 dark:text-white break-all">
                  {{ user.email || '—' }}
                </p>
              </div>

              <div class="rounded-[1rem] border border-sky-100 dark:border-sky-400/20 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-500/10 dark:to-cyan-500/10 px-4 py-3.5 shadow-sm">
                <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  PIN
                </p>
                <p class="text-sm sm:text-base font-bold tracking-[0.12em] text-sky-600 dark:text-sky-300 break-all">
                  {{ user.pin || '—' }}
                </p>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5">
                <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Status
                </p>
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    Active
                  </p>
                </div>
              </div>

              <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5">
                <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Card Type
                </p>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  YAKAP Digital ID
                </p>
              </div>
            </div>

            <div class="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Issued For
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Patient Portal Access
                </p>
              </div>

              <div class="sm:text-right">
                <p class="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">
                  Reference
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  DIGITAL VERIFIED ID
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import { storeToRefs } from 'pinia'
import Loading from '../components/Loading.vue'

const authTenantStore = useAuthTenantStore()
const tenantStore = useTenantStore()

const { fetchTenant } = tenantStore
const { fetchUserTenant } = authTenantStore
const { tenant } = storeToRefs(tenantStore)

const tenantId = ref(null)
const isLoading = ref(false)
const tenantName = ref('')

const tenantLogoUrl = computed(() => {
  return tenant.value?.tenantLogo?.url || null
})

const user = ref({
  email: '',
  pin: '',
  firstName: '',
  middleName: '',
  lastName: '',
  birthday: '',
  phone: ''
})

const fullName = computed(() => {
  return [user.value.firstName, user.value.middleName, user.value.lastName]
    .filter(Boolean)
    .join(' ')
})

const initials = computed(() => {
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last ? (first + last).toUpperCase() : 'ID')
})

onMounted(async () => {
  isLoading.value = true
  try {
    tenantId.value = localStorage.getItem('tenantId')

    if (tenantId.value) {
      const res = await fetchTenant(tenantId.value)
      tenantName.value = res?.data?.name || ''
    }

    const result = await fetchUserTenant()
    user.value = result.data  
  } catch (error) {
    console.error('Error fetching user', error)
  } finally {
    isLoading.value = false
  }
})
</script>