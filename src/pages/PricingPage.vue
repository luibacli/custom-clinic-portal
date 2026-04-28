<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-16 pb-14 lg:pt-20 lg:pb-18">
      <div class="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-200/15 blur-3xl pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-tag text-xs"></i> Subscription Plans
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Simple, Transparent Pricing<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Built for Filipino Clinics
          </span>
        </h1>
        <p class="mt-5 text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          No custom quotes. No surprises. Pick a plan, we set up your clinic portal, and you're live in days.
          All plans include a 30-day free trial.
        </p>

        <!-- Billing Toggle -->
        <div class="mt-8 inline-flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
          <button
            @click="billing = 'monthly'"
            class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
            :class="billing === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Monthly
          </button>
          <button
            @click="billing = 'annual'"
            class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
            :class="billing === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Annual
            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">Save 17%</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          <div v-for="plan in PLANS" :key="plan.id"
            class="relative rounded-3xl border flex flex-col transition-all duration-200"
            :class="plan.highlighted
              ? 'border-blue-500 bg-gradient-to-b from-blue-600 to-cyan-600 text-white shadow-2xl shadow-blue-500/20 scale-[1.03]'
              : 'border-slate-200 bg-white hover:shadow-xl hover:border-blue-200'"
          >
            <!-- Popular badge -->
            <div v-if="plan.badge" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <i class="pi pi-star-fill text-[10px]"></i> {{ plan.badge }}
              </span>
            </div>

            <div class="p-7 pb-5">
              <p class="text-xs font-bold uppercase tracking-widest" :class="plan.highlighted ? 'text-blue-200' : 'text-blue-600'">
                {{ plan.name }}
              </p>
              <p class="mt-1 text-sm" :class="plan.highlighted ? 'text-blue-100' : 'text-slate-400'">{{ plan.tagline }}</p>

              <div class="mt-5 flex items-end gap-1">
                <span class="text-5xl font-bold tracking-tight" :class="plan.highlighted ? 'text-white' : 'text-slate-900'">
                  ₱{{ displayPrice(plan).toLocaleString() }}
                </span>
                <span class="text-sm mb-2" :class="plan.highlighted ? 'text-blue-200' : 'text-slate-400'">
                  /{{ billing === 'annual' ? 'year' : 'month' }}
                </span>
              </div>

              <p v-if="billing === 'monthly'" class="mt-1 text-xs" :class="plan.highlighted ? 'text-blue-200' : 'text-slate-400'">
                ₱{{ plan.price.annual.toLocaleString() }}/year — save 2 months
              </p>
              <p v-else class="mt-1 text-xs" :class="plan.highlighted ? 'text-blue-200' : 'text-slate-400'">
                ₱{{ Math.round(plan.price.annual / 12).toLocaleString() }}/month billed annually
              </p>

              <router-link
                to="/book-demo"
                class="mt-6 block text-center px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-150"
                :class="plan.highlighted
                  ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md'"
              >
                {{ plan.cta }}
              </router-link>
            </div>

            <!-- Divider -->
            <div class="mx-7 border-t" :class="plan.highlighted ? 'border-white/15' : 'border-slate-100'"></div>

            <!-- Feature list -->
            <ul class="p-7 pt-5 space-y-2.5 flex-1">
              <li v-for="feat in plan.features" :key="feat.label"
                class="flex items-start gap-2.5 text-sm"
                :class="[
                  feat.included
                    ? (plan.highlighted ? 'text-blue-50' : 'text-slate-700')
                    : (plan.highlighted ? 'text-blue-300/50 line-through' : 'text-slate-300 line-through')
                ]"
              >
                <i
                  class="mt-0.5 shrink-0 text-xs"
                  :class="feat.included
                    ? (plan.highlighted ? 'pi pi-check-circle text-cyan-300' : 'pi pi-check-circle text-emerald-500')
                    : 'pi pi-minus-circle'"
                ></i>
                {{ feat.label }}
              </li>
            </ul>

            <!-- Support note -->
            <div class="px-7 pb-7">
              <div class="flex items-center gap-2 rounded-xl px-3 py-2" :class="plan.highlighted ? 'bg-white/10' : 'bg-slate-50'">
                <i class="pi pi-headphones text-xs" :class="plan.highlighted ? 'text-cyan-300' : 'text-blue-500'"></i>
                <span class="text-xs font-medium" :class="plan.highlighted ? 'text-blue-100' : 'text-slate-600'">{{ plan.support }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-center mt-8 text-xs text-slate-400">
          All plans include a 30-day free trial. No credit card required. Cancel anytime with 30 days notice.
        </p>
      </div>
    </section>

    <!-- Domain Model Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Your Clinic's Address</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">Subdomain or Custom Domain</h2>
          <p class="mt-3 text-slate-500">Every clinic gets a dedicated portal URL. Start on our subdomain or bring your own domain.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Included subdomain -->
          <div class="bg-white rounded-3xl border border-slate-200 p-7 hover:shadow-md hover:border-blue-200 transition-all duration-200">
            <div class="flex items-center gap-3 mb-5">
              <div class="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <i class="pi pi-globe text-lg"></i>
              </div>
              <div>
                <p class="font-bold text-slate-800">Included Subdomain</p>
                <p class="text-xs text-emerald-600 font-semibold">Starter, Growth & Premium</p>
              </div>
            </div>
            <p class="text-sm text-slate-500 mb-5">Every plan includes a dedicated subdomain on myclinicaccess.com — ready immediately, zero setup fee.</p>
            <ul class="space-y-2">
              <li v-for="ex in DOMAIN_EXAMPLES.subdomain" :key="ex" class="flex items-center gap-2 text-sm font-mono text-blue-700 bg-blue-50 rounded-xl px-3 py-2">
                <i class="pi pi-link text-xs text-blue-400"></i>
                {{ ex }}
              </li>
            </ul>
          </div>

          <!-- Custom domain -->
          <div class="bg-white rounded-3xl border border-slate-200 p-7 hover:shadow-md hover:border-purple-200 transition-all duration-200">
            <div class="flex items-center gap-3 mb-5">
              <div class="h-11 w-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <i class="pi pi-verified text-lg"></i>
              </div>
              <div>
                <p class="font-bold text-slate-800">Custom Domain</p>
                <p class="text-xs text-purple-600 font-semibold">Growth (add-on) & Premium (included)</p>
              </div>
            </div>
            <p class="text-sm text-slate-500 mb-5">Use your own branded domain for a fully white-labeled experience. Perfect for established clinics.</p>
            <ul class="space-y-2">
              <li v-for="ex in DOMAIN_EXAMPLES.custom" :key="ex" class="flex items-center gap-2 text-sm font-mono text-purple-700 bg-purple-50 rounded-xl px-3 py-2">
                <i class="pi pi-link text-xs text-purple-400"></i>
                {{ ex }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison Table -->
    <section class="py-20 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Compare Plans</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">Full Feature Comparison</h2>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full min-w-[560px]">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="text-left px-5 py-4 text-sm font-semibold text-slate-700 w-1/2">Feature</th>
                <th v-for="plan in PLANS" :key="plan.id" class="text-center px-4 py-4 text-sm font-bold"
                  :class="plan.highlighted ? 'text-blue-600' : 'text-slate-700'"
                >{{ plan.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in comparisonRows" :key="row.label"
                class="border-b border-slate-100 last:border-0"
                :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
              >
                <td class="px-5 py-3.5 text-sm text-slate-700 font-medium">{{ row.label }}</td>
                <td v-for="val in row.values" :key="val" class="px-4 py-3.5 text-center text-sm">
                  <i v-if="val === true" class="pi pi-check-circle text-emerald-500"></i>
                  <i v-else-if="val === false" class="pi pi-minus text-slate-300"></i>
                  <span v-else class="font-semibold text-slate-800">{{ val }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Pricing FAQ -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-10">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Pricing FAQ</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">Common Billing Questions</h2>
        </div>
        <div class="space-y-3">
          <div v-for="item in FAQ_PRICING" :key="item.q"
            class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 transition-colors"
          >
            <p class="text-sm font-semibold text-slate-800 flex items-start gap-2">
              <i class="pi pi-question-circle text-blue-500 mt-0.5 shrink-0"></i>
              {{ item.q }}
            </p>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed pl-6">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="relative max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold">Start Your Free 30-Day Trial</h2>
        <p class="mt-4 text-blue-100 text-base max-w-xl mx-auto leading-relaxed">
          No credit card required. Book a free demo and we'll walk you through the plan that fits your clinic best.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/book-demo"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-base shadow-xl hover:bg-blue-50 active:scale-95 transition-all"
          >
            <i class="pi pi-calendar"></i>
            Book a Free Demo
          </router-link>
          <router-link
            to="/features"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all"
          >
            See All Features
          </router-link>
        </div>
        <p class="mt-5 text-xs text-blue-200">30-day free trial · No credit card · Cancel anytime</p>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import LandingLayout from '../layouts/LandingLayout.vue'
import { PLANS, DOMAIN_EXAMPLES, FAQ_PRICING } from '../data/pricingConfig.js'

const billing = ref('monthly')

const displayPrice = (plan) =>
  billing.value === 'annual' ? plan.price.annual : plan.price.monthly

const comparisonRows = computed(() => [
  {
    label: 'Monthly price',
    values: PLANS.map(p => `₱${p.price.monthly.toLocaleString()}`),
  },
  {
    label: 'Patient records',
    values: PLANS.map(p => p.patientLimit ? `Up to ${p.patientLimit.toLocaleString()}` : 'Unlimited'),
  },
  {
    label: 'User accounts',
    values: PLANS.map(p => p.userAccounts ? `${p.userAccounts} accounts` : 'Unlimited'),
  },
  {
    label: 'Included subdomain',
    values: [true, true, true],
  },
  {
    label: 'Custom domain',
    values: [false, 'Add-on', 'Included'],
  },
  {
    label: 'Digital patient registration',
    values: [true, true, true],
  },
  {
    label: 'Queue management',
    values: [true, true, true],
  },
  {
    label: 'Patient digital ID (QR)',
    values: [true, true, true],
  },
  {
    label: 'Clinic branding',
    values: [true, true, true],
  },
  {
    label: 'Patient inbox & messaging',
    values: [false, true, true],
  },
  {
    label: 'Appointment management',
    values: [false, true, true],
  },
  {
    label: 'QR Scan check-in',
    values: [false, true, true],
  },
  {
    label: 'Multi-location ready',
    values: [false, false, true],
  },
  {
    label: 'Dedicated onboarding',
    values: [false, false, true],
  },
  {
    label: 'Support',
    values: ['Email', 'Priority Email', 'Direct Line'],
  },
])
</script>
