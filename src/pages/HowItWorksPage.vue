<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div class="absolute top-0 right-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-list"></i> How It Works
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          From Sign-Up to Live Portal — <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">In Under a Day</span>
        </h1>
        <p class="mt-5 text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          No waiting for someone to configure things for you. Sign up, run the setup wizard, invite your team, and go live — all on your own schedule, in minutes.
        </p>
      </div>
    </section>

    <!-- Step-by-Step Process -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <div class="space-y-6">
          <div v-for="(step, index) in steps" :key="step.title"
            class="group relative flex gap-6 sm:gap-8"
          >
            <!-- Step number + connector -->
            <div class="flex flex-col items-center shrink-0">
              <div class="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                {{ index + 1 }}
              </div>
              <div v-if="index < steps.length - 1" class="w-0.5 flex-1 bg-gradient-to-b from-blue-400 to-blue-100 my-2 min-h-[2rem]"></div>
            </div>
            <!-- Content -->
            <div class="pb-8 min-w-0 flex-1">
              <div class="rounded-2xl border border-slate-200 p-6 sm:p-8 hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" :class="step.bg">
                    <i :class="[step.icon, step.color]" class="text-base"></i>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-widest" :class="step.color">Phase {{ index + 1 }}</p>
                    <h2 class="font-bold text-slate-900 text-lg">{{ step.title }}</h2>
                  </div>
                </div>
                <p class="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">{{ step.desc }}</p>
                <ul class="space-y-2">
                  <li v-for="detail in step.details" :key="detail" class="flex items-start gap-2 text-sm text-slate-600">
                    <i class="pi pi-check text-emerald-500 text-xs mt-1 shrink-0"></i>
                    {{ detail }}
                  </li>
                </ul>
                <div v-if="step.duration" class="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <i class="pi pi-clock text-xs"></i> Typical duration: {{ step.duration }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What Makes Our Onboarding Different -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Promise</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">What Makes This Process Different</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="diff in differences" :key="diff.title"
            class="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:border-blue-100 transition-all duration-200 text-center"
          >
            <div class="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" :class="diff.bg">
              <i :class="[diff.icon, diff.color]" class="text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-800 mb-2">{{ diff.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ diff.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline summary bar -->
    <section class="py-14 bg-white border-t border-slate-100">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-8">
          <h3 class="text-lg font-bold text-slate-800">Typical Timeline to Launch</h3>
          <p class="text-sm text-slate-500 mt-1">Timelines vary based on scope. This is a realistic reference for a standard clinic setup.</p>
        </div>
        <div class="grid grid-cols-4 gap-0">
          <div v-for="(phase, i) in timeline" :key="phase.label" class="text-center relative">
            <div class="h-2 rounded-full mx-1" :class="phase.barColor"></div>
            <div v-if="i < timeline.length - 1" class="absolute top-0 right-0 w-1/2 h-2" :class="phase.barColor"></div>
            <p class="mt-3 text-xs font-bold text-slate-700">{{ phase.label }}</p>
            <p class="text-xs text-slate-500">{{ phase.duration }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-6">
        <h2 class="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p class="mt-3 text-blue-100">Book a demo and see the process in action — with your clinic as the example.</p>
        <router-link
          to="/book-demo"
          class="mt-7 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-50 transition-all"
        >
          <i class="pi pi-calendar"></i> Book a Free Demo
        </router-link>
        <p class="mt-4 text-xs text-blue-200">30 minutes. No obligations. We'll show you the full process.</p>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '../layouts/LandingLayout.vue'

const steps = [
  {
    icon: 'pi pi-tag',       title: 'Sign Up & Choose a Plan',
    desc: 'Pick the subscription that fits your clinic — Starter, Growth, or Premium. Start your free 30-day trial instantly. No credit card, no calls, no waiting.',
    details: [
      'No credit card required to start',
      'Your portal subdomain is provisioned automatically on signup',
      'Upgrade or downgrade anytime — no lock-in',
      'Annual billing available for 2 months free',
    ],
    duration: 'Day 1 — minutes',
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-sliders',   title: 'Run the Setup Wizard',
    desc: 'A guided in-app wizard walks you through everything: upload your logo, set your brand colors, configure registration fields, and create user accounts. No one needs to do this for you.',
    details: [
      'Upload clinic logo and set brand colors',
      'Configure patient registration fields for your workflow',
      'Create admin and staff accounts with the right roles',
      'Enable or disable features per your plan',
    ],
    duration: 'Day 1 — 15–30 minutes',
    bg: 'bg-purple-50', color: 'text-purple-600'
  },
  {
    icon: 'pi pi-users',     title: 'Invite Your Team & Test',
    desc: 'Send invites to your staff directly from the portal. Each role — admin, reception, staff — gets their own tailored view. Run a quick internal test before opening to patients.',
    details: [
      'Email invitations sent automatically per role',
      'In-app guide walks each role through their dashboard',
      'Test patient registration, queue, and messaging end-to-end',
      'No training sessions required — built to be self-explanatory',
    ],
    duration: 'Day 1–2',
    bg: 'bg-amber-50', color: 'text-amber-600'
  },
  {
    icon: 'pi pi-send',      title: 'Go Live',
    desc: 'Your branded portal is live. Patients register, get their digital ID, queue in real time, and message your clinic — all without you lifting a finger after setup. Async support is always available.',
    details: [
      'Patients self-register or are registered by front desk staff',
      'Digital ID and clinic-domain email generated on first registration',
      'Queue, inbox, and appointments running automatically',
      'Email support on all plans — direct line on Premium',
    ],
    duration: 'Day 2 onwards',
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
]

const differences = [
  {
    icon: 'pi pi-bolt',       title: 'No Setup Wait',
    desc: 'Configure your portal yourself through a guided wizard. No 3–7 day wait for someone to set things up. You\'re live on day one.',
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-check-circle', title: 'No Training Sessions',
    desc: 'Built to be intuitive from day one. In-app guides walk each role through their view — no live calls or sessions required.',
    bg: 'bg-amber-50', color: 'text-amber-600'
  },
  {
    icon: 'pi pi-headphones', title: 'Async Support, Always On',
    desc: 'Email support and documentation on all plans. No gatekeeping. Premium gets a direct line for high-priority needs.',
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
]

const timeline = [
  { label: 'Sign Up',   duration: 'Day 1 — instant',  barColor: 'bg-blue-500' },
  { label: 'Setup',     duration: 'Day 1 — 30 min',   barColor: 'bg-purple-500' },
  { label: 'Test',      duration: 'Day 1–2',           barColor: 'bg-amber-500' },
  { label: 'Live',      duration: 'Day 2+',            barColor: 'bg-emerald-500' },
]
</script>
