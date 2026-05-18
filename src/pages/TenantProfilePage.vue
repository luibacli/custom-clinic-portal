<template>
  <Toast />

  <div
    class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6"
  >
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
          My Profile
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-300 mt-1">
          Manage your personal account information and update your password.
        </p>
      </div>
    </div>

    <div v-if="isLoading">
      <Loading />
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <!-- Left Profile Summary -->
      <div class="xl:col-span-4 2xl:col-span-3">
        <div
          class="rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl"
        >
          <div class="p-6">
            <div class="flex flex-col items-center text-center">
              <div class="relative">
                <div
                  class="w-28 h-28 rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white/70 dark:border-white/10"
                >
                  <img
                    v-if="photoUrl"
                    :src="photoUrl"
                    alt="Profile Photo"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ initials }}</span>
                </div>

                <Button
                  icon="pi pi-camera"
                  class="!w-10 !h-10 !rounded-full !absolute -bottom-1 -right-1 shadow-lg"
                  severity="contrast"
                  @click="triggerFileInput"
                  :loading="photoUploading"
                />

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>

              <h2 class="mt-4 text-xl font-bold text-slate-800 dark:text-white">
                {{ user.firstName }} {{ user.lastName }}
              </h2>

              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                User Account
              </p>

              <div class="mt-5 w-full space-y-3">
                <div
                  class="rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3 text-left"
                >
                  <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">Email</p>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-100 break-all">
                    {{ user.email || '—' }}
                  </p>
                </div>

                <div
                  class="rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3 text-left"
                >
                  <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">PhilHealth PIN</p>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {{ user.pin || '—' }}
                  </p>
                </div>

                <div
                  class="rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 px-4 py-3 text-left"
                >
                  <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">Birthday</p>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {{ formattedBirthday }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Forms -->
      <div class="xl:col-span-8 2xl:col-span-9 space-y-4">
        <!-- Personal Information -->
        <div
          class="rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl"
        >
          <div class="p-5 md:p-6 border-b border-slate-200/70 dark:border-white/10">
            <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
              Personal Information
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update your account details below.
            </p>
          </div>

          <div class="p-5 md:p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email Address
                </label>
                <InputText
                  v-model="userForm.email"
                  type="email"
                  placeholder="Enter email"
                  class="w-full"
                  disabled
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  PhilHealth PIN
                </label>
                <InputText
                  v-model="userForm.pin"
                  placeholder="Enter PIN"
                  class="w-full"
                  disabled
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  First Name
                </label>
                <InputText
                  v-model="userForm.firstName"
                  v-capitalize
                  placeholder="Enter first name"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Middle Name
                </label>
                <InputText
                  v-model="userForm.middleName"
                  v-capitalize
                  placeholder="Enter middle name"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Last Name
                </label>
                <InputText
                  v-model="userForm.lastName"
                  v-capitalize
                  placeholder="Enter last name"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Birthday
                </label>
                <DatePicker
                  v-model="birthdayModel"
                  showIcon
                  fluid
                  dateFormat="mm/dd/yy"
                  class="w-full"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Phone
                </label>
                <InputText
                  v-model="userForm.phone"
                  placeholder="Enter phone number"
                  class="w-full"
                />
              </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                outlined
                class="rounded-xl"
                @click="loadProfile"
              />
              <Button
                label="Save Profile"
                icon="pi pi-save"
                class="rounded-xl"
                @click="update"
              />
            </div>
          </div>
        </div>

        <!-- Change Password -->
        <div
          class="rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl"
        >
          <div class="p-5 md:p-6 border-b border-slate-200/70 dark:border-white/10">
            <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
              Change Password
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              For security, choose a strong password that you do not use elsewhere.
            </p>
          </div>

          <div class="p-5 md:p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Current Password
                </label>
                <Password
                  v-model="passwordForm.currentPassword"
                  :feedback="false"
                  toggleMask
                  placeholder="Enter current password"
                  class="w-full"
                  inputClass="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  New Password
                </label>
                <Password
                  v-model="passwordForm.newPassword"
                  toggleMask
                  placeholder="Enter new password"
                  class="w-full"
                  inputClass="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Confirm New Password
                </label>
                <Password
                  v-model="passwordForm.confirmPassword"
                  :feedback="false"
                  toggleMask
                  placeholder="Confirm new password"
                  class="w-full"
                  inputClass="w-full"
                />
              </div>
            </div>

            <div
              class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 px-4 py-3"
            >
              <div class="flex items-start gap-3">
                <i class="pi pi-info-circle text-amber-600 dark:text-amber-300 mt-0.5"></i>
                <div>
                  <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Password Tips
                  </p>
                  <p class="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                label="Clear"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                class="rounded-xl"
                @click="resetPasswordForm"
              />
              <Button
                label="Update Password"
                icon="pi pi-lock"
                severity="contrast"
                class="rounded-xl"
                @click="changePass"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

import DatePicker from 'primevue/datepicker'
import { storeToRefs } from 'pinia'
import Loading from '../components/Loading.vue'

const toast = useToast()
const authTenantStore = useAuthTenantStore()

const {
  fetchUserTenant,
  updateUser,
  uploadPhoto,
  handleChangePassword,
  resetPasswordForm
} = authTenantStore

const { userForm, passwordForm } = storeToRefs(authTenantStore)

const isLoading = ref(false)
const photoUploading = ref(false)
const fileInput = ref(null)

const user = ref({
  _id: '',
  email: '',
  pin: '',
  firstName: '',
  middleName: '',
  lastName: '',
  birthday: '',
  phone: '',
  profilePhoto: {
    url: '',
    publicId: ''
  }
})

const birthdayModel = ref(null)

const initials = computed(() => {
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase() || 'U'
})

const photoUrl = computed(() => {
  return (
    user.value?.profilePhoto?.url ||
    userForm.value?.profilePhoto?.url ||
    ''
  )
})

const formattedBirthday = computed(() => {
  const birthday = user.value?.birthday || userForm.value?.birthday
  if (!birthday) return '—'

  const date = new Date(birthday)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

watch(birthdayModel, (value) => {
  if (!value) {
    userForm.value.birthday = ''
    return
  }

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  userForm.value.birthday = `${year}-${month}-${day}`
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const loadProfile = async () => {
  isLoading.value = true
  try {
    const result = await fetchUserTenant()

    if (!result?.success) {
      throw new Error('Profile not found')
    }

    const data = result.data

    user.value = {
      ...data,
      profilePhoto: data.profilePhoto || { url: '', publicId: '' }
    }

    userForm.value = {
      ...data,
      profilePhoto: data.profilePhoto || { url: '', publicId: '' }
    }

    birthdayModel.value = data.birthday ? new Date(data.birthday) : null
  } catch (error) {
    console.error('Profile load error:', error.message)
    toast.add({
      severity: 'error',
      summary: 'Failed to load profile',
      detail: error.message || 'Something went wrong.',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const update = async () => {
  try {
    const data = await updateUser(userForm.value._id)

    if (!data) {
      throw new Error("Can't update user data")
    }

    await loadProfile()

    toast.add({
      severity: 'success',
      summary: 'Profile updated',
      detail: data.message || 'Profile updated successfully.',
      life: 3000
    })
  } catch (error) {
    console.error('Update profile error:', error.message)
    toast.add({
      severity: 'error',
      summary: 'Update failed',
      detail: error.message || 'Failed to update profile.',
      life: 3000
    })
  }
}

const changePass = async () => {
  const data = await handleChangePassword()

  if (!data.success) {
    toast.add({
      severity: 'error',
      summary: 'Failed to update password',
      detail: data.message,
      life: 3000
    })
    return
  }

  resetPasswordForm()

  toast.add({
    severity: 'success',
    summary: 'Password changed successfully',
    detail: data.message,
    life: 3000
  })
}

const handleFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file || !user.value?._id) return

  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid file',
      detail: 'Please select an image file only.',
      life: 3000
    })
    event.target.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: 'File too large',
      detail: 'Please upload an image below 2MB.',
      life: 3000
    })
    event.target.value = ''
    return
  }

  photoUploading.value = true

  try {
    const data = await uploadPhoto(user.value._id, file)

    await loadProfile()

    toast.add({
      severity: 'success',
      summary: 'Photo uploaded',
      detail: data?.message || 'Profile photo uploaded successfully.',
      life: 3000
    })
  } catch (error) {
    console.error('Failed to upload photo:', error)
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: error?.response?.data?.message || 'Failed to upload photo.',
      life: 3000
    })
  } finally {
    photoUploading.value = false
    event.target.value = ''
  }
}

onMounted(async () => {
  await loadProfile()
})
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-password),
:deep(.p-password-input),
:deep(.p-datepicker),
:deep(.p-button) {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-password-input),
:deep(.p-datepicker-input),
:deep(.p-button) {
  border-radius: 0.9rem;
}

:deep(.p-password-input),
:deep(.p-datepicker-input) {
  width: 100%;
}
</style>