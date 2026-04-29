<template>
  <Toast />

  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

    <!-- ─── LEFT — Value panel ─────────────────────────────── -->
    <div class="relative hidden lg:flex flex-col justify-center overflow-hidden px-10 xl:px-16 py-14">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500"></div>
      <div class="absolute inset-0 dot-pattern opacity-25"></div>
      <div class="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-lg">

        <!-- Logo -->
        <router-link to="/" class="inline-flex items-center gap-2.5 mb-10 group">
          <div class="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
            <i class="pi pi-building text-white text-base"></i>
          </div>
          <span class="text-white font-bold text-sm tracking-wide">My Clinic Access</span>
        </router-link>

        <!-- Headline -->
        <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm mb-5">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]"></span>
          30-Day Free Trial — No Credit Card
        </div>

        <h1 class="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
          Your clinic portal,<br>live in minutes.
        </h1>
        <p class="mt-4 text-base text-blue-100 leading-relaxed max-w-md">
          Set up patient registration, queue management, messaging, and appointments — all under your clinic's brand.
        </p>

        <!-- Feature list -->
        <ul class="mt-8 space-y-3">
          <li v-for="f in features" :key="f" class="flex items-center gap-3 text-sm text-blue-100">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 border border-emerald-300/30 shrink-0">
              <i class="pi pi-check text-emerald-300 text-[10px]"></i>
            </span>
            {{ f }}
          </li>
        </ul>

        <!-- Plan preview cards -->
        <div class="mt-10 grid grid-cols-3 gap-2">
          <div
            v-for="p in planPreviews"
            :key="p.id"
            class="rounded-2xl border p-3 backdrop-blur-sm text-center"
            :class="p.id === 'growth'
              ? 'bg-white/20 border-white/40'
              : 'bg-white/8 border-white/15'"
          >
            <p v-if="p.badge" class="text-[10px] font-bold text-yellow-300 uppercase tracking-wider mb-1">{{ p.badge }}</p>
            <p class="text-white font-bold text-sm">{{ p.name }}</p>
            <p class="text-blue-200 text-xs mt-0.5">₱{{ p.price.toLocaleString() }}/mo</p>
          </div>
        </div>

        <!-- Trust -->
        <div class="mt-8 flex flex-wrap gap-2">
          <span v-for="t in trust" :key="t.label" class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <i :class="t.icon" class="text-emerald-300 text-[10px]"></i>
            {{ t.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── RIGHT — Form panel ──────────────────────────────── -->
    <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center gap-2.5 mb-8 self-start w-full max-w-lg">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow">
          <i class="pi pi-building text-white text-sm"></i>
        </div>
        <div>
          <p class="font-bold text-slate-800 text-sm leading-tight">My Clinic Access</p>
          <p class="text-xs text-slate-400">30-Day Free Trial</p>
        </div>
      </div>

      <Transition appear name="card-rise">
        <div class="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">

          <!-- Step indicator -->
          <div class="flex border-b border-slate-100">
            <button
              v-for="s in steps"
              :key="s.n"
              class="flex-1 py-3.5 flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors"
              :class="step === s.n
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : step > s.n
                  ? 'text-emerald-600 bg-emerald-50/30'
                  : 'text-slate-400'"
              :disabled="step < s.n"
              @click="step > s.n && (step = s.n)"
            >
              <span
                class="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border"
                :class="step > s.n
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : step === s.n
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 text-slate-400'"
              >
                <i v-if="step > s.n" class="pi pi-check text-[9px]"></i>
                <span v-else>{{ s.n }}</span>
              </span>
              {{ s.label }}
            </button>
          </div>

          <!-- ── STEP 1: Clinic Info ── -->
          <Transition name="slide-left" mode="out-in">
            <div v-if="step === 1" key="step1" class="p-6 sm:p-8 space-y-5">
              <div>
                <h2 class="text-xl font-bold text-slate-900">Set up your clinic</h2>
                <p class="text-sm text-slate-500 mt-0.5">Tell us about your clinic and choose a plan.</p>
              </div>

              <!-- Clinic name -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">
                  Clinic Name <span class="text-red-500">*</span>
                </label>
                <InputText
                  v-model="form.clinicName"
                  placeholder="e.g. Santos Medical Clinic"
                  class="w-full"
                  :class="{ 'input-error': errors.clinicName }"
                  @input="onClinicNameInput"
                />
                <p v-if="errors.clinicName" class="text-xs text-red-500 flex items-center gap-1">
                  <i class="pi pi-exclamation-circle text-[10px]"></i>{{ errors.clinicName }}
                </p>
              </div>

              <!-- Subdomain -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">
                  Your Portal Address <span class="text-red-500">*</span>
                </label>

                <div class="flex rounded-xl border overflow-hidden transition-all" :class="errors.slug ? 'border-red-400' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15'">
                  <input
                    v-model="form.slug"
                    type="text"
                    placeholder="yourClinic"
                    class="flex-1 px-4 py-3 text-sm text-slate-800 bg-white outline-none min-w-0 placeholder-slate-400"
                    @input="onSlugInput"
                  />
                  <span class="flex items-center px-3 bg-slate-50 border-l border-slate-200 text-slate-400 text-sm font-medium whitespace-nowrap shrink-0">
                    .myclinicaccess.com
                  </span>
                </div>

                <Transition name="err-slide">
                  <p v-if="errors.slug" class="text-xs text-red-500 flex items-center gap-1">
                    <i class="pi pi-exclamation-circle text-[10px]"></i>{{ errors.slug }}
                  </p>
                </Transition>

                <!-- Live preview -->
                <div v-if="form.slug && !errors.slug" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <i class="pi pi-check-circle text-emerald-500 text-xs shrink-0"></i>
                  <p class="text-xs text-emerald-700 font-medium truncate">
                    Your portal: <span class="font-bold">{{ fullDomain }}</span>
                  </p>
                </div>
              </div>

              <!-- Plan selector -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Choose a Plan</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="p in planPreviews"
                    :key="p.id"
                    type="button"
                    class="relative flex flex-col items-center rounded-2xl border-2 p-3 text-center transition-all"
                    :class="form.plan === p.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'"
                    @click="form.plan = p.id"
                  >
                    <span v-if="p.badge" class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{{ p.badge }}</span>
                    <p class="text-sm font-bold text-slate-800">{{ p.name }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">₱{{ p.price.toLocaleString() }}/mo</p>
                    <p class="text-[10px] text-slate-400 mt-1">{{ p.sub }}</p>
                    <div v-if="form.plan === p.id" class="absolute top-2 right-2 h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                      <i class="pi pi-check text-white text-[8px]"></i>
                    </div>
                  </button>
                </div>
                <p class="text-xs text-slate-400 text-center">All plans include a 30-day free trial. No credit card required.</p>
              </div>

              <Button
                label="Continue"
                icon="pi pi-arrow-right"
                icon-pos="right"
                class="w-full !rounded-2xl !py-3 !text-sm !font-bold"
                @click="goToStep2"
              />

              <p class="text-center text-sm text-slate-500">
                Already have an account?
                <router-link to="/signin" class="text-blue-600 font-semibold hover:underline">Sign in</router-link>
              </p>
            </div>
          </Transition>

          <!-- ── STEP 2: Owner Account ── -->
          <Transition name="slide-left" mode="out-in">
            <div v-if="step === 2" key="step2" class="p-6 sm:p-8 space-y-5">
              <div>
                <h2 class="text-xl font-bold text-slate-900">Create your account</h2>
                <p class="text-sm text-slate-500 mt-0.5">You'll be the superadmin of <span class="font-semibold text-slate-700">{{ form.clinicName }}</span>.</p>
              </div>

              <!-- Name row -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">First Name <span class="text-red-500">*</span></label>
                  <InputText
                    v-model="form.ownerFirstName"
                    placeholder="Juan"
                    class="w-full"
                    :class="{ 'input-error': errors.ownerFirstName }"
                  />
                  <p v-if="errors.ownerFirstName" class="text-xs text-red-500">{{ errors.ownerFirstName }}</p>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">Last Name <span class="text-red-500">*</span></label>
                  <InputText
                    v-model="form.ownerLastName"
                    placeholder="Santos"
                    class="w-full"
                    :class="{ 'input-error': errors.ownerLastName }"
                  />
                  <p v-if="errors.ownerLastName" class="text-xs text-red-500">{{ errors.ownerLastName }}</p>
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">Email Address <span class="text-red-500">*</span></label>
                <InputText
                  v-model="form.ownerEmail"
                  type="email"
                  placeholder="you@yourclinic.com"
                  class="w-full"
                  :class="{ 'input-error': errors.ownerEmail }"
                />
                <p v-if="errors.ownerEmail" class="text-xs text-red-500">{{ errors.ownerEmail }}</p>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">Password <span class="text-red-500">*</span></label>
                <div class="relative">
                  <InputText
                    v-model="form.ownerPassword"
                    :type="showPw ? 'text' : 'password'"
                    placeholder="Min. 8 characters"
                    class="w-full pr-11"
                    :class="{ 'input-error': errors.ownerPassword }"
                    @input="errors.ownerPassword = ''"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    @click="showPw = !showPw"
                  >
                    <i :class="showPw ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-base"></i>
                  </button>
                </div>

                <!-- Password strength -->
                <div v-if="form.ownerPassword" class="space-y-1">
                  <div class="flex gap-1">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="h-1 flex-1 rounded-full transition-all duration-300"
                      :class="i <= pwStrength.score ? pwStrength.color : 'bg-slate-200'"
                    ></div>
                  </div>
                  <p class="text-xs" :class="pwStrength.textColor">{{ pwStrength.label }}</p>
                </div>

                <p v-if="errors.ownerPassword" class="text-xs text-red-500">{{ errors.ownerPassword }}</p>
              </div>

              <!-- Confirm password -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">Confirm Password <span class="text-red-500">*</span></label>
                <div class="relative">
                  <InputText
                    v-model="form.confirmPassword"
                    :type="showConfirmPw ? 'text' : 'password'"
                    placeholder="Re-enter your password"
                    class="w-full pr-11"
                    :class="{ 'input-error': errors.confirmPassword }"
                    @input="errors.confirmPassword = ''"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    @click="showConfirmPw = !showConfirmPw"
                  >
                    <i :class="showConfirmPw ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-base"></i>
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="text-xs text-red-500">{{ errors.confirmPassword }}</p>
              </div>

              <!-- Server error -->
              <Transition name="err-slide">
                <div v-if="serverError" class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <i class="pi pi-exclamation-triangle text-red-500 text-sm mt-0.5 shrink-0"></i>
                  <p class="text-sm text-red-700">{{ serverError }}</p>
                </div>
              </Transition>

              <!-- Submit -->
              <Button
                label="Start Free Trial"
                icon="pi pi-arrow-right"
                icon-pos="right"
                :loading="submitting"
                class="w-full !rounded-2xl !py-3 !text-sm !font-bold"
                @click="handleSubmit"
              />

              <p class="text-center text-xs text-slate-400 leading-relaxed">
                By signing up, you agree to our
                <router-link to="/terms" class="text-blue-600 hover:underline">Terms</router-link>
                and
                <router-link to="/privacy" class="text-blue-600 hover:underline">Privacy Policy</router-link>.
              </p>

              <button
                type="button"
                class="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1.5"
                @click="step = 1"
              >
                <i class="pi pi-arrow-left text-xs"></i>
                Back to clinic info
              </button>
            </div>
          </Transition>

          <!-- ── SUCCESS ── -->
          <Transition name="slide-left" mode="out-in">
            <div v-if="step === 3" key="step3" class="p-8 flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <i class="pi pi-check-circle text-3xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">You're all set!</h2>
                <p class="text-sm text-slate-500 mt-1">
                  <strong class="text-slate-700">{{ form.clinicName }}</strong> is now live. Check your email to verify your account.
                </p>
              </div>
              <div class="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-left space-y-1.5">
                <p class="text-xs text-slate-400 uppercase font-semibold tracking-wider">Your portal address</p>
                <p class="text-sm font-bold text-blue-600 break-all">{{ fullDomain }}</p>
              </div>
              <div class="w-full space-y-2 text-left">
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Next Steps</p>
                <div v-for="ns in nextSteps" :key="ns" class="flex items-center gap-2 text-sm text-slate-600">
                  <i class="pi pi-arrow-right text-blue-400 text-xs shrink-0"></i>
                  {{ ns }}
                </div>
              </div>
              <Button
                label="Go to Dashboard"
                icon="pi pi-th-large"
                class="w-full !rounded-2xl !py-3 !text-sm !font-bold"
                @click="$router.push('/tenant-home')"
              />
            </div>
          </Transition>

        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuthTenantStore } from '../stores/authTenantStore'

const toast = useToast()
const authStore = useAuthTenantStore()

const step        = ref(1)
const showPw      = ref(false)
const showConfirmPw = ref(false)
const submitting  = ref(false)
const serverError = ref('')

const form = reactive({
  clinicName:     '',
  slug:           '',
  plan:           'growth',
  ownerFirstName: '',
  ownerLastName:  '',
  ownerEmail:     '',
  ownerPassword:  '',
  confirmPassword:'',
})

const errors = reactive({
  clinicName: '', slug: '',
  ownerFirstName: '', ownerLastName: '',
  ownerEmail: '', ownerPassword: '', confirmPassword: '',
})

// ── Computed ──────────────────────────────────────────────

const fullDomain = computed(() =>
  form.slug ? `${form.slug}.myclinicaccess.com` : ''
)

const pwStrength = computed(() => {
  const pw = form.ownerPassword
  if (!pw) return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400' }
  let score = 0
  if (pw.length >= 8)               score++
  if (/[A-Z]/.test(pw))             score++
  if (/[0-9]/.test(pw))             score++
  if (/[^A-Za-z0-9]/.test(pw))      score++

  const map = [
    { score: 1, label: 'Weak',   color: 'bg-red-400',    textColor: 'text-red-500'   },
    { score: 2, label: 'Fair',   color: 'bg-amber-400',  textColor: 'text-amber-600' },
    { score: 3, label: 'Good',   color: 'bg-blue-400',   textColor: 'text-blue-600'  },
    { score: 4, label: 'Strong', color: 'bg-emerald-500',textColor: 'text-emerald-600'},
  ]
  return { score, ...(map[score - 1] || map[0]) }
})

// ── Data ──────────────────────────────────────────────────

const features = [
  'Patient digital registration & QR ID',
  'Queue management & real-time status',
  'Clinic-to-patient inbox messaging',
  'Appointment booking & management',
  'Admin dashboard with analytics',
  'Clinic branding — logo, colors, domain',
]

const planPreviews = [
  { id: 'starter', name: 'Starter', price: 1499, sub: '500 patients', badge: null  },
  { id: 'growth',  name: 'Growth',  price: 2999, sub: '2,000 patients', badge: 'Popular' },
  { id: 'premium', name: 'Premium', price: 5499, sub: 'Unlimited', badge: null  },
]

const trust = [
  { icon: 'pi pi-shield', label: 'PDPA Compliant' },
  { icon: 'pi pi-lock',   label: 'Encrypted Access' },
  { icon: 'pi pi-star',   label: '30-Day Free Trial' },
]

const steps = [
  { n: 1, label: 'Clinic Info' },
  { n: 2, label: 'Your Account' },
]

const nextSteps = [
  'Verify your email to activate your account',
  'Add your first patient or staff member',
  'Customize your clinic branding',
]

// ── Helpers ───────────────────────────────────────────────

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)

const validateSlug = (slug) => {
  if (!slug) return 'Portal address is required'
  if (slug.length < 3) return 'Must be at least 3 characters'
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Only lowercase letters, numbers, and hyphens'
  if (slug.startsWith('-') || slug.endsWith('-')) return 'Cannot start or end with a hyphen'
  return ''
}

const onClinicNameInput = () => {
  errors.clinicName = ''
  // Auto-fill slug only if user hasn't customised it yet
  if (!form.slug || form.slug === toSlug(form.clinicName.slice(0, -1))) {
    form.slug = toSlug(form.clinicName)
  }
}

const onSlugInput = () => {
  form.slug = toSlug(form.slug)
  errors.slug = validateSlug(form.slug)
}

// ── Navigation ────────────────────────────────────────────

const goToStep2 = () => {
  errors.clinicName = ''
  errors.slug = ''
  let ok = true

  if (!form.clinicName.trim()) { errors.clinicName = 'Clinic name is required'; ok = false }
  const slugErr = validateSlug(form.slug)
  if (slugErr) { errors.slug = slugErr; ok = false }

  if (ok) step.value = 2
}

// ── Submit ────────────────────────────────────────────────

const handleSubmit = async () => {
  serverError.value = ''
  let ok = true

  errors.ownerFirstName = errors.ownerLastName = errors.ownerEmail = errors.ownerPassword = errors.confirmPassword = ''

  if (!form.ownerFirstName.trim()) { errors.ownerFirstName = 'First name is required'; ok = false }
  if (!form.ownerLastName.trim())  { errors.ownerLastName  = 'Last name is required';  ok = false }

  if (!form.ownerEmail.trim()) {
    errors.ownerEmail = 'Email is required'; ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) {
    errors.ownerEmail = 'Enter a valid email'; ok = false
  }

  if (!form.ownerPassword) {
    errors.ownerPassword = 'Password is required'; ok = false
  } else if (form.ownerPassword.length < 8) {
    errors.ownerPassword = 'Password must be at least 8 characters'; ok = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'; ok = false
  } else if (form.ownerPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'; ok = false
  }

  if (!ok) return

  submitting.value = true

  const result = await authStore.registerClinic({
    clinicName:     form.clinicName.trim(),
    domain:         fullDomain.value,
    ownerEmail:     form.ownerEmail.trim(),
    ownerFirstName: form.ownerFirstName.trim(),
    ownerLastName:  form.ownerLastName.trim(),
    ownerPassword:  form.ownerPassword,
  })

  submitting.value = false

  if (!result.success) {
    serverError.value = result.message
    return
  }

  step.value = 3
}
</script>

<style scoped>
.dot-pattern {
  background-image: radial-gradient(circle, rgba(255,255,255,0.20) 1px, transparent 1px);
  background-size: 22px 22px;
}

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
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  border-color: rgb(59 130 246);
}

:deep(.input-error .p-inputtext),
:deep(.input-error.p-inputtext) {
  border-color: rgb(239 68 68) !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important;
}

:deep(.p-button) { border-radius: 1rem; }

.card-rise-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.card-rise-enter-from   { opacity: 0; transform: translateY(16px); }

.slide-left-enter-active,
.slide-left-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-left-enter-from   { opacity: 0; transform: translateX(16px); }
.slide-left-leave-to     { opacity: 0; transform: translateX(-16px); }

.err-slide-enter-active,
.err-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.err-slide-enter-from,
.err-slide-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
