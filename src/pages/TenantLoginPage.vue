<template>
  <Toast />

  <!-- Forgot Password Dialog -->
  <Dialog
    v-model:visible="forgotDialogVisible"
    modal
    :draggable="false"
    header="Reset Password"
    :style="{ width: 'min(440px, 95vw)' }"
  >
    <div v-if="!forgotSent" class="space-y-4 py-2">
      <p class="text-sm text-slate-500">Enter your account email and we'll send you a password reset link.</p>
      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Email Address</label>
        <InputText
          v-model="forgotEmail"
          type="email"
          placeholder="Enter your email"
          class="w-full"
          @keyup.enter="handleForgotPassword"
        />
      </div>
    </div>

    <div v-else class="py-4 text-center space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
        <i class="pi pi-check-circle text-2xl"></i>
      </div>
      <p class="font-semibold text-slate-800">Check your email</p>
      <p class="text-sm text-slate-500">If <strong>{{ forgotEmail }}</strong> is registered, a reset link has been sent. Check your inbox.</p>
    </div>

    <template #footer>
      <Button label="Close" severity="secondary" outlined @click="forgotDialogVisible = false" />
      <Button
        v-if="!forgotSent"
        label="Send Reset Link"
        :loading="forgotLoading"
        :disabled="!forgotEmail.trim()"
        @click="handleForgotPassword"
      />
    </template>
  </Dialog>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100"
  >
    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <!-- LEFT / BRANDING -->
      <div
        class="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-14 flex items-center"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500"></div>
        <div class="absolute inset-0 bg-black/10"></div>

        <!-- decorative blobs -->
        <div class="absolute -top-8 -left-8 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-36 w-36 sm:h-56 sm:w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>
        <div class="absolute top-1/3 right-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-blue-200/10 blur-2xl"></div>

        <div class="relative z-10 mx-auto w-full max-w-xl text-white">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] sm:text-sm backdrop-blur-md shadow-sm"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-300"></span>
            Secure Patient Access
          </div>

          <h1 class="mt-4 text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
            {{ tenantDisplayName }} PORTAL
          </h1>

          <p class="mt-3 text-base sm:text-lg xl:text-xl font-medium text-blue-50">
            Your Digital Patient ID System
          </p>

          <p class="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-blue-100/90">
            A secure and clinic-managed digital platform designed to simplify patient registration,
            identity management, and access to healthcare services.
          </p>

          <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-lg">
              <p class="text-sm font-semibold">Future-Ready Healthcare Access</p>
              <p class="mt-1 text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                A modern platform designed to grow with healthcare innovation.
              </p>
            </div>

            <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-lg">
              <p class="text-sm font-semibold">Inbox & Notifications</p>
              <p class="mt-1 text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                Stay updated with important clinic messages and healthcare reminders.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT / LOGIN -->
      <div class="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div
          class="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/90 p-5 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        >
          <div class="mb-6 flex items-start justify-between gap-3">
            <div>
              <p class="mb-1 text-sm text-slate-500">Welcome back</p>
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Login to your account
              </h2>
            </div>

            <div
              class="shrink-0 rounded-2xl bg-slate-50 p-2 shadow-sm border border-slate-200 h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="tenantLogoUrl"
                :src="tenantLogoUrl"
                alt="Tenant Logo"
                class="h-full w-full object-cover rounded-xl"
              />
              <CareBoardSVG v-else class="h-9 w-9 sm:h-10 sm:w-10" />
            </div>
          </div>

          <div class="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p class="text-sm font-medium text-blue-800">
              <span class="font-bold">{{ tenantDisplayName }}</span>
            </p>
            <p class="mt-1 text-xs text-blue-700/80">
              Please sign in using your authorized credentials.
            </p>
          </div>

          <form class="space-y-4 sm:space-y-5" @submit.prevent="handleLogin">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <InputText
                v-model="loginForm.email"
                type="email"
                class="w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div class="relative">
                <InputText
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pr-14"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-700"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 text-sm">
              <label class="flex cursor-pointer items-center gap-2 text-slate-600">
                <input v-model="remember" type="checkbox" class="rounded" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                class="font-medium text-blue-600 transition hover:text-blue-700"
                @click="openForgotPassword"
              >
                Forgot password?
              </button>
            </div>

            <InfoBtn
              label="Login"
              class="w-full !rounded-xl !py-3"
              type="submit"
            />
          </form>

          <div class="mt-6 border-t border-slate-200 pt-4">
            <p class="text-center text-xs sm:text-sm text-slate-500">
              Protected access for authorized users only.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InfoBtn from '../components/InfoBtn.vue'
import CareBoardSVG from '../components/CareBoardSVG.vue'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import router from '../router'

const toast = useToast()
const authTenantStore = useAuthTenantStore()
const tenantStore = useTenantStore()

const { login } = authTenantStore
const { loginForm } = storeToRefs(authTenantStore)
const { tenant, tenantResolved } = storeToRefs(tenantStore)

const showPassword = ref(false)
const remember = ref(false)
const forgotDialogVisible = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotSent = ref(false)

const tenantDisplayName = computed(() => {
  if (!tenant.value) return 'HEALTH FACILITY PORTAL'

  return (
    tenant.value.name ||
    tenant.value.domain ||
    tenant.value.subdomain ||
    'Tenant Portal'
  )
})

const tenantLogoUrl = computed(() => {
  return (
    tenant.value?.tenantLogo?.url ||
    ''
  )
})

const openForgotPassword = () => {
  forgotEmail.value = ''
  forgotSent.value = false
  forgotDialogVisible.value = true
}

const handleForgotPassword = async () => {
  if (!forgotEmail.value.trim()) return

  forgotLoading.value = true
  const result = await authTenantStore.forgotPassword(forgotEmail.value.trim())
  forgotLoading.value = false

  if (result.success) {
    forgotSent.value = true
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 4000 })
  }
}

const handleLogin = async () => {
  console.log("isTenant:,", tenantResolved.value);
  console.log("tenant ID", tenant.value?.id);
  const res = await login(tenantResolved.value, tenant.value?.id)

  if (!res?.success) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: res?.message || 'Unable to login.',
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Login Success',
    detail: res?.message || 'Login successful.',
    life: 3000
  })

  if (res.role === 'patient') {
    router.replace('/patient')
  } else if (res.role === 'dev') {
    router.replace('/dev')
  } else {
    router.replace('/tenant-home')
  }
}
</script>

<style scoped>
:deep(.p-inputtext) {
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  transition: all 0.2s ease;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  border-color: rgb(59 130 246);
}
</style>