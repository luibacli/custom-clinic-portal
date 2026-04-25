<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white py-20">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-question-circle"></i> FAQ
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">Frequently Asked Questions</h1>
        <p class="mt-4 text-slate-500 text-base max-w-xl mx-auto">Everything clinics usually ask before booking a demo. If your question isn't here, <router-link to="/contact" class="text-blue-600 hover:underline font-medium">contact us directly</router-link>.</p>
      </div>
    </section>

    <!-- FAQ Categories -->
    <section class="py-16 bg-white">
      <div class="max-w-3xl mx-auto px-6 space-y-12">

        <div v-for="category in faqCategories" :key="category.label">
          <div class="flex items-center gap-3 mb-5">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" :class="category.bg">
              <i :class="[category.icon, category.color]" class="text-sm"></i>
            </div>
            <h2 class="text-lg font-bold text-slate-800">{{ category.label }}</h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in category.items"
              :key="item.q"
              class="rounded-2xl border overflow-hidden transition-all duration-200"
              :class="openItems[item.q] ? 'border-blue-200 shadow-sm' : 'border-slate-200'"
            >
              <button
                class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                :class="openItems[item.q] ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'"
                @click="toggle(item.q)"
              >
                <span class="font-semibold text-slate-800 text-sm leading-snug">{{ item.q }}</span>
                <i
                  class="pi shrink-0 text-blue-500 transition-transform duration-200"
                  :class="openItems[item.q] ? 'pi-chevron-up' : 'pi-chevron-down'"
                ></i>
              </button>
              <div v-if="openItems[item.q]" class="px-6 pb-5 bg-white">
                <p class="text-sm text-slate-600 leading-relaxed">{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Still have questions -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <div class="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
          <div class="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-comments text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Still Have Questions?</h2>
          <p class="mt-3 text-slate-500 text-sm leading-relaxed">
            We answer every question honestly — including whether our system is the right fit for your clinic. Let's talk.
          </p>
          <div class="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <router-link
              to="/book-demo"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <i class="pi pi-calendar"></i> Book a Free Demo
            </router-link>
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              <i class="pi pi-envelope"></i> Contact Us
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import { reactive } from 'vue'
import LandingLayout from '../layouts/LandingLayout.vue'

const openItems = reactive({})

const toggle = (key) => {
  openItems[key] = !openItems[key]
}

const faqCategories = [
  {
    label: 'About the Product',
    icon: 'pi pi-info-circle', bg: 'bg-blue-50', color: 'text-blue-600',
    items: [
      {
        q: 'What exactly is Custom Clinic Portal PH?',
        a: 'It\'s a custom-built digital portal for clinics. It handles patient registration, queue management, clinic-to-patient communication, and operations visibility — all under your clinic\'s own brand and domain.'
      },
      {
        q: 'Is this a generic off-the-shelf software?',
        a: 'No. Every clinic gets a portal built and configured specifically for their workflow. We don\'t sell a subscription to a pre-built product — we build a customized portal for you.'
      },
      {
        q: 'What types of clinics can use this?',
        a: 'General practice, specialty clinics, OB-GYN, pediatrics, dental, and more. The portal is configurable, so it adapts to any clinic type that needs patient registration, queue management, and patient communication.'
      },
    ]
  },
  {
    label: 'Data & Privacy',
    icon: 'pi pi-shield', bg: 'bg-emerald-50', color: 'text-emerald-600',
    items: [
      {
        q: 'Does the portal store patient medical records?',
        a: 'No. Custom Clinic Portal PH does not store, process, or manage any patient health records (PHR), electronic medical records (EMR), clinical notes, diagnoses, prescriptions, or any protected health information. We only store the basic profile needed for registration: name, birthdate, and contact number.'
      },
      {
        q: 'Who owns the patient data in the system?',
        a: 'The clinic owns all data stored within their portal instance. We build and maintain the system, but the data belongs to the clinic. You are the data controller.'
      },
      {
        q: 'Is the system secure?',
        a: 'Yes. We use JWT-based authentication, encrypted API communication (HTTPS), role-based access controls, and multi-tenant isolation. Each clinic\'s portal is completely separate from other clinics.'
      },
      {
        q: 'Are you compliant with Philippine data privacy laws?',
        a: 'We built the system with data minimization principles in mind — we only collect what\'s necessary for the system to function. The clinic, as the data controller, is responsible for ensuring their own compliance with the Data Privacy Act. We\'re happy to discuss specifics during a demo.'
      },
    ]
  },
  {
    label: 'Pricing & Customization',
    icon: 'pi pi-tag', bg: 'bg-purple-50', color: 'text-purple-600',
    items: [
      {
        q: 'How much does it cost?',
        a: 'Pricing depends on the scope of customization — which features your clinic needs, how complex the workflow is, and the level of ongoing support required. We don\'t have a fixed price list because every clinic is different. We\'ll give you a clear and transparent breakdown during the demo.'
      },
      {
        q: 'What can be customized?',
        a: 'Almost everything: your clinic\'s brand (logo, name, domain), patient registration form fields, user roles and access levels, queue workflow, inbox messaging templates, and more. We build around your workflow — not the other way around.'
      },
      {
        q: 'Are there monthly fees?',
        a: 'This is discussed during the consultation. Some clinics prefer a one-time build cost with a support retainer, while others prefer ongoing arrangements. We\'ll work out a model that makes sense for your clinic\'s situation.'
      },
    ]
  },
  {
    label: 'Setup & Support',
    icon: 'pi pi-headphones', bg: 'bg-amber-50', color: 'text-amber-600',
    items: [
      {
        q: 'How long does setup take?',
        a: 'A standard clinic portal is typically ready within 3–7 days after the demo and scope confirmation. More complex customizations may take longer, which we\'ll communicate clearly upfront.'
      },
      {
        q: 'Do you train our staff?',
        a: 'Yes, training is included in every deployment. We walk through the system with your team — admins, reception, and any staff who will use it — before going live.'
      },
      {
        q: 'What support is available after launch?',
        a: 'Ongoing support is available and discussed as part of the agreement. You\'ll have a direct line to us for questions, bug reports, and improvement requests. We don\'t disappear after launch.'
      },
      {
        q: 'What happens if we need changes after launch?',
        a: 'Minor adjustments and bug fixes are handled as part of support. Feature additions or significant workflow changes may be scoped and billed separately — always transparently discussed before any work begins.'
      },
    ]
  },
]
</script>
