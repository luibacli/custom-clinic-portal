<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-20 text-white">
      <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-cyan-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <i class="pi pi-calendar"></i> Free Demo
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
          Book a Free Demo
        </h1>
        <p class="mt-4 text-blue-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          30 minutes. No commitment. We walk you through the full portal with your clinic as the example.
        </p>
      </div>
    </section>

    <!-- What to Expect Strip -->
    <section class="py-10 bg-slate-900 text-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="item in expects" :key="item.label" class="text-center">
            <i :class="item.icon" class="text-blue-400 text-2xl block mb-2"></i>
            <p class="text-sm font-semibold">{{ item.label }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ item.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content: Form + Sidebar -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">

          <!-- Form (3/5 width) -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="p-6 sm:p-8 border-b border-slate-100">
                <h2 class="text-xl font-bold text-slate-900">Tell Us About Your Clinic</h2>
                <p class="mt-1 text-sm text-slate-500">The more we know, the more useful your demo will be.</p>
              </div>

              <!-- Success State -->
              <div v-if="submitted" class="p-10 flex flex-col items-center text-center gap-4">
                <div class="h-18 w-18 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <i class="pi pi-check-circle text-5xl"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-900 mt-4">Demo Request Received!</h3>
                  <p class="mt-2 text-sm text-slate-500 max-w-sm">
                    Thank you, <strong class="text-slate-700">{{ form.contactName }}</strong>. We'll reach out to
                    <strong class="text-slate-700">{{ form.email }}</strong> within 1 business day to schedule your demo.
                  </p>
                </div>
                <div class="mt-4 w-full max-w-sm space-y-2">
                  <div v-for="next in nextSteps" :key="next" class="flex items-center gap-2 text-sm text-slate-600 text-left">
                    <i class="pi pi-arrow-right text-blue-500 text-xs shrink-0"></i>
                    {{ next }}
                  </div>
                </div>
                <button class="mt-4 text-sm text-blue-600 hover:underline font-medium" @click="resetForm">
                  Submit another request
                </button>
              </div>

              <!-- Form Fields -->
              <form v-else class="p-6 sm:p-8 space-y-5" @submit.prevent="handleSubmit">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">
                      Clinic Name <span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="form.clinicName" placeholder="e.g. Santos Medical Clinic" class="w-full"
                      :class="{ 'p-invalid': errors.clinicName }" />
                    <p v-if="errors.clinicName" class="mt-1 text-xs text-red-500">{{ errors.clinicName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">
                      Contact Person <span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="form.contactName" placeholder="Your full name" class="w-full"
                      :class="{ 'p-invalid': errors.contactName }" />
                    <p v-if="errors.contactName" class="mt-1 text-xs text-red-500">{{ errors.contactName }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address <span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="form.email" type="email" placeholder="you@clinic.com" class="w-full"
                      :class="{ 'p-invalid': errors.email }" />
                    <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number <span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="form.phone" type="tel" placeholder="09XX-XXX-XXXX" class="w-full"
                      :class="{ 'p-invalid': errors.phone }" />
                    <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Clinic Type</label>
                  <Select
                    v-model="form.clinicType"
                    :options="clinicTypeOptions"
                    placeholder="Select your clinic type"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Challenges <span class="text-slate-400 font-normal">(select all that apply)</span>
                  </label>
                  <MultiSelect
                    v-model="form.challenges"
                    :options="challengeOptions"
                    placeholder="What problems are you facing?"
                    class="w-full"
                    display="chip"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">
                    Message / Additional Requirements
                  </label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    placeholder="Tell us anything specific about your clinic's workflow or what you'd like to see in the demo..."
                    class="w-full rounded-xl border border-slate-200 bg-white text-slate-800 px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  label="Request My Free Demo"
                  icon="pi pi-send"
                  severity="info"
                  raised
                  :loading="sending"
                  class="w-full !rounded-2xl !py-4 !text-base !font-bold"
                />

                <p class="text-center text-xs text-slate-400">
                  By submitting, you agree to be contacted about your demo request. We never share your information with third parties.
                </p>
              </form>
            </div>
          </div>

          <!-- Sidebar (2/5 width) -->
          <div class="lg:col-span-2 space-y-5">

            <!-- What you'll see -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i class="pi pi-eye text-blue-500"></i>
                What You'll See in the Demo
              </h3>
              <ul class="space-y-3">
                <li v-for="item in demoItems" :key="item" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="pi pi-check-circle text-emerald-500 mt-0.5 shrink-0 text-xs"></i>
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Why Book -->
            <div class="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-md">
              <h3 class="font-bold mb-3 flex items-center gap-2">
                <i class="pi pi-star text-yellow-300"></i>
                Why Book a Demo?
              </h3>
              <ul class="space-y-2 text-sm text-blue-100">
                <li class="flex items-start gap-2">
                  <i class="pi pi-check mt-0.5 shrink-0 text-xs text-white"></i>
                  See the system built around your type of clinic
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-check mt-0.5 shrink-0 text-xs text-white"></i>
                  Get a realistic scope and pricing discussion
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-check mt-0.5 shrink-0 text-xs text-white"></i>
                  Ask any questions — no sales pressure
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-check mt-0.5 shrink-0 text-xs text-white"></i>
                  Walk away knowing if this is the right fit
                </li>
              </ul>
            </div>

            <!-- Response time -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
              <i class="pi pi-clock text-emerald-600 text-lg mt-0.5 shrink-0"></i>
              <div>
                <p class="text-sm font-semibold text-emerald-800">We respond within 1 business day</p>
                <p class="text-xs text-emerald-700 mt-0.5">Monday – Friday, 8AM – 5PM PHT</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

  </LandingLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import LandingLayout from '../layouts/LandingLayout.vue'

const form = reactive({
  clinicName:  '',
  contactName: '',
  email:       '',
  phone:       '',
  clinicType:  null,
  challenges:  [],
  message:     '',
})

const errors  = reactive({ clinicName: '', contactName: '', email: '', phone: '' })
const sending   = ref(false)
const submitted = ref(false)

const clinicTypeOptions = [
  'General Practice', 'Specialty Clinic', 'OB-GYN', 'Pediatrics', 'Dental', 'Internal Medicine', 'Other'
]

const challengeOptions = [
  'Manual patient registration',
  'Queue management & long wait times',
  'Lack of clinic-to-patient communication',
  'Disorganized patient records',
  'Appointment tracking',
  'Multiple staff access management',
]

const demoItems = [
  'Live patient registration flow',
  'Queue management dashboard',
  'Clinic-to-patient inbox messaging',
  'Operations overview dashboard',
  'Digital patient ID generation',
  'Role-based access (Admin, Staff, Patient)',
  'How customization works for your clinic',
  'Realistic scope and pricing discussion',
]

const nextSteps = [
  'We\'ll contact you within 1 business day',
  'We\'ll confirm a time that works for you',
  'Your 30-minute demo is live and personalized',
]

const validate = () => {
  let ok = true
  errors.clinicName = errors.contactName = errors.email = errors.phone = ''

  if (!form.clinicName.trim())  { errors.clinicName = 'Clinic name is required.'; ok = false }
  if (!form.contactName.trim()) { errors.contactName = 'Contact name is required.'; ok = false }
  if (!form.email.trim()) {
    errors.email = 'Email is required.'; ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'; ok = false
  }
  if (!form.phone.trim()) { errors.phone = 'Phone number is required.'; ok = false }

  return ok
}

const handleSubmit = async () => {
  if (!validate()) return
  sending.value = true
  await new Promise(r => setTimeout(r, 1000))
  sending.value = false
  submitted.value = true
}

const resetForm = () => {
  Object.assign(form, { clinicName: '', contactName: '', email: '', phone: '', clinicType: null, challenges: [], message: '' })
  submitted.value = false
}

const expects = [
  { icon: 'pi pi-clock',       label: '30 Minutes',     sub: 'Focused walkthrough' },
  { icon: 'pi pi-tag',         label: 'No Cost',        sub: 'Completely free' },
  { icon: 'pi pi-sliders',     label: 'Personalized',   sub: 'Tailored to your clinic' },
  { icon: 'pi pi-check-circle',label: 'No Obligation',  sub: 'Zero commitment' },
]
</script>

<style scoped>
:deep(.p-inputtext) {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  transition: all 0.2s ease;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  border-color: rgb(59 130 246);
}

:deep(.p-inputtext.p-invalid) {
  border-color: rgb(239 68 68);
}

:deep(.p-select),
:deep(.p-multiselect) {
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
}
</style>
