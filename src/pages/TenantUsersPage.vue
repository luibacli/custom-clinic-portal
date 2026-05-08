<template>
  <Toast />

  <div class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 space-y-5">
    <!-- Header -->
    <div
      class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6"
    >
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg"
          >
            <i class="pi pi-users text-xl"></i>
          </div>

          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Accounts
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage tenant users, create new accounts, and update account details.
            </p>
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
            label="Add User"
            icon="pi pi-plus"
            class="rounded-xl w-full sm:w-auto"
            @click="dialogVisible = true"
          />
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5"
      >
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Total Users</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
          {{ tenants.length }}
        </h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Total registered accounts under this tenant.
        </p>
      </div>

      <div
        class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5"
      >
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Admins</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
          {{ adminCount }}
        </h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Accounts with administrator access.
        </p>
      </div>

      <div
        class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5"
      >
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Patients</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
          {{ patientCount }}
        </h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Patient accounts currently in the system.
        </p>
      </div>
    </div>

    <!-- Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :draggable="false"
      :style="{ width: 'min(950px, 95vw)' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center"
          >
            <i class="pi pi-user-edit"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">
              {{ userForm._id ? 'Edit User' : 'Save User' }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Fill in the user details below.
            </p>
          </div>
        </div>
      </template>

      <Form v-slot="$form" :userForm="userForm" :resolver="resolver">
        <div class="space-y-5">
          <!-- Basic -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Account Information
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Username -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Username <span class="text-red-500">*</span>
                </label>
                <InputText
                  v-model="userForm.username"
                  placeholder="e.g. jdelacruz"
                  type="text"
                  class="w-full"
                  :disabled="!!userForm._id"
                  @input="userForm.username = userForm.username.toLowerCase().replace(/[^a-z0-9._-]/g, '')"
                />
              </div>

              <!-- Portal address (read-only) -->
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

            <div class="grid grid-cols-1 gap-4 mt-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password {{ userForm._id ? '(leave blank to keep current)' : '' }}
                </label>
                <InputText
                  v-model="userForm.password"
                  :placeholder="userForm._id ? 'Leave blank to keep current password' : 'Set initial password (auto-generated if blank)'"
                  type="password"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Name -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Personal Information
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">First Name</label>
                <InputText
                  v-model="userForm.firstName"
                  placeholder="First name"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Middle Name</label>
                <InputText
                  v-model="userForm.middleName"
                  placeholder="Optional"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Last Name</label>
                <InputText
                  v-model="userForm.lastName"
                  placeholder="Last name"
                  type="text"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Details -->
          <div
            class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">
              Additional Details
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Birthday</label>
                <InputText
                  v-model="userForm.birthday"
                  placeholder="YYYY-MM-DD"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
                <InputText
                  v-model="userForm.phone"
                  placeholder="09XXXXXXXXX"
                  type="text"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-200">User Role</label>
                <Select
                  v-model="userForm.role"
                  placeholder="Select role"
                  :options="roleOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                />
              </div>
            </div>
          </div>

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
              :label="userForm._id ? 'Update User' : 'Submit'"
              icon="pi pi-check"
              class="rounded-xl"
              @click="save"
            />
            
          </div>
        </div>
      </Form>
    </Dialog>


        <!-- Dialog For Delete -->
    <Dialog
      v-model:visible="dialogRemoveVisible"
      modal
      :draggable="false"
      :style="{ width: 'min(950px, 95vw)' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center"
          >
            <i class="pi pi-user-edit"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">
              {{ "Remove User" }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this user?
            </p>
          </div>
        </div>
      </template>


          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              outlined
              class="rounded-xl"
              @click="dialogRemoveVisible = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="rounded-xl"
              @click="handleDelete"
            />
            
          </div>
      
   
    </Dialog>

    <!-- Table -->
    <div
      class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"
    >
      <div class="p-5 border-b border-slate-200/70 dark:border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
              User Directory
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and manage all tenant user accounts.
            </p>
          </div>

          <div
            class="rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-2"
          >
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Showing {{ tenants.length }} record<span v-if="tenants.length !== 1">s</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex h-72 w-full items-center justify-center">
        <Loading />
      </div>

      <div v-else class="p-4 md:p-5">
        <DataTable
          :value="tenants"
          paginator
          :rows="10"
          stripedRows
          responsiveLayout="scroll"
          class="w-full accounts-table"
          size="small"
        >
          <template #empty>
            <div class="py-12 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4"
              >
                <i class="pi pi-users text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                No users found
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Add a user to start building your account directory.
              </p>
            </div>
          </template>

          <Column field="firstName" header="First Name" style="min-width: 12rem">
            <template #body="slotProps">
              <span class="font-medium text-slate-800 dark:text-white">
                {{ slotProps.data.firstName || '—' }}
              </span>
            </template>
          </Column>

          <Column field="lastName" header="Last Name" style="min-width: 12rem">
            <template #body="slotProps">
              <span class="font-medium text-slate-800 dark:text-white">
                {{ slotProps.data.lastName || '—' }}
              </span>
            </template>
          </Column>

          <Column header="REF ID" style="min-width: 8rem">
            <template #body="slotProps">
              <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 rounded-lg px-2 py-1">
                {{ slotProps.data._id ? slotProps.data._id.toString().slice(-8).toUpperCase() : '—' }}
              </span>
            </template>
          </Column>

          <Column field="email" header="Email" style="min-width: 18rem">
            <template #body="slotProps">
              <span class="text-slate-700 dark:text-slate-200 break-all">
                {{ slotProps.data.email || '—' }}
              </span>
            </template>
          </Column>

          <Column field="role" header="Role" style="min-width: 10rem">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.role || '—'"
                :severity="slotProps.data.role === 'admin' ? 'contrast' : 'info'"
                rounded
              />
            </template>
          </Column>

          <Column header="Verified" style="min-width: 9rem">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.isEmailVerified ? 'Verified' : 'Unverified'"
                :severity="slotProps.data.isEmailVerified ? 'success' : 'warn'"
                rounded
              />
            </template>
          </Column>

          <Column header="Status" style="min-width: 9rem">
            <template #body="slotProps">
              <button
                @click="handleToggleStatus(slotProps.data)"
                :disabled="togglingId === slotProps.data._id"
                class="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
                :class="slotProps.data.isActive !== false
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="slotProps.data.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'"
                ></span>
                {{ slotProps.data.isActive !== false ? 'Active' : 'Inactive' }}
              </button>
            </template>
          </Column>

          <Column header="Actions" style="min-width: 10rem">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  label="Edit"
                  size="small"
                  class="rounded-xl"
                  @click="editUser(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  label="Remove"
                  size="small"
                  class="rounded-xl bg-red-500 hover:bg-red-600 text-white border-none"
                  @click="removeUser(slotProps.data)"
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
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useToast } from 'primevue/usetoast'
import Loading from '../components/Loading.vue'
import Tag from 'primevue/tag'

const toast = useToast()
const search = ref('')

const authTenantStore = useAuthTenantStore()

const { userForm, dialogVisible, dialogRemoveVisible, isLoading, roleOptions, tenants, tenant } = storeToRefs(authTenantStore)
const { addUser, updateUser, fetchTenantUsers, resetUserForm, removeUserTenant, toggleUserStatus } = authTenantStore

const togglingId = ref(null)

const portalId = computed(() =>
  (tenant.value?.domain || '').split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
)

const emailSuffix = computed(() =>
  portalId.value ? `.${portalId.value}@myclinicaccess.com` : '@myclinicaccess.com'
)

const generatedEmail = computed(() => {
  const u = (userForm.value.username || '').toLowerCase().replace(/[^a-z0-9._-]/g, '')
  if (!u || !portalId.value) return ''
  return `${u}${emailSuffix.value}`
})

const resolver = ({ values }) => {
  const error = {}

  if (!values.username) {
    error.username = [{ message: 'Username is required' }]
  }
  if (!values.role) {
    error.role = [{ message: 'Role is required' }]
  }
  if (!values.firstName) {
    error.firstName = [{ message: 'First Name is required' }]
  }
  if (!values.lastName) {
    error.lastName = [{ message: 'Last Name is required' }]
  }

  return {
    values,
    errors: error
  }
}

const tenantId = ref(null)
let searchTimer = null

const adminCount = computed(() => (tenants.value || []).filter((i) => i.role === 'admin').length)
const patientCount = computed(() => (tenants.value || []).filter((i) => i.role === 'patient').length)

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadTenantUsers(search.value.trim())
  }, 350)
})

const save = async () => {
  isLoading.value = true

  try {
    if (userForm.value._id) {
      await updateUser(userForm.value._id)

      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'User updated successfully',
        life: 3000
      })
    } else {
      const result = await addUser()

      if (!result.success) {
        throw new Error(result.message)
      }

      const detail = result.generatedPassword
        ? `Account created. Email: ${result.generatedEmail} | Temp password: ${result.generatedPassword}`
        : `Account created. Email: ${result.generatedEmail}`

      toast.add({
        severity: 'success',
        summary: 'User Created',
        detail,
        life: 8000,
      })
    }

    await loadTenantUsers()
    dialogVisible.value = false
    resetUserForm()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: userForm.value._id ? 'Error Update' : 'Error User Creation',
      detail: `Error: ${error.message}`,
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const editUser = (user) => {
  userForm.value = { ...user }
  dialogVisible.value = true
}

const removeUser = (user) => {
  userForm.value = { ...user }
  dialogRemoveVisible.value = true
  
}

const loadTenantUsers = async (searchTerm = '') => {
  isLoading.value = true
  tenantId.value = localStorage.getItem('tenantId')
  userForm.value.tenantId = tenantId.value

  try {
    const tasks = [fetchTenantUsers(tenantId.value, searchTerm)]
    if (!tenant.value && tenantId.value) {
      tasks.push(authTenantStore.fetchTenant(tenantId.value))
    }
    const [users] = await Promise.all(tasks)
    tenants.value = users?.data || []
  } catch (error) {
    console.error('Failed to load tenant', error.message)
  } finally {
    isLoading.value = false
  }
}

const handleToggleStatus = async (user) => {
  togglingId.value = user._id
  const result = await toggleUserStatus(user._id)

  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Failed', detail: result.message, life: 3000 })
  } else {
    const idx = tenants.value.findIndex(u => u._id === user._id)
    if (idx !== -1) tenants.value[idx] = result.data
    toast.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: result.message,
      life: 3000
    })
  }
  togglingId.value = null
}

const handleDelete = async () => {

  const deleted = await removeUserTenant(userForm.value._id);
  if (!deleted.success) {
    toast.add({
      severity: "error",
      summary: "Failed to remove user",
      detail: `${deleted.message}`,
      life: 3000,
    })
    return
  } else {
    await loadTenantUsers();
    dialogRemoveVisible.value = false
    toast.add({
      severity: "success",
      summary: "Remove User Successfuly",
      detail: "The user has been removed successfully ",
      life: 3000,
    })
  }
}

onMounted(async () => {
  await loadTenantUsers()
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
:deep(.p-select),
:deep(.p-button) {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-button) {
  border-radius: 0.9rem;
}

:deep(.accounts-table .p-datatable-thead > tr > th) {
  background: rgba(248, 250, 252, 0.9);
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
}

:deep(.dark .accounts-table .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.08);
}

:deep(.accounts-table .p-datatable-tbody > tr > td) {
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.dark .accounts-table .p-datatable-tbody > tr > td) {
  border-color: rgba(255, 255, 255, 0.06);
}

:deep(.accounts-table .p-paginator) {
  border: none;
  background: transparent;
  padding-top: 1rem;
}

:deep(.p-tag) {
  font-size: 0.72rem;
}
</style>