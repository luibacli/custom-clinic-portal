<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <div class="w-full max-w-md rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-8 text-center space-y-5">

      <!-- Loading -->
      <div v-if="status === 'loading'" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
        </div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">Verifying your email...</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Please wait a moment.</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <i class="pi pi-check-circle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Email Verified!</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Your account has been verified. You can now log in.</p>
        <Button label="Go to Login" icon="pi pi-sign-in" class="w-full rounded-xl" @click="router.replace('/signin')" />
      </div>

      <!-- Error / Expired -->
      <div v-else class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-red-100 text-red-600 flex items-center justify-center">
          <i class="pi pi-times-circle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Verification Failed</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ errorMsg }}</p>

        <div v-if="!resentSuccess" class="space-y-3">
          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Resend to email</label>
            <InputText v-model="resendEmail" type="email" placeholder="Enter your email" class="w-full" />
          </div>
          <Button
            label="Resend Verification"
            icon="pi pi-envelope"
            class="w-full rounded-xl"
            :loading="resendLoading"
            :disabled="!resendEmail.trim()"
            @click="handleResend"
          />
        </div>

        <div v-else class="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          <i class="pi pi-check mr-2"></i>Verification link sent. Check your inbox.
        </div>

        <Button label="Back to Login" severity="secondary" outlined class="w-full rounded-xl" @click="router.replace('/signin')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../lib/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const router = useRouter()
const route = useRoute()

const status = ref('loading')
const errorMsg = ref('This link is invalid or has expired.')
const resendEmail = ref('')
const resendLoading = ref(false)
const resentSuccess = ref(false)

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    status.value = 'error'
    return
  }

  try {
    await api.get(`/auth-tenant/verify-email?token=${token}`)
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
    errorMsg.value = err.response?.data?.message || 'This link is invalid or has expired.'
  }
})

const handleResend = async () => {
  resendLoading.value = true
  try {
    await api.post('/auth-tenant/resend-verification', { email: resendEmail.value.trim() })
    resentSuccess.value = true
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Failed to resend. Try again.'
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
:deep(.p-inputtext), :deep(.p-button) {
  border-radius: 0.9rem;
  width: 100%;
}
</style>
