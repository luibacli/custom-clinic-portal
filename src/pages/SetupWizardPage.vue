<template>
  <Toast />

  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg mb-4">
          <i class="pi pi-building text-2xl"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Set Up Your Clinic Portal</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Complete these steps to go live. Takes about 10 minutes.</p>
      </div>

      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-blue-600">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-xs text-slate-400">{{ progressPercent }}% complete</span>
        </div>
        <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <!-- Step labels -->
        <div class="flex justify-between mt-2">
          <span v-for="(label, i) in stepLabels" :key="label"
            class="text-[10px] font-medium transition-colors"
            :class="i + 1 <= currentStep ? 'text-blue-600' : 'text-slate-400'"
          >{{ label }}</span>
        </div>
      </div>

      <!-- Step Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">

        <!-- ─── Step 1: Branding ─── -->
        <div v-if="currentStep === 1" class="p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <i class="pi pi-palette text-base"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-white">Clinic Branding</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Set your brand color and welcome message.</p>
            </div>
          </div>

          <div class="space-y-5">
            <!-- Brand color presets -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Brand Color</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <button
                  v-for="color in colorPresets"
                  :key="color"
                  @click="form.branding.primaryColor = color"
                  class="h-8 w-8 rounded-full border-2 transition-all hover:scale-110"
                  :style="{ backgroundColor: color }"
                  :class="form.branding.primaryColor === color ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent'"
                ></button>
                <label class="h-8 w-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden"
                  title="Custom color"
                >
                  <i class="pi pi-plus text-[10px] text-slate-400"></i>
                  <input type="color" v-model="form.branding.primaryColor" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </label>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div class="h-8 w-8 rounded-lg shrink-0" :style="{ backgroundColor: form.branding.primaryColor }"></div>
                <span class="text-sm font-mono text-slate-700 dark:text-slate-300">{{ form.branding.primaryColor }}</span>
                <span class="ml-auto text-xs text-slate-400">Selected</span>
              </div>
            </div>

            <!-- Welcome message -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Welcome Message
                <span class="text-slate-400 font-normal ml-1">(shown on your dashboard)</span>
              </label>
              <textarea
                v-model="form.branding.welcomeMessage"
                rows="2"
                placeholder="e.g. Welcome to Primawell Clinic — your health is our priority."
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                maxlength="120"
              ></textarea>
              <p class="text-[10px] text-slate-400 mt-1 text-right">{{ (form.branding.welcomeMessage || '').length }}/120</p>
            </div>
          </div>
        </div>

        <!-- ─── Step 2: Contact Info ─── -->
        <div v-else-if="currentStep === 2" class="p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <i class="pi pi-map-marker text-base"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-white">Clinic Contact Details</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Shown to patients on your portal.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Clinic Address</label>
              <input
                v-model="form.branding.address"
                type="text"
                placeholder="e.g. 123 Rizal Ave, Quezon City"
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Clinic Phone</label>
              <input
                v-model="form.branding.phone"
                type="tel"
                placeholder="e.g. 09XX-XXX-XXXX"
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Clinic Contact Email</label>
              <input
                v-model="form.branding.email"
                type="email"
                placeholder="e.g. hello@yourclinic.com"
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        <!-- ─── Step 3: Logo ─── -->
        <div v-else-if="currentStep === 3" class="p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <i class="pi pi-image text-base"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-white">Clinic Logo</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Upload your logo. PNG or JPG, max 2MB. You can skip this.</p>
            </div>
          </div>

          <!-- Drop zone -->
          <label
            class="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
            :class="logoPreview
              ? 'border-blue-300 bg-blue-50 dark:bg-blue-500/10'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 hover:bg-blue-50/50'"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div v-if="logoPreview" class="flex flex-col items-center gap-3">
              <img :src="logoPreview" alt="Logo preview" class="max-h-28 max-w-[180px] object-contain rounded-xl shadow-md" />
              <span class="text-xs text-blue-600 font-medium">Click to replace</span>
            </div>
            <div v-else class="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
              <i class="pi pi-cloud-upload text-3xl"></i>
              <p class="text-sm font-medium">Drop your logo here or click to browse</p>
              <p class="text-xs">PNG, JPG · Max 2MB</p>
            </div>
            <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
          </label>

          <p v-if="logoError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
            <i class="pi pi-exclamation-circle text-xs"></i> {{ logoError }}
          </p>
        </div>

        <!-- ─── Step 4: Done ─── -->
        <div v-else-if="currentStep === 4" class="p-6 sm:p-8 text-center">
          <div class="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <i class="pi pi-check text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Portal Is Ready!</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Setup complete. Here's what you configured — and what to do next.
          </p>

          <!-- Summary -->
          <div class="text-left bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 mb-8">
            <div class="flex items-center gap-3 px-4 py-3">
              <div class="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                :class="form.branding.primaryColor ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'"
              >
                <i class="pi pi-check text-[10px]"></i>
              </div>
              <span class="text-sm text-slate-700 dark:text-slate-300">Brand color set</span>
              <div class="ml-auto h-5 w-5 rounded-full border border-slate-300" :style="{ backgroundColor: form.branding.primaryColor }"></div>
            </div>
            <div class="flex items-center gap-3 px-4 py-3">
              <div class="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                :class="form.branding.phone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'"
              >
                <i :class="form.branding.phone ? 'pi pi-check' : 'pi pi-minus'" class="text-[10px]"></i>
              </div>
              <span class="text-sm text-slate-700 dark:text-slate-300">Contact info {{ form.branding.phone ? 'added' : 'skipped' }}</span>
            </div>
            <div class="flex items-center gap-3 px-4 py-3">
              <div class="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                :class="logoPreview ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'"
              >
                <i :class="logoPreview ? 'pi pi-check' : 'pi pi-minus'" class="text-[10px]"></i>
              </div>
              <span class="text-sm text-slate-700 dark:text-slate-300">Logo {{ logoPreview ? 'uploaded' : 'skipped — add later in Settings' }}</span>
            </div>
          </div>

          <!-- Next action cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <router-link to="/users"
              class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all group"
            >
              <div class="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i class="pi pi-users text-sm"></i>
              </div>
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">Add Staff</p>
              <p class="text-[10px] text-slate-400">Invite your team</p>
            </router-link>
            <router-link to="/patients"
              class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-all group"
            >
              <div class="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i class="pi pi-user-plus text-sm"></i>
              </div>
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">Register Patient</p>
              <p class="text-[10px] text-slate-400">First digital ID</p>
            </router-link>
            <router-link to="/tenant-home"
              class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-500/10 transition-all group"
            >
              <div class="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i class="pi pi-home text-sm"></i>
              </div>
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">Dashboard</p>
              <p class="text-[10px] text-slate-400">Go to home</p>
            </router-link>
          </div>
        </div>

        <!-- ─── Footer nav ─── -->
        <div v-if="currentStep < 4" class="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            v-if="currentStep > 1"
            @click="currentStep--"
            class="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <i class="pi pi-arrow-left text-xs"></i> Back
          </button>
          <span v-else></span>

          <div class="flex items-center gap-3">
            <button
              v-if="currentStep === 3"
              @click="skipLogo"
              class="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Skip for now
            </button>
            <button
              @click="handleNext"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
              {{ currentStep === 3 ? 'Upload & Finish' : 'Save & Continue' }}
              <i v-if="!saving" class="pi pi-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Skip entire wizard -->
      <div v-if="currentStep < 4" class="text-center mt-5">
        <router-link
          to="/tenant-home"
          class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline-offset-2 hover:underline"
        >
          Skip setup — I'll configure this later
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTenantStore } from '../stores/tenantStore'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { storeToRefs } from 'pinia'

const toast = useToast()
const tenantStore = useTenantStore()
const authTenantStore = useAuthTenantStore()
const { tenant } = storeToRefs(authTenantStore)

const currentStep = ref(1)
const totalSteps = 3
const saving = ref(false)

const stepLabels = ['Branding', 'Contact', 'Logo']

const progressPercent = computed(() =>
  Math.round(((currentStep.value - 1) / totalSteps) * 100)
)

const colorPresets = [
  '#2563EB', '#0891B2', '#059669', '#7C3AED',
  '#DB2777', '#EA580C', '#CA8A04', '#374151',
]

const form = ref({
  branding: {
    primaryColor: tenant.value?.branding?.primaryColor || '#2563EB',
    welcomeMessage: tenant.value?.branding?.welcomeMessage || '',
    address: tenant.value?.branding?.address || '',
    phone: tenant.value?.branding?.phone || '',
    email: tenant.value?.branding?.email || '',
  },
})

const logoInput = ref(null)
const logoFile = ref(null)
const logoPreview = ref(tenant.value?.tenantLogo?.url || null)
const logoError = ref('')

const tenantId = computed(() =>
  tenant.value?._id || tenant.value?.id || localStorage.getItem('tenantId')
)

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  validateAndSetLogo(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files?.[0]
  validateAndSetLogo(file)
}

const validateAndSetLogo = (file) => {
  logoError.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    logoError.value = 'Please upload an image file (PNG or JPG).'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    logoError.value = 'File is too large. Maximum size is 2MB.'
    return
  }
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
}

const saveBranding = async () => {
  const id = tenantId.value
  if (!id) throw new Error('Tenant ID not found')
  const result = await tenantStore.updateBranding(id, form.value.branding)
  if (!result.success) throw new Error(result.message || 'Failed to save branding')
}

const uploadLogo = async () => {
  if (!logoFile.value) return
  const id = tenantId.value
  if (!id) throw new Error('Tenant ID not found')
  await tenantStore.uploadLogo(id, logoFile.value)
}

const skipLogo = async () => {
  await finishSetup()
}

const finishSetup = async () => {
  saving.value = true
  try {
    if (logoFile.value) await uploadLogo()
    currentStep.value = 4
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Upload failed', detail: err.message, life: 3000 })
  } finally {
    saving.value = false
  }
}

const handleNext = async () => {
  saving.value = true
  try {
    if (currentStep.value === 1 || currentStep.value === 2) {
      await saveBranding()
      toast.add({ severity: 'success', summary: 'Saved', detail: 'Changes saved successfully.', life: 2000 })
      currentStep.value++
    } else if (currentStep.value === 3) {
      await finishSetup()
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Save failed', detail: err.message || 'Something went wrong.', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>
