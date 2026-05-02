<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <div class="w-full max-w-md rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-8">

      <!-- Invalid / expired token -->
      <div v-if="tokenInvalid" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-red-100 text-red-600 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Link Expired</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">This reset link is invalid or has expired. Please request a new one.</p>
        <Button label="Back to Login" class="w-full rounded-xl" @click="router.replace('/signin')" />
      </div>

      <!-- Success state -->
      <div v-else-if="success" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <i class="pi pi-check-circle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Password Updated</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Your password has been reset. Redirecting to login...</p>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <div>
          <p class="text-sm font-medium text-blue-600 dark:text-blue-300 uppercase tracking-widest">Account Security</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">Set New Password</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter and confirm your new password below.</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">New Password</label>
            <Password
              v-model="form.newPassword"
              toggleMask
              placeholder="Enter new password"
              class="w-full"
              inputClass="w-full"
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</label>
            <Password
              v-model="form.confirmPassword"
              :feedback="false"
              toggleMask
              placeholder="Confirm new password"
              class="w-full"
              inputClass="w-full"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div
          v-if="errorMsg"
          class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          <i class="pi pi-exclamation-triangle mr-2"></i>{{ errorMsg }}
        </div>

        <Button
          label="Reset Password"
          icon="pi pi-check"
          class="w-full rounded-xl"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleReset"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthTenantStore } from '../stores/authTenantStore'


const router = useRouter()
const route = useRoute()
const authTenantStore = useAuthTenantStore()

const token = ref('')
const form = ref({ newPassword: '', confirmPassword: '' })
const isLoading = ref(false)
const errorMsg = ref('')
const tokenInvalid = ref(false)
const success = ref(false)

onMounted(() => {
  token.value = route.query.token || ''
  if (!token.value) tokenInvalid.value = true
})

const handleReset = async () => {
  errorMsg.value = ''

  if (!form.value.newPassword || !form.value.confirmPassword) {
    errorMsg.value = 'All fields are required.'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  if (form.value.newPassword.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters.'
    return
  }

  isLoading.value = true
  const result = await authTenantStore.resetPassword(token.value, form.value.newPassword, form.value.confirmPassword)
  isLoading.value = false

  if (!result.success) {
    if (result.message?.toLowerCase().includes('invalid') || result.message?.toLowerCase().includes('expired')) {
      tokenInvalid.value = true
    } else {
      errorMsg.value = result.message
    }
    return
  }

  success.value = true
  setTimeout(() => router.replace('/signin'), 2500)
}
</script>

<style scoped>
:deep(.p-password),
:deep(.p-password-input),
:deep(.p-button) {
  width: 100%;
}

:deep(.p-password-input),
:deep(.p-button) {
  border-radius: 0.9rem;
}
</style>
