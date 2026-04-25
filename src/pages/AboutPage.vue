<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 py-24 text-white">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-info-circle"></i> About Us
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
          We're Building the Digital<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Infrastructure for Filipino Clinics
          </span>
        </h1>
        <p class="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We saw clinics drowning in paperwork, patients waiting in confusion, and staff managing chaos with notebooks and spreadsheets. We decided to fix that.
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Story</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900">Built From a Real Problem</h2>
            <div class="mt-6 space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Every day, clinic staff in the Philippines spend hours doing things that a well-designed system could handle in minutes — writing patient details by hand, calling out queue numbers, scrambling to find old registration forms, sending appointment reminders one by one.
              </p>
              <p>
                Custom Clinic Portal PH was built to solve these exact problems. Not with a bloated enterprise platform, but with a focused, practical tool designed specifically for how Filipino clinics operate.
              </p>
              <p>
                We believe that even small, independent clinics deserve access to modern digital tools — and that those tools should adapt to the clinic, not the other way around.
              </p>
            </div>
          </div>
          <!-- Stat highlights -->
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in stats" :key="stat.label"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
            >
              <p class="text-3xl font-bold text-blue-600">{{ stat.value }}</p>
              <p class="mt-1 text-sm font-semibold text-slate-700">{{ stat.label }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ stat.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Stand For -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Values</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">What We Stand For</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="value in values" :key="value.title"
            class="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            <div class="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" :class="value.bg">
              <i :class="[value.icon, value.color]" class="text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-800 mb-2">{{ value.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Approach -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-5">
            <div v-for="point in approach" :key="point.title"
              class="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-200"
            >
              <div class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" :class="point.bg">
                <i :class="[point.icon, point.color]" class="text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-slate-800 text-sm mb-1">{{ point.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ point.desc }}</p>
              </div>
            </div>
          </div>
          <div>
            <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Approach</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900">Every Clinic Gets Its Own Portal</h2>
            <p class="mt-5 text-slate-600 leading-relaxed">
              We don't sell a generic subscription. We build a customized portal for each clinic — branded, configured, and deployed for your specific workflow. The scope of customization determines the cost, and we're transparent about that from day one.
            </p>
            <router-link
              to="/book-demo"
              class="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150"
            >
              <i class="pi pi-calendar"></i>
              Book a Free Demo
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-6">
        <h2 class="text-3xl font-bold">Want to Know More?</h2>
        <p class="mt-3 text-blue-100">Talk to us directly. We'd love to understand your clinic's challenges and show you what we can build together.</p>
        <div class="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <router-link to="/book-demo"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-blue-700 font-bold shadow-lg hover:bg-blue-50 transition-all"
          >
            <i class="pi pi-calendar"></i> Book a Free Demo
          </router-link>
          <router-link to="/mission"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all"
          >
            Our Mission &amp; Vision
          </router-link>
        </div>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '../layouts/LandingLayout.vue'

const stats = [
  { value: '100%', label: 'Custom Built',      sub: 'Every portal is tailored to the clinic' },
  { value: 'Days', label: 'Time to Deploy',    sub: 'Not weeks or months' },
  { value: '0',    label: 'Medical Records',   sub: 'We never store PHR or EMR data' },
  { value: 'PH',   label: 'Clinic-First Focus', sub: 'Designed for Filipino healthcare context' },
]

const values = [
  {
    icon: 'pi pi-heart', title: 'Clinic-First',
    desc: 'Every decision we make starts with one question: does this make life easier for clinic staff and patients?',
    bg: 'bg-red-50', color: 'text-red-500'
  },
  {
    icon: 'pi pi-sliders', title: 'Practical Innovation',
    desc: 'We don\'t build features for the sake of it. Every tool in the system exists because a real clinic needed it.',
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-shield', title: 'Transparency First',
    desc: 'Clear pricing, clear scope, clear data handling. No hidden fees, no hidden features, no surprises.',
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
]

const approach = [
  {
    icon: 'pi pi-comments', title: 'We Start With Listening',
    desc: 'Before building anything, we understand your workflow, pain points, and goals.',
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-wrench', title: 'We Build to Fit',
    desc: 'The portal is configured around how your clinic works — not the other way around.',
    bg: 'bg-purple-50', color: 'text-purple-600'
  },
  {
    icon: 'pi pi-graduation-cap', title: 'We Train Your Team',
    desc: 'Staff onboarding is part of every deployment. No one gets left behind.',
    bg: 'bg-amber-50', color: 'text-amber-600'
  },
  {
    icon: 'pi pi-headphones', title: 'We Stay With You',
    desc: 'Support doesn\'t end at launch. We\'re available for questions, updates, and improvements.',
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
]
</script>
