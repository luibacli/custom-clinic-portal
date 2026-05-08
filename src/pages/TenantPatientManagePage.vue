<template>
  <Toast />

  <div class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 space-y-5">

    <!-- Header -->
    <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg">
            <i class="pi pi-heart text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Patients</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Register and manage patient accounts for this clinic.</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <span class="relative w-full sm:w-80">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <InputText
              v-model="search"
              placeholder="Search by name, email, or REF ID…"
              class="w-full pl-10 rounded-xl"
            />
          </span>
          <Button
            label="Register Patient"
            icon="pi pi-user-plus"
            class="rounded-xl w-full sm:w-auto"
            @click="openCreate"
          />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Total Patients</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">{{ patients.length }}</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Registered patient accounts.</p>
      </div>
      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Active</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">{{ activeCount }}</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Accounts with active access.</p>
      </div>
      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Unverified</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">{{ unverifiedCount }}</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Pending email verification.</p>
      </div>
    </div>

    <!-- Register / Edit Patient Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :draggable="false"
      :style="{ width: 'min(950px, 95vw)' }"
      @hide="closeDialog"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center">
            <i class="pi pi-user-plus"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">
              {{ editingId ? 'Edit Patient' : 'Register Patient' }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Fill in the patient details below.</p>
          </div>
        </div>
      </template>

      <div class="space-y-5">
        <!-- Account Information -->
        <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">Account Information</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Username + email preview -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Username <span class="text-red-500">*</span>
              </label>
              <InputText
                v-model="form.username"
                placeholder="e.g. jdelacruz"
                type="text"
                class="w-full"
                :disabled="!!editingId"
              />
              <!-- Live email preview when creating -->
              <div
                v-if="!editingId && generatedEmail"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <i class="pi pi-at text-slate-400 text-xs shrink-0"></i>
                <span class="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">{{ generatedEmail }}</span>
                <span class="ml-auto text-[10px] text-slate-400 whitespace-nowrap">System email</span>
              </div>
              <!-- Locked email when editing -->
              <div
                v-else-if="editingId && form.email"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <i class="pi pi-at text-slate-400 text-xs shrink-0"></i>
                <span class="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">{{ form.email }}</span>
                <span class="ml-auto text-[10px] text-slate-400 whitespace-nowrap shrink-0">System email</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Portal Address</label>
              <div class="flex items-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 gap-2 min-h-[42px]">
                <i class="pi pi-at text-slate-400 text-xs shrink-0"></i>
                <span class="text-xs font-mono text-slate-500 dark:text-slate-400 break-all">{{ emailSuffix }}</span>
              </div>
              <p class="text-[11px] text-slate-400 flex items-center gap-1">
                <i class="pi pi-envelope text-[10px]"></i>
                Full email: <span class="font-mono text-slate-500 dark:text-slate-400">{{ generatedEmail || '…' }}</span>
              </p>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Password {{ editingId ? '(leave blank to keep current)' : '' }}
            </label>
            <InputText
              v-model="form.password"
              :placeholder="editingId ? 'Leave blank to keep current password' : 'Set initial password (auto-generated if blank)'"
              type="password"
              class="w-full"
            />
          </div>
        </div>

        <!-- Personal Information -->
        <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">Personal Information</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                First Name <span class="text-red-500">*</span>
              </label>
              <InputText v-model="form.firstName" placeholder="First name" class="w-full" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Middle Name</label>
              <InputText v-model="form.middleName" placeholder="Optional" class="w-full" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Last Name <span class="text-red-500">*</span>
              </label>
              <InputText v-model="form.lastName" placeholder="Last name" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Additional Details -->
        <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">Additional Details</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Birthday</label>
              <InputText v-model="form.birthday" placeholder="YYYY-MM-DD" class="w-full" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
              <InputText v-model="form.phone" placeholder="09XXXXXXXXX" class="w-full" />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined class="rounded-xl" @click="closeDialog" />
          <Button
            :label="editingId ? 'Update Patient' : 'Register Patient'"
            icon="pi pi-check"
            class="rounded-xl"
            :loading="saving"
            @click="save"
          />
        </div>
      </div>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialogVisible"
      modal
      :draggable="false"
      :style="{ width: 'min(480px, 95vw)' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-300 flex items-center justify-center">
            <i class="pi pi-trash"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Remove Patient</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
          </div>
        </div>
      </template>
      <p class="text-sm text-slate-600 dark:text-slate-300 mb-6">
        Are you sure you want to remove
        <strong>{{ deletingPatient?.firstName }} {{ deletingPatient?.lastName }}</strong>?
      </p>
      <div class="flex flex-col sm:flex-row justify-end gap-3">
        <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined class="rounded-xl" @click="deleteDialogVisible = false" />
        <Button label="Remove" icon="pi pi-trash" severity="danger" class="rounded-xl" :loading="deleting" @click="handleDelete" />
      </div>
    </Dialog>

    <!-- Patient Table -->
    <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
      <div class="p-5 border-b border-slate-200/70 dark:border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Patient Directory</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">All registered patients under this clinic.</p>
          </div>
          <div class="rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-2">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ patients.length }} patient<span v-if="patients.length !== 1">s</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex h-72 w-full items-center justify-center">
        <Loading />
      </div>

      <div v-else class="p-4 md:p-5">
        <DataTable
          :value="patients"
          paginator
          :rows="10"
          stripedRows
          responsiveLayout="scroll"
          class="w-full patients-table"
          size="small"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <template #empty>
            <div class="py-12 text-center">
              <div class="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-4">
                <i class="pi pi-users text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">No patients found</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Click "Register Patient" to add the first patient.</p>
            </div>
          </template>

          <Column field="firstName" header="First Name" style="min-width: 10rem">
            <template #body="{ data }">
              <span class="font-medium text-slate-800 dark:text-white">{{ data.firstName || '—' }}</span>
            </template>
          </Column>

          <Column field="lastName" header="Last Name" style="min-width: 10rem">
            <template #body="{ data }">
              <span class="font-medium text-slate-800 dark:text-white">{{ data.lastName || '—' }}</span>
            </template>
          </Column>

          <Column header="REF ID" style="min-width: 8rem">
            <template #body="{ data }">
              <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 rounded-lg px-2 py-1">
                {{ data._id ? data._id.toString().slice(-8).toUpperCase() : '—' }}
              </span>
            </template>
          </Column>

          <Column field="email" header="Email" style="min-width: 18rem">
            <template #body="{ data }">
              <span class="text-slate-700 dark:text-slate-200 break-all text-xs">{{ data.email || '—' }}</span>
            </template>
          </Column>

          <Column header="Verified" style="min-width: 9rem">
            <template #body="{ data }">
              <Tag
                :value="data.isEmailVerified ? 'Verified' : 'Unverified'"
                :severity="data.isEmailVerified ? 'success' : 'warn'"
                rounded
              />
            </template>
          </Column>

          <Column header="Status" style="min-width: 9rem">
            <template #body="{ data }">
              <button
                @click="handleToggleStatus(data)"
                :disabled="togglingId === data._id"
                class="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
                :class="data.isActive !== false
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="data.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'"
                ></span>
                {{ data.isActive !== false ? 'Active' : 'Inactive' }}
              </button>
            </template>
          </Column>

          <Column header="Actions" style="min-width: 11rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  label="Edit"
                  size="small"
                  class="rounded-xl"
                  @click="openEdit(data)"
                />
                <Button
                  icon="pi pi-trash"
                  label="Remove"
                  size="small"
                  class="rounded-xl bg-red-500 hover:bg-red-600 text-white border-none"
                  @click="openDelete(data)"
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
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import Loading from '../components/Loading.vue'

const toast = useToast()
const authTenantStore = useAuthTenantStore()
const { tenant, userForm } = storeToRefs(authTenantStore)
const { fetchTenantUsers, addUser, updateUser, removeUserTenant, toggleUserStatus, resetUserForm, fetchTenant } = authTenantStore

const tenantId = ref(localStorage.getItem('tenantId'))

const patients      = ref([])
const isLoading     = ref(false)
const saving        = ref(false)
const deleting      = ref(false)
const togglingId    = ref(null)
const search        = ref('')
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingId     = ref(null)
const deletingPatient = ref(null)

const emptyForm = () => ({
  username:    '',
  pin:         '',
  password:    '',
  firstName:   '',
  middleName:  '',
  lastName:    '',
  birthday:    '',
  phone:       '',
  email:       '',
  role:        'patient',
  tenantId:    tenantId.value,
})

const form = ref(emptyForm())

const portalId = computed(() =>
  (tenant.value?.domain || '').split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
)

const emailSuffix = computed(() =>
  portalId.value ? `.${portalId.value}@myclinicaccess.com` : '@myclinicaccess.com'
)

// Live email preview (create mode only)
const generatedEmail = computed(() => {
  const u = (form.value.username || '').toLowerCase().replace(/[^a-z0-9._-]/g, '')
  if (!u || !portalId.value) return ''
  return `${u}${emailSuffix.value}`
})

const activeCount     = computed(() => patients.value.filter(p => p.isActive !== false).length)
const unverifiedCount = computed(() => patients.value.filter(p => !p.isEmailVerified).length)

// Debounced search
let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadPatients(search.value.trim()), 350)
})

const loadPatients = async (searchTerm = '') => {
  isLoading.value = true
  try {
    if (!tenant.value && tenantId.value) {
      await fetchTenant(tenantId.value)
    }
    const res = await fetchTenantUsers(tenantId.value, searchTerm)
    const all = res?.data || []
    patients.value = all.filter(u => u.role === 'patient')
  } catch (err) {
    console.error('Failed to load patients', err.message)
  } finally {
    isLoading.value = false
  }
}

const openCreate = () => {
  editingId.value = null
  form.value = emptyForm()
  dialogVisible.value = true
}

const openEdit = (patient) => {
  editingId.value = patient._id
  form.value = {
    ...emptyForm(),
    ...patient,
    password:  '',
    role:      'patient',
    tenantId:  tenantId.value,
  }
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  editingId.value = null
  form.value = emptyForm()
}

const openDelete = (patient) => {
  deletingPatient.value = patient
  deleteDialogVisible.value = true
}

const save = async () => {
  if (!editingId.value && !form.value.username) {
    toast.add({ severity: 'warn', summary: 'Validation', detail: 'Username is required', life: 3000 })
    return
  }
  if (!form.value.firstName || !form.value.lastName) {
    toast.add({ severity: 'warn', summary: 'Validation', detail: 'First name and last name are required', life: 3000 })
    return
  }

  saving.value = true
  try {
    // Sync local form into the shared store form used by addUser / updateUser
    Object.assign(userForm.value, form.value, { role: 'patient', tenantId: tenantId.value })

    if (editingId.value) {
      const result = await updateUser(editingId.value)
      if (!result.success) throw new Error(result.message)
      toast.add({ severity: 'success', summary: 'Updated', detail: 'Patient updated successfully', life: 3000 })
    } else {
      const result = await addUser()
      if (!result.success) throw new Error(result.message)
      const detail = result.generatedPassword
        ? `Account created.\nEmail: ${result.generatedEmail}\nTemp password: ${result.generatedPassword}`
        : `Account created. Email: ${result.generatedEmail}`
      toast.add({ severity: 'success', summary: 'Patient Registered', detail, life: 8000 })
    }

    await loadPatients(search.value.trim())
    closeDialog()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 })
  } finally {
    saving.value = false
    resetUserForm()
  }
}

const handleDelete = async () => {
  if (!deletingPatient.value) return
  deleting.value = true
  const result = await removeUserTenant(deletingPatient.value._id)
  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 })
  } else {
    patients.value = patients.value.filter(p => p._id !== deletingPatient.value._id)
    toast.add({ severity: 'success', summary: 'Removed', detail: 'Patient removed successfully', life: 3000 })
    deleteDialogVisible.value = false
    deletingPatient.value = null
  }
  deleting.value = false
}

const handleToggleStatus = async (patient) => {
  togglingId.value = patient._id
  const result = await toggleUserStatus(patient._id)
  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Failed', detail: result.message, life: 3000 })
  } else {
    const idx = patients.value.findIndex(p => p._id === patient._id)
    if (idx !== -1) patients.value[idx] = result.data
    toast.add({ severity: 'info', summary: 'Status Updated', detail: result.message, life: 3000 })
  }
  togglingId.value = null
}

onMounted(loadPatients)
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
:deep(.p-select),
:deep(.p-button) {
  border-radius: 0.9rem;
}

:deep(.patients-table .p-datatable-thead > tr > th) {
  background: rgba(248, 250, 252, 0.9);
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
}

:deep(.patients-table .p-datatable-tbody > tr > td) {
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.patients-table .p-paginator) {
  border: none;
  background: transparent;
  padding-top: 1rem;
}

:deep(.p-tag) {
  font-size: 0.72rem;
}

.dark :deep(.patients-table .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.08);
}

.dark :deep(.patients-table .p-datatable-tbody > tr > td) {
  border-color: rgba(255, 255, 255, 0.06);
}
</style>
