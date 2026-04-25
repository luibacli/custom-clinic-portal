<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4"
  >
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl">
      <!-- Left Side -->
      <div
        class="hidden lg:flex flex-col justify-between p-8 xl:p-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white relative"
      >
        <div>
          <div
            class="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
          >
            <i class="pi pi-shield text-2xl"></i>
          </div>

          <h1 class="mt-6 text-3xl xl:text-4xl font-bold leading-tight">
            Secure Your Account
          </h1>

          <p class="mt-4 text-sm xl:text-base text-white/90 leading-6">
            For your security, you are required to change your password before accessing your account.
          </p>
        </div>

        <div class="space-y-4">
          <div class="rounded-2xl bg-white/15 backdrop-blur-md p-4 border border-white/10">
            <div class="flex items-start gap-3">
              <i class="pi pi-lock text-lg mt-0.5"></i>
              <div>
                <p class="font-semibold">First login protection</p>
                <p class="text-sm text-white/85 mt-1">
                  Your temporary or default password should be replaced immediately.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-white/15 backdrop-blur-md p-4 border border-white/10">
            <div class="flex items-start gap-3">
              <i class="pi pi-key text-lg mt-0.5"></i>
              <div>
                <p class="font-semibold">Use a strong password</p>
                <p class="text-sm text-white/85 mt-1">
                  Combine uppercase, lowercase, numbers, and symbols for better account security.
                </p>
              </div>
            </div>
          </div>

          <div class="text-xs text-white/80">
            Custom Clinic Portal PH — Secure Access
          </div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="p-6 md:p-8 xl:p-10">
        <div class="max-w-md mx-auto">
          <!-- Mobile header -->
          <div class="lg:hidden text-center mb-6">
            <div
              class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-center justify-center"
            >
              <i class="pi pi-shield text-2xl"></i>
            </div>
            <h2 class="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
              Change Password
            </h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You must update your password before continuing.
            </p>
          </div>

          <!-- Desktop header -->
          <div class="hidden lg:block mb-8">
            <p class="text-sm font-medium text-blue-600 dark:text-blue-300 uppercase tracking-[0.18em]">
              First Login Required Step
            </p>
            <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
              Change Your Password
            </h2>
            <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-6">
              Your account is using an initial password. Please create a new password to continue using the portal.
            </p>
          </div>

          <!-- User Summary -->
          <div
            class="mb-6 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold"
              >
                {{ initials }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-800 dark:text-white truncate">
                  {{ fullName }}
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {{ userEmail }}
                </p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Current Password
              </label>
              <Password
                v-model="form.currentPassword"
                :feedback="false"
                toggleMask
                placeholder="Enter current password"
                class="w-full"
                inputClass="w-full"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                New Password
              </label>
              <Password
                v-model="form.newPassword"
                toggleMask
                placeholder="Enter new password"
                class="w-full"
                inputClass="w-full"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm New Password
              </label>
              <Password
                v-model="form.confirmPassword"
                :feedback="false"
                toggleMask
                placeholder="Confirm new password"
                class="w-full"
                inputClass="w-full"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="errorMsg"
            class="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            <i class="pi pi-exclamation-triangle mr-2"></i>{{ errorMsg }}
          </div>

          <!-- Password Rules -->
          <div
            class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 px-4 py-4"
          >
            <div class="flex items-start gap-3">
              <i class="pi pi-info-circle text-amber-600 dark:text-amber-300 mt-0.5"></i>
              <div>
                <p class="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Password Requirements
                </p>
                <ul class="mt-2 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <li>At least 8 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 space-y-3">
            <Button
              label="Update Password and Continue"
              icon="pi pi-check"
              class="w-full rounded-xl"
              :loading="isLoading"
              :disabled="isLoading"
              @click="handleSubmit"
            />

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              severity="secondary"
              outlined
              class="w-full rounded-xl"
              :disabled="isLoading"
              @click="handleLogout"
            />
          </div>

          <!-- Footer note -->
          <p class="mt-5 text-center text-xs text-slate-400 dark:text-slate-500 leading-5">
            This step is required for account security. You will be redirected to your dashboard after successfully updating your password.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthTenantStore } from '../stores/authTenantStore'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()
const authTenantStore = useAuthTenantStore()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMsg = ref('')
const firstName = ref('')
const lastName = ref('')
const userEmail = ref('')

const initials = computed(() => {
  const f = firstName.value?.[0] || ''
  const l = lastName.value?.[0] || ''
  return `${f}${l}`.toUpperCase() || '?'
})

const fullName = computed(() => {
  return [firstName.value, lastName.value].filter(Boolean).join(' ') || 'Loading...'
})

const handleSubmit = async () => {
  errorMsg.value = ''

  if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
    errorMsg.value = 'All fields are required.'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMsg.value = 'New passwords do not match.'
    return
  }

  if (form.value.newPassword.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters.'
    return
  }

  authTenantStore.passwordForm.currentPassword = form.value.currentPassword
  authTenantStore.passwordForm.newPassword = form.value.newPassword
  authTenantStore.passwordForm.confirmPassword = form.value.confirmPassword

  isLoading.value = true

  const result = await authTenantStore.handleChangePassword()

  isLoading.value = false

  if (!result.success) {
    errorMsg.value = result.message || 'Failed to update password.'
    return
  }

  toast.add({ severity: 'success', summary: 'Password Updated', detail: 'Redirecting to your dashboard...', life: 3000 })

  const role = localStorage.getItem('tenantRole')
  setTimeout(() => {
    router.replace(role === 'patient' ? '/patient' : '/tenant-home')
  }, 1500)
}

const handleLogout = () => {
  authTenantStore.logout()
  router.replace('/signin')
}

onMounted(async () => {
  const result = await authTenantStore.fetchUserTenant()
  if (result?.success && result?.data) {
    firstName.value = result.data.firstName || ''
    lastName.value = result.data.lastName || ''
    userEmail.value = result.data.email || ''
  }
})
</script>

<style scoped>
:deep(.p-password),
:deep(.p-password-input),
:deep(.p-button) {
  width: 100%;
}

:deep(.p-password-input),
:deep(.p-button) {
  border-radius: 0.9rem;
}

:deep(.p-password-input) {
  width: 100%;
}
</style>
