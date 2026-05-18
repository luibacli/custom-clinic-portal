<template>
  <div class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div
      class="mb-5 rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6"
    >
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-md"
              :style="brandGradientStyle"
            >
              <i class="pi pi-envelope text-lg"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Email Verification
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review inbound activation links and create patient accounts quickly.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            class="w-full sm:w-auto rounded-xl"
            severity="secondary"
            outlined
            @click="refresh"
          />
        </div>
      </div>
    </div>

 

    <!-- Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :style="{ width: 'min(900px, 95vw)' }"
      :draggable="false"
      :closable="true"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center"
          >
            <i class="pi pi-user-edit"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Create / Save User</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Fill in the patient details before saving the account.
            </p>
          </div>
        </div>
      </template>

      <Form v-slot="$form" :registerForm="registerForm" :resolver="resolver">
        <div class="space-y-5">
          <!-- Section 1 -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Basic Information
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                <InputText
                  v-model="registerForm.email"
                  placeholder="Enter email"
                  type="email"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  PhilHealth ID / PIN
                </label>
                <InputText
                  v-model="registerForm.pin"
                  placeholder="Optional"
                  type="text"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Section 2 -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Patient Name
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">First Name</label>
                <InputText
                  v-model="registerForm.firstName"
                  v-capitalize
                  placeholder="First name"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Middle Name</label>
                <InputText
                  v-model="registerForm.middleName"
                  v-capitalize
                  placeholder="Optional"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Last Name</label>
                <InputText
                  v-model="registerForm.lastName"
                  v-capitalize
                  placeholder="Last name"
                  type="text"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Section 3 -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Additional Details
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Birthday</label>
                <DatePicker v-model="birthdayModel" showIcon fluid dateFormat="mm/dd/yy" class="w-full" />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
                <InputText
                  v-model="registerForm.phone"
                  placeholder="09XXXXXXXXX"
                  type="text"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              outlined
              class="rounded-xl"
              @click="dialogVisible = false"
            />
            <Button
              label="Submit"
              icon="pi pi-check"
              class="rounded-xl"
              @click="save"
            />
          </div>
        </div>
      </Form>
    </Dialog>

    <!-- Content -->
    <div
      class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"
    >
      <div class="p-5 border-b border-slate-200/70 dark:border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
              Activation Inbox
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Open activation links and create user records from incoming emails.
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex h-72 w-full items-center justify-center">
        <Loading />
      </div>

      <div v-else class="p-4 md:p-5">
        <DataTable
          :value="emails"
          stripedRows
          paginator
          :rows="20"
          size="small"
          responsiveLayout="scroll"
          class="w-full careboard-table"
        >
          <template #empty>
            <div class="py-12 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4"
              >
                <i class="pi pi-inbox text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                No emails found
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Try refreshing the inbox or check tenant email routing.
              </p>
            </div>
          </template>

          <Column field="from" header="From" style="min-width: 16rem">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0"
                >
                  <i class="pi pi-send"></i>
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-slate-800 dark:text-white truncate">
                    {{ slotProps.data.from || '—' }}
                  </p>
                  <p class="text-xs text-slate-400 truncate">
                    Sender
                  </p>
                </div>
              </div>
            </template>
          </Column>

          <Column field="to" header="To" style="min-width: 16rem">
            <template #body="slotProps">
              <div class="min-w-0">
                <p class="font-medium text-slate-800 dark:text-white truncate">
                  {{ slotProps.data.to || '—' }}
                </p>
                <p class="text-xs text-slate-400 truncate">
                  Recipient
                </p>
              </div>
            </template>
          </Column>

          <Column field="activationLink" header="Activation Link" style="min-width: 24rem">
            <template #body="slotProps">
              <div class="max-w-[26rem]">
                <a
                  :href="slotProps.data.activationLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:underline break-all font-medium"
                >
                  <i class="pi pi-external-link text-xs"></i>
                  {{ slotProps.data.activationLink || 'No activation link' }}
                </a>
              </div>
            </template>
          </Column>

          <Column header="Actions" style="min-width: 10rem">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  label="Create"
                  size="small"
                  class="rounded-xl"
                  @click="editUser(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../stores/authStore'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useEmailStore } from '../stores/emailStore'
import { useBranding } from '../composables/useBranding'
import Loading from '../components/Loading.vue'
import DatePicker from 'primevue/datepicker'

const { brandGradientStyle } = useBranding()

const toast = useToast()

const authStore = useAuthStore()
const { currentTenantId } = storeToRefs(authStore)

const authTenantStore = useAuthTenantStore()
const { addUserPatient, resetRegisterForm, setTenantId } = useAuthTenantStore()
const { registerForm, dialogVisible } = storeToRefs(authTenantStore)

const birthdayModel = ref(null)
watch(birthdayModel, (val) => {
  if (!val) { registerForm.value.birthday = ''; return }
  const y = val.getFullYear()
  const m = String(val.getMonth() + 1).padStart(2, '0')
  const d = String(val.getDate()).padStart(2, '0')
  registerForm.value.birthday = `${y}-${m}-${d}`
})
watch(dialogVisible, (open) => { if (!open) birthdayModel.value = null })

const emailStore = useEmailStore()
const { emails, loading, emailForm, emailId } = storeToRefs(emailStore)
const { fetchLinksByTenant, updateEmail } = emailStore

const editUser = (user) => {
  registerForm.value = {
    ...registerForm.value,
    email: user.to || '',
    pin: user.pin || '',
    firstName: user.firstName || '',
    middleName: user.middleName || '',
    lastName: user.lastName || '',
    birthday: user.birthday || '',
    phone: user.phone || '',
    tenantId: registerForm.value.tenantId || localStorage.getItem('tenantId') || ''
  }

  emailId.value = user._id
  dialogVisible.value = true
}

const save = async () => {
  try {
    registerForm.value.tenantId = localStorage.getItem('tenantId') || currentTenantId.value
    const res = await addUserPatient()

    if (!res?.success) {
      throw new Error(res.message)
    }

    await updateEmail(emailId.value, (emailForm.value.status = 'created'))

    toast.add({
      severity: 'success',
      summary: 'Created',
      detail: res.message,
      life: 3000
    })

    await refresh()
    dialogVisible.value = false
    resetRegisterForm()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error User Creation',
      detail: error.message
    })
    console.error(error)
  }
}

const refresh = async () => {
  loading.value = true
  try {
    await fetchLinksByTenant(currentTenantId.value)
  } catch (error) {
    console.error({ error: error.message })
  } finally {
    loading.value = false
  }
}

const tenantId = localStorage.getItem('tenantId')

onMounted(async () => {
  loading.value = true
  setTenantId()

  try {
    const id = tenantId
    if (!id) {
      throw new Error('No tenant ID found sa email fetching')
    }

    await fetchLinksByTenant(id)
  } catch (error) {
    console.error({ error: error.message })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
:deep(.p-dialog) {
  border-radius: 1.5rem;
  overflow: hidden;
}

:deep(.p-dialog-header) {
  padding: 1.25rem 1.5rem 0.75rem;
}

:deep(.p-dialog-content) {
  padding: 1rem 1.5rem 1.5rem;
}

:deep(.p-inputtext),
:deep(.p-button) {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-button) {
  border-radius: 0.9rem;
}

:deep(.careboard-table .p-datatable-header) {
  background: transparent;
  border: none;
}

:deep(.careboard-table .p-datatable-thead > tr > th) {
  background: rgba(248, 250, 252, 0.9);
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
}

:deep(.dark .careboard-table .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.08);
}

:deep(.careboard-table .p-datatable-tbody > tr > td) {
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.dark .careboard-table .p-datatable-tbody > tr > td) {
  border-color: rgba(255, 255, 255, 0.06);
}

:deep(.careboard-table .p-paginator) {
  border: none;
  background: transparent;
  padding-top: 1rem;
}

:deep(.p-column-header-content) {
  white-space: nowrap;
}
</style>