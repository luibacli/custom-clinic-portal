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
      <p class="text-sm text-slate-500">
        If <strong>{{ forgotEmail }}</strong> is registered, a reset link has been sent.
      </p>
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

  <!-- Page Shell -->
  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

    <!-- ─────────────────────────────────────────────
         LEFT — Branding panel (desktop only)
    ───────────────────────────────────────────── -->
    <div class="relative hidden lg:flex flex-col justify-center overflow-hidden px-10 xl:px-16 py-12">

      <!-- Base gradient — driven by --brand CSS var -->
      <div class="absolute inset-0" :style="brandGradientStyle"></div>

      <!-- Dot pattern overlay -->
      <div class="absolute inset-0 dot-pattern opacity-30"></div>

      <!-- Ambient glow blobs -->
      <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl pointer-events-none" style="background: rgba(var(--brand-rgb, 37,99,235), 0.25)"></div>
      <div class="absolute bottom-0 right-0 h-64 w-64 rounded-full blur-3xl pointer-events-none" style="background: rgba(var(--brand-rgb, 37,99,235), 0.15)"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-lg">

        <!-- Status badge -->
        <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]"></span>
          Secure Patient Access
        </div>

        <!-- Clinic / brand name -->
        <h1 class="mt-5 text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
          {{ tenantDisplayName }}
        </h1>
        <p v-if="tenantResolved && tenant" class="mt-2 text-sm font-medium text-blue-200/70 tracking-widest uppercase">
          Powered by My Clinic Access
        </p>

        <p class="mt-4 text-base text-white/80 leading-relaxed max-w-md">
          {{ branding.welcomeMessage || 'A secure, clinic-managed digital platform for patient registration, identity management, and real-time clinic communication.' }}
        </p>

        <!-- Clinic contact info -->
        <div v-if="branding.phone || branding.email || branding.address" class="mt-4 flex flex-wrap gap-2">
          <span v-if="branding.phone" class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-phone text-white/70 text-[10px]"></i>
            {{ branding.phone }}
          </span>
          <span v-if="branding.email" class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-envelope text-white/70 text-[10px]"></i>
            {{ branding.email }}
          </span>
          <span v-if="branding.address" class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-map-marker text-white/70 text-[10px]"></i>
            {{ branding.address }}
          </span>
        </div>

        <!-- SVG Illustration — Patient Digital ID Card -->
        <div class="mt-8 mb-8">
          <svg viewBox="0 0 320 168" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm drop-shadow-2xl" aria-hidden="true">
            <!-- Card shadow -->
            <rect x="12" y="16" width="296" height="148" rx="18" fill="rgba(0,0,0,0.25)"/>
            <!-- Card body -->
            <rect x="8" y="8" width="296" height="148" rx="18" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
            <!-- Card header band -->
            <rect x="8" y="8" width="296" height="52" rx="18" fill="rgba(255,255,255,0.10)"/>
            <rect x="8" y="40" width="296" height="20" fill="rgba(255,255,255,0.10)"/>
            <!-- Avatar -->
            <circle cx="46" cy="34" r="16" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
            <circle cx="46" cy="29" r="7" fill="rgba(255,255,255,0.45)"/>
            <path d="M30 50 Q30 42 46 42 Q62 42 62 50" fill="rgba(255,255,255,0.45)"/>
            <!-- Name -->
            <rect x="74" y="25" width="90" height="9" rx="4.5" fill="rgba(255,255,255,0.50)"/>
            <rect x="74" y="38" width="60" height="7" rx="3.5" fill="rgba(255,255,255,0.25)"/>
            <!-- Verified chip -->
            <rect x="226" y="20" width="66" height="26" rx="13" fill="rgba(52,211,153,0.20)" stroke="rgba(52,211,153,0.40)" stroke-width="1"/>
            <circle cx="241" cy="33" r="5" fill="rgba(52,211,153,0.80)"/>
            <path d="M238.5 33 L240.5 35 L244 31" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="250" y="29" width="32" height="8" rx="4" fill="rgba(52,211,153,0.55)"/>
            <!-- Divider -->
            <line x1="24" y1="72" x2="296" y2="72" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <!-- Info labels -->
            <rect x="24" y="80" width="50" height="6" rx="3" fill="rgba(255,255,255,0.20)"/>
            <rect x="24" y="90" width="78" height="9" rx="4.5" fill="rgba(255,255,255,0.42)"/>
            <rect x="118" y="80" width="50" height="6" rx="3" fill="rgba(255,255,255,0.20)"/>
            <rect x="118" y="90" width="64" height="9" rx="4.5" fill="rgba(255,255,255,0.42)"/>
            <rect x="208" y="80" width="50" height="6" rx="3" fill="rgba(255,255,255,0.20)"/>
            <rect x="208" y="90" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.42)"/>
            <!-- Divider -->
            <line x1="24" y1="110" x2="296" y2="110" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <!-- QR block -->
            <rect x="24" y="120" width="36" height="36" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.20)" stroke-width="1"/>
            <rect x="29" y="125" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.50)"/>
            <rect x="38" y="125" width="5" height="5" rx="1" fill="rgba(255,255,255,0.30)"/>
            <rect x="44" y="125" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.50)"/>
            <rect x="29" y="134" width="5" height="5" rx="1" fill="rgba(255,255,255,0.30)"/>
            <rect x="36" y="134" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.50)"/>
            <rect x="44" y="134" width="5" height="5" rx="1" fill="rgba(255,255,255,0.30)"/>
            <rect x="29" y="141" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.50)"/>
            <rect x="38" y="143" width="5" height="5" rx="1" fill="rgba(255,255,255,0.30)"/>
            <rect x="44" y="141" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.50)"/>
            <!-- REF ID area -->
            <rect x="72" y="120" width="40" height="6" rx="3" fill="rgba(255,255,255,0.20)"/>
            <rect x="72" y="130" width="110" height="12" rx="6" fill="rgba(255,255,255,0.45)"/>
            <rect x="72" y="146" width="70" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
            <!-- Shield icon -->
            <rect x="240" y="116" width="52" height="40" rx="12" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <path d="M266 125 C266 125 258 128.5 258 135 L258 139.5 L266 143 L274 139.5 L274 135 C274 128.5 266 125 266 125Z" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.40)" stroke-width="1"/>
            <path d="M262 135 L264.5 138 L270 132" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Trust chips -->
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-shield text-emerald-300 text-[10px]"></i>
            PDPA Compliant
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-lock text-emerald-300 text-[10px]"></i>
            Encrypted Access
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i class="pi pi-building text-emerald-300 text-[10px]"></i>
            Clinic-Managed Accounts
          </span>
        </div>

      </div>
    </div>

    <!-- ─────────────────────────────────────────────
         RIGHT — Sign-in panel
    ───────────────────────────────────────────── -->
    <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

      <!-- Mobile branding strip — hidden on desktop -->
      <div class="lg:hidden flex items-center gap-3 mb-8 self-start w-full max-w-md">
        <div class="h-10 w-10 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
          <img
            v-if="tenantLogoUrl"
            :src="tenantLogoUrl"
            alt="Clinic Logo"
            class="h-full w-full object-cover"
          />
          <Avatar  v-else image="/myclinicaccess_logo.png" size="large"/>
        </div>
        <div class="min-w-0">
          <p class="font-bold text-slate-800 text-base leading-tight truncate">{{ tenantDisplayName }}</p>
          <p class="text-xs text-slate-400">My Clinic Access</p>
        </div>
      </div>

      <!-- Form card -->
      <Transition appear name="card-rise">
        <div class="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

          <!-- Card header -->
          <div class="mb-7 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-slate-400 font-medium">Welcome back</p>
              <h2 class="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Sign in to continue
              </h2>
            </div>

            <!-- Clinic logo -->
            <div class="shrink-0 h-14 w-14 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                v-if="tenantLogoUrl"
                :src="tenantLogoUrl"
                alt="Clinic Logo"
                class="h-full w-full object-cover"
              />
                <Avatar v-else image="/myclinicaccess_logo.png" size="large"/>
            </div>
          </div>

          <!-- Context badge -->
          <div class="mb-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
              <i class="pi pi-building text-white text-xs"></i>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">{{ tenantDisplayName }}</p>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ tenantResolved && tenant
                    ? 'Your clinic manages your account access.'
                    : 'Sign in to access your clinic portal.' }}
              </p>
            </div>
          </div>

          <!-- Form -->
          <form class="space-y-5" @submit.prevent="handleLogin">

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Email address</label>
              <InputText
                v-model="loginForm.email"
                type="email"
                class="w-full"
                :class="{ 'input-error': loginError }"
                placeholder="you@example.com"
                autocomplete="email"
                @input="loginError = ''"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <div class="relative">
                <InputText
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pr-12"
                  :class="{ 'input-error': loginError }"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  @input="loginError = ''"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-slate-400 hover:text-slate-600 transition-colors"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-base"></i>
                </button>
              </div>

              <!-- Inline error -->
              <Transition name="err-slide">
                <p v-if="loginError" class="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1">
                  <i class="pi pi-exclamation-circle text-[11px]"></i>
                  {{ loginError }}
                </p>
              </Transition>
            </div>

            <!-- Forgot password -->
            <div class="flex justify-end">
              <button
                type="button"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                @click="openForgotPassword"
              >
                Forgot password?
              </button>
            </div>

            <!-- Submit -->
            <Button
              label="Sign in"
              icon="pi pi-arrow-right"
              icon-pos="right"
              :loading="isLoggingIn"
              :disabled="!loginForm.email.trim() || !loginForm.password.trim()"
              type="submit"
              class="w-full !rounded-2xl !py-3 !text-sm !font-semibold"
            />

          </form>

          <!-- Footer -->
          <div class="mt-7 border-t border-slate-100 pt-5 text-center space-y-2">
            <p class="text-xs text-slate-400">
              Protected access — authorized users only.
            </p>
            <div class="flex items-center justify-center gap-4 text-xs text-slate-400">
              <router-link to="/privacy" class="hover:text-blue-600 transition-colors">Privacy Policy</router-link>
              <span class="text-slate-200">&bull;</span>
              <router-link to="/terms" class="hover:text-blue-600 transition-colors">Terms</router-link>
              <span class="text-slate-200">&bull;</span>
              <router-link to="/contact" class="hover:text-blue-600 transition-colors">Contact</router-link>
            </div>
          </div>

        </div>
      </Transition>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import { useBranding } from '../composables/useBranding'
import router from '../router'

const toast = useToast()
const authTenantStore = useAuthTenantStore()
const tenantStore = useTenantStore()
const { branding, brandGradientStyle } = useBranding()

const { login } = authTenantStore
const { loginForm } = storeToRefs(authTenantStore)
const { tenant, tenantResolved } = storeToRefs(tenantStore)

const showPassword   = ref(false)
const isLoggingIn    = ref(false)
const loginError     = ref('')
const forgotDialogVisible = ref(false)
const forgotEmail    = ref('')
const forgotLoading  = ref(false)
const forgotSent     = ref(false)

const tenantDisplayName = computed(() => {
  if (!tenant.value) return 'My Clinic Access'
  return (
    tenant.value.name ||
    tenant.value.domain ||
    tenant.value.subdomain ||
    'My Clinic Access'
  )
})

const tenantLogoUrl = computed(() => tenant.value?.tenantLogo?.url || '')

const openForgotPassword = () => {
  forgotEmail.value = ''
  forgotSent.value  = false
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
  loginError.value  = ''
  isLoggingIn.value = true

  const res = await login(tenantResolved.value, tenant.value?.id)
  isLoggingIn.value = false

  if (!res?.success) {
    loginError.value = res?.message || 'Invalid email or password.'
    return
  }
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
/* Dot pattern for left panel */
.dot-pattern {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 22px 22px;
}

/* Input error state */
:deep(.input-error .p-inputtext),
:deep(.input-error.p-inputtext) {
  border-color: rgb(239 68 68) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}

/* Input base styles */
:deep(.p-inputtext) {
  border-radius: 0.875rem;
  padding: 0.8rem 1rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  font-size: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  border-color: rgb(59 130 246);
}

:deep(.p-inputtext::placeholder) {
  color: rgb(148 163 184);
}

/* Button override */
:deep(.p-button) {
  border-radius: 1rem;
}

/* Card entrance animation */
.card-rise-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.card-rise-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

/* Inline error animation */
.err-slide-enter-active,
.err-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.err-slide-enter-from,
.err-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
