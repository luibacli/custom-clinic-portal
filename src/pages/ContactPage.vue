<template>
  <PublicLayout>
    <div class="max-w-5xl mx-auto px-6 py-12">

      <!-- Page Header -->
      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-envelope"></i> Support
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Have a question or concern? Fill out the form below and we'll get back to you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <!-- Success State -->
          <div
            v-if="submitted"
            class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 p-10 flex flex-col items-center text-center gap-4"
          >
            <div class="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <i class="pi pi-check-circle text-3xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white">Message Sent</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Thank you for reaching out. We'll respond to <strong class="text-slate-700 dark:text-slate-300">{{ form.email }}</strong> as soon as possible.
              </p>
            </div>
            <button
              class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              @click="resetForm"
            >
              Send another message
            </button>
          </div>

          <!-- Form -->
          <form
            v-else
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5"
            @submit.prevent="handleSubmit"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <InputText
                  v-model="form.name"
                  placeholder="Your full name"
                  class="w-full"
                  :class="{ 'p-invalid': errors.name }"
                />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <InputText
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full"
                  :class="{ 'p-invalid': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Subject <span class="text-red-500">*</span>
              </label>
              <InputText
                v-model="form.subject"
                placeholder="What is your inquiry about?"
                class="w-full"
                :class="{ 'p-invalid': errors.subject }"
              />
              <p v-if="errors.subject" class="mt-1 text-xs text-red-500">{{ errors.subject }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.message"
                rows="5"
                placeholder="Describe your question or concern in detail..."
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition"
                :class="{ 'border-red-400 focus:ring-red-500/20 focus:border-red-400': errors.message }"
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
            </div>

            <Button
              type="submit"
              label="Send Message"
              icon="pi pi-send"
              severity="info"
              raised
              :loading="sending"
              class="w-full !rounded-xl !py-3"
            />
          </form>
        </div>

        <!-- Sidebar: Clinic Info -->
        <div class="space-y-4">

          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4">Clinic Information</h3>
            <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div class="flex items-start gap-3">
                <span class="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-map-marker text-xs"></i>
                </span>
                <div>
                  <p class="font-medium text-slate-700 dark:text-slate-300">Address</p>
                  <p class="mt-0.5 leading-relaxed">Clinic Address<br />City, Province, Philippines</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-phone text-xs"></i>
                </span>
                <div>
                  <p class="font-medium text-slate-700 dark:text-slate-300">Phone</p>
                  <p class="mt-0.5">+63 (000) 000-0000</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-envelope text-xs"></i>
                </span>
                <div>
                  <p class="font-medium text-slate-700 dark:text-slate-300">Email</p>
                  <p class="mt-0.5">support@clinic.example.com</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <i class="pi pi-clock text-xs"></i>
                </span>
                <div>
                  <p class="font-medium text-slate-700 dark:text-slate-300">Office Hours</p>
                  <p class="mt-0.5">Mon – Fri: 8:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5">
            <p class="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <i class="pi pi-info-circle"></i> Note
            </p>
            <p class="mt-2 text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Contact details above are managed by the clinic. My Clinic Access does not handle direct patient support requests.
              For system-level technical issues, please contact your clinic administrator.
            </p>
          </div>

        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import api from '../lib/axios'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const submitted = ref(false)

const validate = () => {
  let valid = true
  errors.name = errors.email = errors.subject = errors.message = ''

  if (!form.name.trim()) { errors.name = 'Name is required.'; valid = false }
  if (!form.email.trim()) { errors.email = 'Email is required.'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Enter a valid email address.'; valid = false }
  if (!form.subject.trim()) { errors.subject = 'Subject is required.'; valid = false }
  if (!form.message.trim()) { errors.message = 'Message is required.'; valid = false }
  else if (form.message.trim().length < 10) { errors.message = 'Message must be at least 10 characters.'; valid = false }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return
  sending.value = true
  try {
    await api.post('/contact', {
      name:    form.name.trim(),
      email:   form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    })
    submitted.value = true
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg) errors.message = msg
    else errors.message = 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}

const resetForm = () => {
  form.name = form.email = form.subject = form.message = ''
  submitted.value = false
}
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
</style>
