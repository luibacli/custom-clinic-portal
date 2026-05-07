<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-24 text-white">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-cyan-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-th-large"></i> Features &amp; Solutions
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
          Everything Your Clinic Needs<br />in One Place
        </h1>
        <p class="mt-5 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Every feature in My Clinic Access was built from real clinic feedback — not invented in a boardroom. Practical, fast, and configured for your workflow.
        </p>
        <router-link
          to="/book-demo"
          class="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-50 transition-all"
        >
          <i class="pi pi-calendar"></i> See It in Action — Book a Demo
        </router-link>
      </div>
    </section>

    <!-- Core Features Grid -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Core Features</span>
          <h2 class="mt-2 text-3xl font-bold text-slate-900">The Tools That Run Your Clinic</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in coreFeatures" :key="feature.title"
            class="group rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
          >
            <div class="h-12 w-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" :class="feature.bg">
              <i :class="[feature.icon, feature.color]" class="text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-800 text-base mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-4">{{ feature.desc }}</p>
            <ul class="space-y-1.5">
              <li v-for="bullet in feature.bullets" :key="bullet" class="flex items-center gap-2 text-xs text-slate-600">
                <i class="pi pi-check text-emerald-500 text-xs shrink-0"></i>
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Customization Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest">Customization</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900">Your Clinic, Your Portal</h2>
            <p class="mt-5 text-slate-600 leading-relaxed">
              Unlike generic off-the-shelf software, every My Clinic Access deployment is configured around your clinic's specific workflow, terminology, and needs. Your portal, your brand, your rules.
            </p>
            <div class="mt-8 space-y-3">
              <div v-for="item in customizations" :key="item" class="flex items-center gap-3 text-sm text-slate-700">
                <i class="pi pi-check-circle text-blue-500 shrink-0"></i>
                {{ item }}
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="clinic in clinicTypes" :key="clinic.type"
              class="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
            >
              <div class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" :class="clinic.bg">
                <i :class="[clinic.icon, clinic.color]" class="text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 text-sm">{{ clinic.type }}</p>
                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ clinic.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Security & Compliance Strip -->
    <section class="py-14 bg-white border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-8">
          <h3 class="text-lg font-bold text-slate-800">Built With Privacy & Security in Mind</h3>
          <p class="mt-2 text-sm text-slate-500">We take data handling seriously — because your patients trust you with their information.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="item in security" :key="item.label"
            class="text-center p-5 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <i :class="item.icon" class="text-2xl text-blue-500 block mb-2"></i>
            <p class="text-xs font-semibold text-slate-700">{{ item.label }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ item.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-6">
        <h2 class="text-3xl font-bold">Curious How It All Fits Together?</h2>
        <p class="mt-3 text-blue-100">Book a free demo and we'll walk you through every feature — and show you exactly how we'd customize it for your clinic.</p>
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

const coreFeatures = [
  {
    icon: 'pi pi-envelope',   title: 'Patient Digital Identity',
    desc: 'Give any patient a verified digital identity — instantly. We generate a clinic-domain email address so patients can access digital healthcare services even without a personal email.',
    bullets: ['Clinic-domain email generated in seconds', 'Works for patients with no personal email', 'Usable for digital health service enrollment'],
    bg: 'bg-blue-50', color: 'text-blue-600'
  },
  {
    icon: 'pi pi-id-card',    title: 'QR Patient ID Card',
    desc: 'Every registered patient receives a unique QR-linked digital ID card. Scannable at check-in, shareable digitally, and valid on every future visit.',
    bullets: ['Unique QR code per patient', 'Instant card generation on registration', 'Reusable and retrievable across visits'],
    bg: 'bg-cyan-50', color: 'text-cyan-600'
  },
  {
    icon: 'pi pi-user-plus',  title: 'Digital Patient Registration',
    desc: 'Replace paper forms with a clean digital registration flow. Patient data is stored accurately and is instantly searchable.',
    bullets: ['No more handwritten forms', 'Instant patient lookup', 'Unique patient ID per registration'],
    bg: 'bg-violet-50', color: 'text-violet-600'
  },
  {
    icon: 'pi pi-sort-numeric-up', title: 'Queue Management System',
    desc: 'Give patients real-time visibility into their position in the queue. Eliminate confusion and reduce walk-outs.',
    bullets: ['Live queue status display', 'Staff-controlled queue flow', 'Reduces patient waiting frustration'],
    bg: 'bg-amber-50', color: 'text-amber-600'
  },
  {
    icon: 'pi pi-inbox',      title: 'Patient Inbox & Messaging',
    desc: 'A secure, direct communication channel between your clinic and patients. Appointments, reminders, announcements — all in one place.',
    bullets: ['Clinic-to-patient messaging', 'Patient notifications', 'Organized message history'],
    bg: 'bg-emerald-50', color: 'text-emerald-600'
  },
  {
    icon: 'pi pi-chart-bar',  title: 'Operations Dashboard',
    desc: 'A centralized view of everything happening in your clinic today — patients registered, queue status, and messages.',
    bullets: ['Daily patient overview', 'Queue status at a glance', 'Activity tracking'],
    bg: 'bg-purple-50', color: 'text-purple-600'
  },
  {
    icon: 'pi pi-users',      title: 'Multi-Role Access Control',
    desc: 'Admin, staff, and patients each see a view built for their role. No information overload, no unauthorized access.',
    bullets: ['Superadmin, Admin, Patient roles', 'Role-based navigation', 'Secure login per role'],
    bg: 'bg-rose-50', color: 'text-rose-600'
  },
]

const customizations = [
  'Clinic branding (logo, name, colors)',
  'Custom patient registration fields',
  'Workflow configuration per clinic type',
  'Role and access level setup',
  'Custom notification messages',
  'Domain configured to your clinic',
]

const clinicTypes = [
  { type: 'General Practice', desc: 'Full registration, queue, inbox, and dashboard for high-volume daily patient flow.', icon: 'pi pi-heart', bg: 'bg-blue-50', color: 'text-blue-600' },
  { type: 'Specialty Clinics', desc: 'Customized for appointment-heavy schedules with specific intake workflows.', icon: 'pi pi-star', bg: 'bg-purple-50', color: 'text-purple-600' },
  { type: 'OB-GYN / Pediatrics', desc: 'Patient profile fields and workflows adapted for recurring patient types.', icon: 'pi pi-users', bg: 'bg-pink-50', color: 'text-pink-600' },
  { type: 'Dental Clinics', desc: 'Queue and scheduling management built around appointment-based visits.', icon: 'pi pi-bolt', bg: 'bg-cyan-50', color: 'text-cyan-600' },
]

const security = [
  { icon: 'pi pi-shield',        label: 'No Health Records', sub: 'PHR/EMR data is never stored' },
  { icon: 'pi pi-lock',          label: 'JWT Auth',          sub: 'Secure session management' },
  { icon: 'pi pi-building',      label: 'Clinic-Owned Data', sub: 'Your data stays yours' },
  { icon: 'pi pi-sitemap',       label: 'Multi-Tenant',      sub: 'Each clinic is fully isolated' },
]
</script>
