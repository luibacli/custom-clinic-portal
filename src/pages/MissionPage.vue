<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-white py-20">
      <div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-50 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-50 blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-star"></i> Purpose
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Mission &amp; Vision
        </h1>
        <p class="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
          Why we built this, and where we're taking it.
        </p>
      </div>
    </section>

    <!-- Mission + Vision -->
    <section class="py-12 pb-20 bg-white">
      <div class="max-w-5xl mx-auto px-6 space-y-8">

        <!-- Mission -->
        <div class="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-xl">
          <div class="rounded-[calc(1.5rem-2px)] bg-white p-8 sm:p-12">
            <div class="flex items-start gap-5">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                <i class="pi pi-target text-2xl"></i>
              </div>
              <div>
                <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Mission</span>
                <h2 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  Automate and simplify clinic operations so healthcare professionals can focus on what matters most — patient care.
                </h2>
                <p class="mt-4 text-slate-500 leading-relaxed">
                  We believe that administrative burden is one of the biggest barriers to quality healthcare delivery in the Philippines. When staff are overwhelmed with paperwork and manual processes, less time goes to patients. Our mission is to remove that burden through practical, custom-built digital tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vision -->
        <div class="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-0.5 shadow-xl">
          <div class="rounded-[calc(1.5rem-2px)] bg-slate-900 p-8 sm:p-12 text-white">
            <div class="flex items-start gap-5">
              <div class="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                <i class="pi pi-eye text-2xl"></i>
              </div>
              <div>
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Our Vision</span>
                <h2 class="mt-2 text-2xl sm:text-3xl font-bold leading-snug">
                  A Philippines where every clinic, regardless of size, has access to modern digital tools that match their unique workflow.
                </h2>
                <p class="mt-4 text-slate-400 leading-relaxed">
                  Digital transformation in healthcare shouldn't be exclusive to large hospitals. We're building the tools that make small and medium-sized clinics — the backbone of Filipino healthcare — just as capable and efficient as any major institution.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Principles</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">Core Values</h2>
          <p class="mt-3 text-slate-500">The principles that guide every decision we make.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="value in coreValues" :key="value.title"
            class="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            <div class="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" :class="value.bg">
              <i :class="[value.icon, value.color]" class="text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-800 mb-2">{{ value.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What This Means in Practice -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">In Practice</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">What This Looks Like for Your Clinic</h2>
        </div>
        <div class="space-y-4">
          <div v-for="item in inPractice" :key="item.label" class="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 transition-colors">
            <div class="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <i :class="item.icon" class="text-sm"></i>
            </div>
            <div>
              <p class="font-semibold text-slate-800 text-sm">{{ item.label }}</p>
              <p class="text-sm text-slate-500 mt-0.5 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-6">
        <h2 class="text-3xl font-bold">Share Our Vision?</h2>
        <p class="mt-3 text-blue-100 leading-relaxed">
          If you believe Filipino clinics deserve better tools, let's build something together. Start with a free, no-pressure demo.
        </p>
        <router-link
          to="/book-demo"
          class="mt-7 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-50 transition-all"
        >
          <i class="pi pi-calendar"></i> Book a Free Demo
        </router-link>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '../layouts/LandingLayout.vue'

const coreValues = [
  {
    icon: 'pi pi-heart',        title: 'Patient-First',
    desc: 'Every feature we ship improves the experience for the patient — not just the clinic.',
    bg: 'bg-red-50', color: 'text-red-500'
  },
  {
    icon: 'pi pi-wrench',       title: 'Practical Tools',
    desc: 'No bloat. No unnecessary complexity. Tools that actually get used, every day.',
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-building',     title: 'Clinic-Owned',
    desc: 'Your data. Your portal. Your brand. We build it, you own it.',
    bg: 'bg-purple-50', color: 'text-purple-600'
  },
  {
    icon: 'pi pi-map-marker',   title: 'Local Expertise',
    desc: 'We understand Filipino healthcare and the real-world constraints clinics face.',
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
]

const inPractice = [
  { icon: 'pi pi-user-plus',  label: 'No more paper registration forms',    desc: 'Patients are registered digitally. Staff stop wasting time searching through stacks of folders.' },
  { icon: 'pi pi-sort-numeric-up', label: 'Patients know their place in queue', desc: 'No more calling out names. A live queue system keeps everything organized and visible.' },
  { icon: 'pi pi-inbox',      label: 'Clinic sends messages directly to patients', desc: 'Appointment confirmations, reminders, and updates go through the portal inbox — no lost texts.' },
  { icon: 'pi pi-chart-bar',  label: 'Management sees operations clearly',  desc: 'A dashboard shows daily patient counts, queue status, and activity in one view.' },
]
</script>
