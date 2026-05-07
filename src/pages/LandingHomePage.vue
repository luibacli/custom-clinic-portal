<template>
  <LandingLayout>

    <!-- ═══════════════════════════════════════════
         HERO
    ══════════════════════════════════════════════ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div class="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- LEFT: Headline + CTA -->
          <div class="max-w-xl">
            <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Built for Filipino Clinics
            </span>

            <h1 class="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.1] tracking-tight">
              Launch Your Clinic<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Portal Instantly
              </span>
            </h1>

            <p class="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              My Clinic Access gives every patient a real digital identity — including those without an email address — and equips your clinic with the tools to register, queue, and communicate efficiently under your own brand.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <router-link
                to="/book-demo"
                class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 active:scale-95 transition-all duration-150"
              >
                <i class="pi pi-calendar"></i>
                Book a Free Demo
              </router-link>
              <router-link
                to="/pricing"
                class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-50 hover:border-slate-400 transition-all duration-150"
              >
                See Pricing
                <i class="pi pi-arrow-right text-sm"></i>
              </router-link>
            </div>

            <!-- Trust badges -->
            <div class="mt-8 flex flex-wrap gap-3">
              <span v-for="badge in trustBadges" :key="badge.text" class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <i :class="badge.icon" class="text-emerald-500 text-xs"></i>
                {{ badge.text }}
              </span>
            </div>
          </div>

          <!-- RIGHT: Portal Preview Mockup -->
          <div class="relative hidden lg:block">
            <div class="relative z-10">
              <div class="rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                <div class="bg-slate-100 px-4 py-2.5 flex items-center gap-3 border-b border-slate-200">
                  <div class="flex gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                    <span class="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                    <span class="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                  </div>
                  <div class="flex-1 bg-white rounded-full px-3 py-1 text-xs text-slate-400 border border-slate-200 truncate">
                    yourclinic.myclinicaccess.com
                  </div>
                </div>
                <div class="p-4 bg-slate-50 space-y-3">
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-white rounded-xl p-3 shadow-sm text-center border border-slate-100">
                      <p class="text-xl font-bold text-blue-600">24</p>
                      <p class="text-[10px] text-slate-500 mt-0.5">Patients Today</p>
                    </div>
                    <div class="bg-white rounded-xl p-3 shadow-sm text-center border border-slate-100">
                      <p class="text-xl font-bold text-amber-500">8</p>
                      <p class="text-[10px] text-slate-500 mt-0.5">In Queue</p>
                    </div>
                    <div class="bg-white rounded-xl p-3 shadow-sm text-center border border-slate-100">
                      <p class="text-xl font-bold text-emerald-500">5</p>
                      <p class="text-[10px] text-slate-500 mt-0.5">New Messages</p>
                    </div>
                  </div>
                  <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <p class="text-xs font-semibold text-slate-700">Registered Today</p>
                      <span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Live</span>
                    </div>
                    <div v-for="p in mockPatients" :key="p.name" class="px-3 py-2 flex items-center justify-between border-b border-slate-50 last:border-0">
                      <div class="flex items-center gap-2">
                        <span class="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" :class="p.color">{{ p.initial }}</span>
                        <span class="text-xs text-slate-700">{{ p.name }}</span>
                      </div>
                      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" :class="p.badge">{{ p.status }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <i class="pi pi-check text-sm"></i>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-800">Patient Registered</p>
                  <p class="text-[10px] text-slate-500">Maria Santos — #0042</p>
                </div>
              </div>

              <div class="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <i class="pi pi-envelope text-sm"></i>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-800">New Inbox Message</p>
                  <p class="text-[10px] text-slate-500">Appointment confirmed ✓</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         PROBLEMS WE SOLVE
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-red-500 uppercase tracking-widest">The Problem</span>
          <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Sound Familiar?</h2>
          <p class="mt-3 text-slate-500">Filipino clinics face the same operational challenges every day. Manual work slows everything down.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="problem in problems" :key="problem.title"
            class="group rounded-2xl border border-red-100 bg-red-50/50 p-6 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
          >
            <div class="h-11 w-11 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i :class="problem.icon" class="text-lg"></i>
            </div>
            <h3 class="font-semibold text-slate-800 mb-1.5">{{ problem.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ problem.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SOLUTIONS
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-cyan-300 uppercase tracking-widest">Our Solution</span>
          <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-white">One Platform. All the Answers.</h2>
          <p class="mt-3 text-blue-100">Everything your clinic needs to operate efficiently — built, configured, and running under your brand.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="solution in solutions" :key="solution.title"
            class="rounded-2xl border p-6 backdrop-blur-sm transition-all duration-200"
            :class="solution.highlight
              ? 'border-cyan-300/50 bg-white/20 hover:bg-white/25 ring-1 ring-cyan-300/30'
              : 'border-white/15 bg-white/10 hover:bg-white/15'"
          >
            <div class="h-11 w-11 rounded-2xl flex items-center justify-center mb-4"
              :class="solution.highlight ? 'bg-cyan-400/30 text-cyan-100' : 'bg-white/20 text-white'"
            >
              <i :class="solution.icon" class="text-lg"></i>
            </div>
            <div class="flex items-center gap-2 mb-1.5">
              <h3 class="font-semibold text-white">{{ solution.title }}</h3>
              <span v-if="solution.badge" class="text-[10px] font-bold bg-cyan-400 text-cyan-900 px-2 py-0.5 rounded-full leading-none">{{ solution.badge }}</span>
            </div>
            <p class="text-sm text-blue-100 leading-relaxed">{{ solution.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         HOW IT WORKS (BRIEF)
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Process</span>
          <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Up and Running in Days</h2>
          <p class="mt-3 text-slate-500">No complicated setup. We configure everything — you focus on your patients.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div class="hidden md:block absolute top-10 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
          <div v-for="(step, i) in howItWorks" :key="step.title" class="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            <div class="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4 shadow-lg z-10 relative">
              {{ i + 1 }}
            </div>
            <h3 class="font-bold text-slate-800 text-base mb-2">{{ step.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
        <div class="text-center mt-10">
          <router-link to="/how-it-works" class="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors">
            See the full process <i class="pi pi-arrow-right text-xs"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         KEY FEATURES
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Features</span>
            <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Built Around How Clinics Actually Work</h2>
            <p class="mt-4 text-slate-500 leading-relaxed">
              Not a generic system forced into a healthcare mold. Every feature was designed with clinic staff in mind — practical, fast, and intuitive.
            </p>
            <router-link
              to="/features"
              class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150"
            >
              Explore All Features <i class="pi pi-arrow-right text-xs"></i>
            </router-link>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="feature in keyFeatures" :key="feature.title"
              class="rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
            >
              <div class="h-9 w-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" :class="feature.bg">
                <i :class="[feature.icon, feature.color]" class="text-sm"></i>
              </div>
              <h3 class="font-semibold text-slate-800 text-sm mb-1">{{ feature.title }}</h3>
              <p class="text-xs text-slate-500 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         WHY CHOOSE US
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Why Us</span>
          <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Not Just Another Software</h2>
          <p class="mt-3 text-slate-500">We understand Filipino clinics because we built this specifically for them.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="reason in whyUs" :key="reason.title"
            class="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            <div class="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" :class="reason.bg">
              <i :class="[reason.icon, reason.color]" class="text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-800 mb-2">{{ reason.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         PRICING PLANS
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <i class="pi pi-tag text-xs"></i> Subscription Plans
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
          <p class="mt-3 text-slate-500">Start free, scale as your clinic grows. No hidden fees. Cancel anytime.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div v-for="plan in pricingPlans" :key="plan.name"
            class="relative rounded-3xl border p-7 flex flex-col transition-all duration-200"
            :class="plan.highlighted
              ? 'border-blue-500 bg-gradient-to-b from-blue-600 to-cyan-600 text-white shadow-2xl shadow-blue-500/20 scale-[1.03]'
              : 'border-slate-200 bg-white hover:shadow-lg hover:border-blue-200'"
          >
            <div v-if="plan.highlighted" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                <i class="pi pi-star-fill text-[10px]"></i> Most Popular
              </span>
            </div>

            <div>
              <p class="text-xs font-bold uppercase tracking-widest" :class="plan.highlighted ? 'text-blue-200' : 'text-blue-600'">{{ plan.name }}</p>
              <div class="mt-2 flex items-end gap-1">
                <span class="text-4xl font-bold" :class="plan.highlighted ? 'text-white' : 'text-slate-900'">₱{{ plan.price.toLocaleString() }}</span>
                <span class="text-sm mb-1.5" :class="plan.highlighted ? 'text-blue-200' : 'text-slate-400'">/month</span>
              </div>
              <p class="mt-0.5 text-xs" :class="plan.highlighted ? 'text-blue-200' : 'text-slate-400'">₱{{ plan.annual.toLocaleString() }}/year — save 2 months</p>
              <p class="mt-3 text-sm leading-relaxed" :class="plan.highlighted ? 'text-blue-100' : 'text-slate-500'">{{ plan.desc }}</p>
            </div>

            <ul class="mt-6 space-y-2.5 flex-1">
              <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2 text-sm"
                :class="plan.highlighted ? 'text-blue-50' : 'text-slate-600'"
              >
                <i class="pi pi-check-circle mt-0.5 shrink-0 text-xs" :class="plan.highlighted ? 'text-cyan-300' : 'text-emerald-500'"></i>
                {{ feat }}
              </li>
            </ul>

            <router-link
              to="/book-demo"
              class="mt-8 block text-center px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-150"
              :class="plan.highlighted
                ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md'"
            >
              Get Started
            </router-link>
          </div>
        </div>

        <p class="text-center mt-8 text-xs text-slate-400">
          All plans include a free 30-day trial. No credit card required to start.
          <router-link to="/pricing" class="text-blue-600 hover:underline ml-1 font-medium">See full plan details →</router-link>
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FAQ TEASER
    ══════════════════════════════════════════════ -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-10">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Quick Answers</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">Common Questions</h2>
        </div>
        <div class="space-y-3">
          <div v-for="item in faqTeaser" :key="item.q" class="bg-white rounded-2xl border border-slate-200 p-5">
            <p class="text-sm font-semibold text-slate-800 flex items-start gap-2">
              <i class="pi pi-question-circle text-blue-500 mt-0.5 shrink-0"></i>
              {{ item.q }}
            </p>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed pl-6">{{ item.a }}</p>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link to="/faq" class="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5">
            See all FAQs <i class="pi pi-arrow-right text-xs"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FINAL CTA BANNER
    ══════════════════════════════════════════════ -->
    <section class="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="relative max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Ready to Modernize<br />Your Clinic?
        </h2>
        <p class="mt-5 text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
          Book a free 30-minute demo and see exactly how My Clinic Access can be configured for your clinic's workflow — live, personalized, no commitment.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/book-demo"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-base shadow-xl hover:bg-blue-50 active:scale-95 transition-all duration-150"
          >
            <i class="pi pi-calendar"></i>
            Book a Free Demo
          </router-link>
          <router-link
            to="/about"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all duration-150"
          >
            Learn About Us
          </router-link>
        </div>
        <p class="mt-6 text-xs text-blue-200">No commitment required. We'll do the talking — you decide if it fits.</p>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '../layouts/LandingLayout.vue'

const trustBadges = [
  { icon: 'pi pi-check-circle', text: 'SaaS Subscription' },
  { icon: 'pi pi-shield',       text: 'No Medical Records Stored' },
  { icon: 'pi pi-map-marker',  text: 'Made for PH Clinics' },
]

const mockPatients = [
  { name: 'Juan Dela Cruz', initial: 'J', status: 'Registered', color: 'bg-blue-100 text-blue-600',     badge: 'bg-emerald-50 text-emerald-700' },
  { name: 'Maria Santos',   initial: 'M', status: 'In Queue',   color: 'bg-purple-100 text-purple-600', badge: 'bg-amber-50 text-amber-700' },
  { name: 'Pedro Reyes',    initial: 'P', status: 'Registered', color: 'bg-cyan-100 text-cyan-600',     badge: 'bg-emerald-50 text-emerald-700' },
]

const problems = [
  { icon: 'pi pi-file-edit',    title: 'Manual Patient Registration', desc: 'Paper forms are slow, prone to errors, and impossible to search or organize.' },
  { icon: 'pi pi-clock',        title: 'Long & Disorganized Queues',  desc: 'Patients wait with no updates. Staff lose track. Frustration builds on both sides.' },
  { icon: 'pi pi-times-circle', title: 'No Direct Communication',     desc: 'Patients miss appointments. Follow-ups fall through. No reliable channel exists.' },
  { icon: 'pi pi-table',        title: 'Scattered Clinic Records',    desc: 'Patient info is spread across notebooks, spreadsheets, and memory.' },
]

const solutions = [
  { icon: 'pi pi-envelope',          title: 'Patient Digital Identity',     desc: 'Instantly generate a clinic-domain email for any patient — giving them a verified digital identity they can use across healthcare services, with or without a personal email.', highlight: true, badge: 'Signature' },
  { icon: 'pi pi-id-card',           title: 'QR Patient ID Card',           desc: 'Every patient gets a unique QR-linked digital ID card — ready for clinic check-in, verification, and future digital services on every visit.', highlight: true, badge: 'Signature' },
  { icon: 'pi pi-user-plus',         title: 'Digital Patient Registration', desc: 'Register patients in minutes with a clean digital form. No paper, no lost records.' },
  { icon: 'pi pi-sort-numeric-up',   title: 'Queue Management System',      desc: 'Real-time queue visibility for patients and staff. Clear order, no confusion.' },
  { icon: 'pi pi-inbox',             title: 'Clinic Inbox',                 desc: 'Direct, organized messaging between clinic and patients. Appointments confirmed, reminders sent.' },
  { icon: 'pi pi-chart-bar',         title: 'Operations Dashboard',         desc: 'See everything in one place — registrations, queues, messages, and activity.' },
]

const howItWorks = [
  { title: 'Choose Your Plan', desc: 'Pick the subscription that fits your clinic size. Start with a free 30-day trial — no credit card required.' },
  { title: 'We Configure It',  desc: 'Our team sets up your branded portal, configures your workflow, and trains your staff. Done in days.' },
  { title: 'Go Live & Scale',  desc: 'Your clinic portal is live. Patients register, queue in real time, and message your clinic — all on your brand.' },
]

const keyFeatures = [
  { icon: 'pi pi-envelope',  title: 'Patient Digital Identity', desc: 'Instant clinic-domain email for any patient — with or without a personal email address.',  bg: 'bg-blue-50',    color: 'text-blue-600' },
  { icon: 'pi pi-id-card',   title: 'QR Patient ID Card',       desc: 'Every patient gets a unique QR-linked digital ID card, reusable on every visit.',          bg: 'bg-cyan-50',    color: 'text-cyan-600' },
  { icon: 'pi pi-user-plus', title: 'Patient Registration',     desc: 'Digital forms replace paper. Fast, accurate, searchable.',                                  bg: 'bg-violet-50',  color: 'text-violet-600' },
  { icon: 'pi pi-list',      title: 'Queue Management',         desc: 'Live queue status visible to staff and patients.',                                           bg: 'bg-amber-50',   color: 'text-amber-600' },
  { icon: 'pi pi-inbox',     title: 'Patient Inbox',            desc: 'Secure clinic-to-patient messaging in one place.',                                           bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { icon: 'pi pi-sliders',   title: 'Custom Workflows',         desc: 'Configured around your clinic, not a generic template.',                                     bg: 'bg-rose-50',    color: 'text-rose-600' },
]

const whyUs = [
  { icon: 'pi pi-map-marker', title: 'Built for PH Clinics',   desc: 'Local context, local language, local support. We know how Filipino clinics operate.',  bg: 'bg-blue-50',    color: 'text-blue-600' },
  { icon: 'pi pi-tag',        title: 'SaaS Subscription',       desc: 'Simple monthly or annual plans. No custom quotes, no surprise bills, no lock-in.',    bg: 'bg-purple-50',  color: 'text-purple-600' },
  { icon: 'pi pi-bolt',       title: 'Fast Deployment',         desc: 'Up and running in days. We handle setup, configuration, and staff training.',          bg: 'bg-amber-50',   color: 'text-amber-600' },
  { icon: 'pi pi-headphones', title: 'Dedicated Support',       desc: "We're not done after launch. Ongoing help is always available.",                       bg: 'bg-emerald-50', color: 'text-emerald-600' },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 1499,
    annual: 14990,
    highlighted: false,
    desc: 'Perfect for solo practitioners and small clinics just getting started with digital tools.',
    features: [
      'clinicname.myclinicaccess.com subdomain',
      'Up to 500 patient records',
      'Digital patient registration',
      'Patient digital ID (QR)',
      'Basic queue management',
      '1 Admin + 1 Staff account',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 2999,
    annual: 28990,
    highlighted: true,
    desc: 'For active clinics that need full workflow automation and direct patient communication.',
    features: [
      'Included subdomain + custom domain option',
      'Up to 2,000 patient records',
      'All Starter features',
      'Clinic inbox & patient messaging',
      'Appointment management',
      'QR Scan check-in',
      'Up to 5 user accounts',
      'Priority support',
    ],
  },
  {
    name: 'Premium',
    price: 5499,
    annual: 54990,
    highlighted: false,
    desc: 'For high-volume or multi-specialty clinics that need full scale and dedicated support.',
    features: [
      'Custom domain included (portal.yourclinic.com)',
      'Unlimited patient records',
      'All Growth features',
      'Multi-location ready',
      'Unlimited user accounts',
      'Dedicated onboarding & training',
      'Direct support line',
    ],
  },
]

const faqTeaser = [
  { q: 'Does this store patient medical records?', a: 'No. We only store basic profile data: name, birthdate, and contact number. No EMR, no clinical notes, no diagnoses.' },
  { q: 'Can the portal be customized for our clinic?', a: "Yes — every portal is configured to your clinic's brand, workflow, and needs as part of your subscription. Not generic, not one-size-fits-all." },
  { q: 'How much does it cost?', a: 'My Clinic Access offers three subscription plans: Starter (₱1,499/mo), Growth (₱2,999/mo), and Premium (₱5,499/mo). Annual billing saves you 2 months. All plans include a 30-day free trial.' },
]
</script>
