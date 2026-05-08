<template>
  <div class="px-4 py-6 sm:px-6 max-w-4xl mx-auto space-y-8">
    <Toast />

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Subscription & Billing</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your clinic's plan, usage, and upgrades.</p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-24 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
    </div>

    <template v-else>

      <!-- Current Plan Card -->
      <div class="rounded-2xl border p-6 shadow-sm"
        :class="statusBg">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-xs font-semibold uppercase tracking-widest"
                :class="statusTextMuted">Current Plan</span>
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                :class="statusBadge">
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDot"></span>
                {{ statusLabel }}
              </span>
            </div>
            <p class="mt-1 text-2xl font-black text-slate-900 dark:text-white capitalize">{{ sub.plan }}</p>
            <p v-if="sub.status === 'trial' && trialDaysLeft >= 0" class="mt-1 text-sm font-medium"
              :class="trialDaysLeft <= 5 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'">
              <i class="pi pi-clock mr-1 text-xs"></i>
              {{ trialDaysLeft === 0 ? 'Trial expires today' : `Trial expires in ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}` }}
            </p>
            <p v-else-if="sub.currentPeriodEnd" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Renews {{ formatDate(sub.currentPeriodEnd) }}
            </p>
          </div>

          <div v-if="sub.status !== 'active' || sub.plan !== 'premium'" class="flex flex-col sm:items-end gap-2">
            <button
              v-if="sub.plan !== 'premium'"
              @click="scrollToPlans"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              <i class="pi pi-arrow-up text-xs"></i>
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Usage Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Patients -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <i class="pi pi-users text-blue-500 text-sm"></i>
              </div>
              <span class="text-sm font-semibold text-slate-800 dark:text-white">Patients</span>
            </div>
            <span class="text-xs font-semibold"
              :class="patientPctClass">
              {{ sub.usage.patients }} / {{ sub.limits.patientLimit ?? '∞' }}
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="patientBarClass"
              :style="{ width: patientBarWidth }">
            </div>
          </div>
          <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {{ sub.limits.patientLimit ? `${sub.limits.patientLimit - sub.usage.patients} slots remaining` : 'Unlimited patients' }}
          </p>
        </div>

        <!-- Staff -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <i class="pi pi-user text-violet-500 text-sm"></i>
              </div>
              <span class="text-sm font-semibold text-slate-800 dark:text-white">Admin Accounts</span>
            </div>
            <span class="text-xs font-semibold"
              :class="staffPctClass">
              {{ sub.usage.staff }} / {{ sub.limits.userLimit ?? '∞' }}
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="staffBarClass"
              :style="{ width: staffBarWidth }">
            </div>
          </div>
          <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {{ sub.limits.userLimit ? `${sub.limits.userLimit - sub.usage.staff} slots remaining` : 'No limit set' }}
          </p>
        </div>
      </div>

      <!-- Billing toggle -->
      <div ref="plansSection" class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Choose a Plan</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Save up to 17% with annual billing</p>
          </div>
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1 w-fit">
            <button
              @click="billing = 'monthly'"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              :class="billing === 'monthly' ? 'bg-white dark:bg-white/15 shadow text-slate-900 dark:text-white' : 'text-slate-500'"
            >Monthly</button>
            <button
              @click="billing = 'annual'"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              :class="billing === 'annual' ? 'bg-white dark:bg-white/15 shadow text-slate-900 dark:text-white' : 'text-slate-500'"
            >Annual <span class="text-emerald-500 text-xs font-bold">–17%</span></button>
          </div>
        </div>

        <!-- Plan Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="plan in plans"
            :key="plan.key"
            class="relative rounded-2xl border p-5 flex flex-col gap-4 transition-all"
            :class="[
              plan.key === sub.plan ? 'border-blue-400 dark:border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]' : 'border-slate-200 dark:border-white/10',
              plan.popular ? 'bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-500/5 dark:to-transparent' : 'bg-white dark:bg-white/5',
            ]"
          >
            <!-- Popular badge -->
            <div v-if="plan.popular" class="absolute -top-3 left-5">
              <span class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-bold px-3 py-1 shadow">
                <i class="pi pi-star-fill text-[9px]"></i> Most Popular
              </span>
            </div>

            <!-- Current badge -->
            <div v-if="plan.key === sub.plan" class="absolute -top-3 right-5">
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-3 py-1">
                <i class="pi pi-check text-[9px]"></i> Current
              </span>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ plan.name }}</p>
              <div class="mt-1 flex items-end gap-1">
                <span class="text-3xl font-black text-slate-900 dark:text-white">
                  ₱{{ billing === 'annual' ? plan.priceAnnualFmt : plan.priceMonthlyFmt }}
                </span>
                <span class="text-sm text-slate-400 mb-0.5">/{{ billing === 'annual' ? 'yr' : 'mo' }}</span>
              </div>
              <p v-if="billing === 'annual'" class="text-xs text-emerald-500 font-medium">
                ₱{{ plan.priceMonthlyFmt }}/mo billed annually
              </p>
            </div>

            <ul class="space-y-2 flex-1">
              <li v-for="feat in plan.features" :key="feat.label" class="flex items-center gap-2">
                <div class="shrink-0 h-4.5 w-4.5 rounded-full flex items-center justify-center"
                  :class="feat.included ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'">
                  <i :class="feat.included ? 'pi pi-check' : 'pi pi-times'" class="text-[10px]"></i>
                </div>
                <span class="text-xs text-slate-600 dark:text-slate-300" :class="{ 'line-through opacity-40': !feat.included }">
                  {{ feat.label }}
                </span>
              </li>
            </ul>

            <button
              v-if="plan.key !== sub.plan || sub.status !== 'active'"
              @click="handleCheckout(plan.key)"
              :disabled="checkoutLoading === plan.key"
              class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              :class="plan.popular
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'"
            >
              <i v-if="checkoutLoading === plan.key" class="pi pi-spin pi-spinner mr-1 text-xs"></i>
              {{ checkoutLabel(plan.key) }}
            </button>

            <div v-else class="w-full py-2.5 rounded-xl text-sm font-semibold text-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
              <i class="pi pi-check mr-1 text-xs"></i> Active
            </div>
          </div>
        </div>
      </div>

      <!-- PDPA notice -->
      <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5">
        <div class="flex items-start gap-3">
          <div class="shrink-0 h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mt-0.5">
            <i class="pi pi-shield text-slate-500 text-sm"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-white">Data Privacy (PDPA)</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Under the Philippine Data Privacy Act (RA 10173), patients may request a copy of their data or ask for deletion.
              These actions are available per-patient under their profile in the Users section.
            </p>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import api from '../lib/axios'

const toast = useToast()

const loading = ref(true)
const billing = ref('monthly')
const checkoutLoading = ref(null)
const plansSection = ref(null)

const sub = ref({
  plan: 'starter',
  status: 'trial',
  trialEndsAt: null,
  currentPeriodEnd: null,
  limits: { patientLimit: 10000, userLimit: 3 },
  usage:  { patients: 0, staff: 0 },
})

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    priceMonthlyFmt: '1,399',
    priceAnnualFmt:  '13,990',
    popular: false,
    features: [
      { label: '10,000 patients', included: true },
      { label: '3 admin accounts', included: true },
      { label: 'Patient digital ID', included: true },
      { label: 'Appointments', included: false },
      { label: 'Messaging', included: false },
      { label: 'QR check-in', included: false },
      { label: 'Analytics', included: false },
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    priceMonthlyFmt: '2,899',
    priceAnnualFmt:  '28,990',
    popular: true,
    features: [
      { label: '20,000 patients', included: true },
      { label: '10 admin accounts', included: true },
      { label: 'Patient digital ID', included: true },
      { label: 'Appointments', included: true },
      { label: 'Messaging', included: true },
      { label: 'QR check-in', included: true },
      { label: 'Analytics', included: false },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    priceMonthlyFmt: '5,399',
    priceAnnualFmt:  '53,990',
    popular: false,
    features: [
      { label: 'Unlimited patients', included: true },
      { label: '20 admin accounts', included: true },
      { label: 'Patient digital ID', included: true },
      { label: 'Appointments', included: true },
      { label: 'Messaging', included: true },
      { label: 'QR check-in', included: true },
      { label: 'Analytics + Reports', included: true },
    ],
  },
]

const trialDaysLeft = computed(() => {
  if (!sub.value.trialEndsAt) return -1
  const diff = new Date(sub.value.trialEndsAt) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const statusLabel = computed(() => ({
  trial:     'Free Trial',
  active:    'Active',
  past_due:  'Payment Due',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
}[sub.value.status] || sub.value.status))

const statusBg = computed(() => ({
  trial:     'border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5',
  active:    'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5',
  past_due:  'border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5',
  suspended: 'border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5',
  cancelled: 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5',
}[sub.value.status] || 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'))

const statusBadge = computed(() => ({
  trial:     'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  past_due:  'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
}[sub.value.status] || 'bg-slate-100 text-slate-600'))

const statusDot = computed(() => ({
  trial:     'bg-amber-500',
  active:    'bg-emerald-500',
  past_due:  'bg-red-500',
  suspended: 'bg-red-500',
  cancelled: 'bg-slate-400',
}[sub.value.status] || 'bg-slate-400'))

const statusTextMuted = computed(() => ({
  trial:     'text-amber-600 dark:text-amber-400',
  active:    'text-emerald-600 dark:text-emerald-400',
  past_due:  'text-red-600 dark:text-red-400',
  suspended: 'text-red-600 dark:text-red-400',
  cancelled: 'text-slate-500',
}[sub.value.status] || 'text-slate-500'))

const usagePct = (used, limit) => (limit ? Math.min(100, Math.round((used / limit) * 100)) : 0)

const patientPct = computed(() => usagePct(sub.value.usage.patients, sub.value.limits.patientLimit))
const staffPct   = computed(() => usagePct(sub.value.usage.staff, sub.value.limits.userLimit))

const patientBarWidth = computed(() => sub.value.limits.patientLimit ? `${patientPct.value}%` : '0%')
const staffBarWidth   = computed(() => sub.value.limits.userLimit    ? `${staffPct.value}%`   : '0%')

const barClass = (pct) => pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500'
const pctClass = (pct) => pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'

const patientBarClass = computed(() => barClass(patientPct.value))
const staffBarClass   = computed(() => barClass(staffPct.value))
const patientPctClass = computed(() => pctClass(patientPct.value))
const staffPctClass   = computed(() => pctClass(staffPct.value))

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const checkoutLabel = (planKey) => {
  if (planKey === sub.value.plan) return 'Renew'
  const order = ['starter', 'growth', 'premium']
  return order.indexOf(planKey) > order.indexOf(sub.value.plan) ? 'Upgrade' : 'Downgrade'
}

const scrollToPlans = () => {
  plansSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleCheckout = async (planKey) => {
  checkoutLoading.value = planKey
  try {
    const { data } = await api.post('/billing/checkout', { plan: planKey, billing: billing.value })
    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer')
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get checkout URL', life: 4000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Checkout failed', life: 4000 })
  } finally {
    checkoutLoading.value = null
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/billing/status')
    if (data.success) sub.value = data.data
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load billing info', life: 4000 })
  } finally {
    loading.value = false
  }
})
</script>
