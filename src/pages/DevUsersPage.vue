<template>
  <Toast />

  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 space-y-5">

    <!-- Header -->
    <section class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div class="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl dark:bg-cyan-500/10"></div>

      <div class="relative p-4 sm:p-6 lg:p-7">
        <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div class="max-w-2xl">
            <p class="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em]">
              Portal Dev
            </p>
            <h1 class="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
              User Management
            </h1>
            <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Create, assign, and manage user accounts across all tenant portals.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              class="rounded-2xl w-full sm:w-auto"
              :loading="isLoading"
              @click="loadUsers"
            />
            <Button
              label="Create User"
              icon="pi pi-plus"
              class="rounded-2xl w-full sm:w-auto"
              @click="openCreate"
            />
            <Button
              label="Create Dev"
              icon="pi pi-plus"
              class="rounded-2xl w-full sm:w-auto"
              @click="openCreateDev"
            />
          </div>
        </div>
      </div>
    </section> 


    <!-- KPI Cards -->
    <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="card in kpiCards"
        :key="card.label"
        class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ card.label }}</p>
            <h2 class="text-2xl sm:text-3xl font-bold mt-1" :class="card.color">
              {{ card.value }}
            </h2>
          </div>
          <div class="shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center" :class="card.bg">
            <i :class="[card.icon, card.iconColor, 'text-xl']"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Table Section -->
    <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
      <!-- Toolbar -->
      <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div>
            <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">User Directory</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {{ total }} user<span v-if="total !== 1">s</span> across all tenants.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <IconField iconPosition="left" class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="search"
              placeholder="Search name or email..."
              class="w-full rounded-2xl"
            />
          </IconField>

          <Select
            v-model="filterRole"
            :options="roleFilterOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter by Role"
            showClear
            class="w-full"
          />

          <Select
            v-model="filterTenant"
            :options="tenantOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter by Tenant"
            showClear
            filter
            class="w-full"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="p-2 sm:p-3">
        <DataTable
          :value="users"
          :loading="isLoading"
          dataKey="_id"
          responsiveLayout="scroll"
          class="p-datatable-sm users-table"
          :rowHover="true"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <template #empty>
            <div class="text-center py-12">
              <div class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 dark:bg-slate-800 dark:text-slate-300">
                <i class="pi pi-users text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">No users found</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          </template>

          <!-- User -->
          <Column header="User" style="min-width: 260px">
            <template #body="{ data }">
              <div class="flex items-center gap-3 min-w-0">
                <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {{ initials(data) }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {{ fullName(data) || '—' }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ data.email }}</p>
                </div>
              </div>
            </template>
          </Column>

          <!-- Tenant -->
          <Column header="Tenant" style="min-width: 180px">
            <template #body="{ data }">
              <div
                class="min-w-0 group"
                :class="data.tenantId?._id ? 'cursor-pointer' : ''"
                @click.stop="data.tenantId?._id && router.push(`/tenant/${data.tenantId._id}`)"
              >
                <p class="text-sm font-medium truncate transition-colors"
                  :class="data.tenantId?._id
                    ? 'text-blue-600 dark:text-blue-400 group-hover:underline'
                    : 'text-slate-400 dark:text-slate-500 italic'"
                >
                  {{ data.tenantId?.name || '—' }}
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {{ data.tenantId?.domain || (data.role === 'dev' ? 'No tenant (dev)' : '') }}
                </p>
              </div>
            </template>
          </Column>

          <!-- Role -->
          <Column field="role" header="Role" style="min-width: 120px">
            <template #body="{ data }">
              <Tag :value="data.role" :severity="roleSeverity(data.role)" rounded />
            </template>
          </Column>

          <!-- Status -->
          <Column header="Status" style="min-width: 110px">
            <template #body="{ data }">
              <button
                @click="handleToggleStatus(data)"
                :disabled="togglingId === data._id"
                class="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition"
                :class="data.isActive !== false
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400'"
              >
                <span class="h-2 w-2 rounded-full" :class="data.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ data.isActive !== false ? 'Active' : 'Inactive' }}
              </button>
            </template>
          </Column>

          <!-- Verified -->
          <Column header="Verified" style="min-width: 110px">
            <template #body="{ data }">
              <Tag
                :value="data.isEmailVerified ? 'Verified' : 'Unverified'"
                :severity="data.isEmailVerified ? 'success' : 'warn'"
                rounded
              />
            </template>
          </Column>

          <!-- Created -->
          <Column header="Created" style="min-width: 140px">
            <template #body="{ data }">
              <span class="text-sm text-slate-500 dark:text-slate-400">{{ formatDate(data.createdAt) }}</span>
            </template>
          </Column>

          <!-- Actions -->
          <Column header="Actions" style="min-width: 140px" frozen alignFrozen="right">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  outlined
                  class="rounded-xl"
                  v-tooltip.top="'Edit'"
                  @click="openEdit(data)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  outlined
                  class="rounded-xl"
                  v-tooltip.top="'Delete'"
                  @click="openDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Pagination -->
        <div v-if="pages > 1" class="flex items-center justify-between px-2 pt-4 pb-2">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Page {{ currentPage }} of {{ pages }}
          </p>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-chevron-left" size="small" outlined rounded :disabled="currentPage === 1" @click="changePage(currentPage - 1)" />
            <Button icon="pi pi-chevron-right" size="small" outlined rounded :disabled="currentPage === pages" @click="changePage(currentPage + 1)" />
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Create / Edit Dialog -->
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :draggable="false"
    :header="editingUser ? 'Edit User' : 'Create User'"
    :style="{ width: 'min(860px, 95vw)' }"
  >
    <div class="space-y-5 py-1">

      <!-- Tenant + Role -->
      <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">Assignment</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Tenant <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.tenantId"
              :options="tenantOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select tenant"
              filter
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Role <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select role"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Account Credentials -->
      <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-4">Account Credentials</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Email <span class="text-red-500">*</span>
            </label>
            <InputText v-model="form.email" placeholder="user@clinic.com" type="email" class="w-full" :disabled="!!editingUser" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
              <span class="ml-1 text-xs font-normal text-slate-400">
                {{ editingUser ? '(leave blank to keep current)' : '(default: Yakap2026!)' }}
              </span>
            </label>
            <Password
              v-model="form.password"
              :feedback="false"
              toggleMask
              :placeholder="editingUser ? 'Leave blank to keep current' : 'Leave blank for default'"
              class="w-full"
              inputClass="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">PhilHealth PIN</label>
            <InputText v-model="form.pin" placeholder="12-digit PIN" class="w-full" />
          </div>
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
            <InputText v-model="form.firstName" placeholder="Juan" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Middle Name</label>
            <InputText v-model="form.middleName" placeholder="Optional" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Last Name <span class="text-red-500">*</span>
            </label>
            <InputText v-model="form.lastName" placeholder="Dela Cruz" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

      <!-- Error -->
      <div
        v-if="formError"
        class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
      >
        <i class="pi pi-exclamation-triangle mr-2"></i>{{ formError }}
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button label="Cancel" severity="secondary" outlined class="rounded-2xl" @click="closeDialog" />
        <Button
          :label="editingUser ? 'Update User' : 'Create User'"
          :icon="editingUser ? 'pi pi-check' : 'pi pi-plus'"
          :loading="isSaving"
          class="rounded-2xl"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>

  <!-- Dev User Dialog -->
   <Dialog
    v-model:visible="devDialogVisible"
    modal
    :draggable="false"
    header="Create Dev User"
    :style="{ width: 'min(500px, 95vw)' }"
  >
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
        <InputText v-model="devForm.username" placeholder="Username" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
        <InputText v-model="devForm.email" placeholder="Email" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
        <Password v-model="devForm.password" placeholder="Password" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">First Name</label>
        <InputText v-model="devForm.firstName" placeholder="First Name" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Last Name</label>
        <InputText v-model="devForm.lastName" placeholder="Last Name" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Birthday</label>
        <InputText v-model="devForm.birthday" placeholder="YYYY-MM-DD" class="w-full" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
        <InputText v-model="devForm.phone" placeholder="09XXXXXXXXX" class="w-full" />
      </div>
                <!-- Error -->
      <div
        v-if="formError"
        class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
      >
        <i class="pi pi-exclamation-triangle mr-2"></i>{{ formError }}
      </div>
    </div>

  
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button label="Cancel" severity="secondary" outlined class="rounded-2xl" @click="devDialogVisible = false" />
        <Button
          label="Create Dev User"
          icon="pi pi-plus"
          :loading="isSaving"
          class="rounded-2xl"
          @click="handleDevSave"
        />
      </div>
    </template>
  </Dialog>

  <!-- Delete Confirmation Dialog -->
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    :draggable="false"
    header="Delete User"
    :style="{ width: 'min(440px, 95vw)' }"
  >
    <div class="py-2 space-y-3">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div>
          <p class="font-semibold text-slate-800 dark:text-white">Are you sure?</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            You are about to permanently delete
            <strong>{{ fullName(userToDelete) }}</strong>
            (<span class="break-all">{{ userToDelete?.email }}</span>).
            This cannot be undone.
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined @click="deleteDialogVisible = false" />
      <Button label="Delete" severity="danger" :loading="isSaving" @click="confirmDelete" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import Tag from 'primevue/tag'
import Password from 'primevue/password'

const toast       = useToast()
const router      = useRouter()
const authStore   = useAuthTenantStore()
const tenantStore = useTenantStore()

const { tenants } = storeToRefs(tenantStore)

// ─── State ────────────────────────────────────────────────────────────────────
const users       = ref([])
const isLoading   = ref(false)
const isSaving    = ref(false)
const togglingId  = ref(null)
const total       = ref(0)
const currentPage = ref(1)
const pages       = ref(1)
const PAGE_LIMIT  = 20

const search       = ref('')
const filterRole   = ref(null)
const filterTenant = ref(null)
let   searchTimer  = null

const dialogVisible       = ref(false)
const devDialogVisible    = ref(false)
const deleteDialogVisible = ref(false)
const editingUser         = ref(null)
const editingDevUser      = ref(null)
const userToDelete        = ref(null)
const formError           = ref('')


const emptyForm = () => ({
  tenantId:   '',
  email:      '',
  password:   '',
  pin:        '',
  firstName:  '',
  middleName: '',
  lastName:   '',
  birthday:   '',
  phone:      '',
  role:       '',
})

const emptyDevForm = () => ({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthday: '',
  phone: '',
})

const form = ref(emptyForm())

const devForm = ref(emptyDevForm())

// ─── Options ──────────────────────────────────────────────────────────────────
const roleOptions = [
  { label: 'Patient',    value: 'patient'    },
  { label: 'Admin',      value: 'admin'      },
  { label: 'Superadmin', value: 'superadmin' },
]

const roleFilterOptions = [
  { label: 'Admin',      value: 'admin'      },
  { label: 'Superadmin', value: 'superadmin' },
  { label: 'Dev',        value: 'dev'        },
  { label: 'Patient',    value: 'patient'    },
]

const tenantOptions = computed(() =>
  (tenants.value || []).map(t => ({ label: t.name, value: t._id }))
)

// ─── KPI Cards ────────────────────────────────────────────────────────────────
const kpiCards = computed(() => [
  {
    label: 'Total Users', value: total.value,
    icon: 'pi pi-users', color: 'text-slate-800 dark:text-white',
    bg: 'bg-blue-100 dark:bg-blue-500/15', iconColor: 'text-blue-600 dark:text-blue-300'
  },
  {
    label: 'Total Tenants', value: tenants.value.length,
    icon: 'pi pi-building', color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-500/15', iconColor: 'text-purple-600 dark:text-purple-300'
  },
  {
    label: 'Page Results', value: users.value.length,
    icon: 'pi pi-list', color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-300'
  },
  {
    label: 'Pages', value: pages.value,
    icon: 'pi pi-book', color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-300'
  },
])

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initials  = (u) => `${u?.firstName?.[0] || ''}${u?.lastName?.[0] || ''}`.toUpperCase() || '?'
const fullName  = (u) => u ? [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ') : ''
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }) : '—'

const roleSeverity = (role) => {
  if (role === 'dev')        return 'contrast'
  if (role === 'superadmin') return 'warn'
  if (role === 'admin')      return 'info'
  return 'secondary'
}

// ─── Data Loading ─────────────────────────────────────────────────────────────
const loadUsers = async (page = 1) => {
  isLoading.value = true
  currentPage.value = page

  const result = await authStore.fetchAllUsers({
    page,
    limit: PAGE_LIMIT,
    search:   search.value.trim(),
    role:     filterRole.value  || '',
    tenantId: filterTenant.value || '',
  })

  users.value   = result.data  || []
  total.value   = result.total || 0
  pages.value   = result.pages || 1
  isLoading.value = false
}

const changePage = (p) => loadUsers(p)

watch([filterRole, filterTenant], () => loadUsers(1))

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadUsers(1), 350)
})

// ─── CRUD ─────────────────────────────────────────────────────────────────────
const openCreate = () => {
  editingUser.value = null
  form.value = emptyForm()
  formError.value = ''
  dialogVisible.value = true
}

const openCreateDev = () => {
  devForm.value = emptyDevForm()
  formError.value = ''
  devDialogVisible.value = true
}

const openEditDev = (user) => {
  editingDevUser.value = user
  devForm.value = {
    username: user.username || '',
    email: user.email || '',
    password: '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    birthday: user.birthday || '',
    phone: user.phone || '',
  }
  formError.value = ''
  devDialogVisible.value = true
}

const openEdit = (user) => {
  editingUser.value = user
  form.value = {
    tenantId:   user.tenantId?._id || user.tenantId || '',
    email:      user.email      || '',
    password:   '',
    pin:        user.pin        || '',
    firstName:  user.firstName  || '',
    middleName: user.middleName || '',
    lastName:   user.lastName   || '',
    birthday:   user.birthday   || '',
    phone:      user.phone      || '',
    role:       user.role       || '',
  }
  formError.value = ''
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  editingUser.value = null
  form.value = emptyForm()
  formError.value = ''
}

const closeDevDialog = () => {
  devDialogVisible.value = false
  editingDevUser.value = null
  devForm.value = emptyDevForm()
  formError.value = ''
}

const validateForm = () => {
  if (!form.value.tenantId)  return 'Tenant is required.'
  if (!form.value.email)     return 'Email is required.'
  if (!form.value.firstName) return 'First name is required.'
  if (!form.value.lastName)  return 'Last name is required.'
  if (!form.value.role)      return 'Role is required.'
  return null
}

const validateDevForm = () => {
  if (!devForm.value.username)  return 'Username is required.'
  if (!devForm.value.email)     return 'Email is required.'
  if (!devForm.value.password)  return 'Password is required.'
  if (!devForm.value.firstName) return 'First name is required.'
  if (!devForm.value.lastName)  return 'Last name is required.'
  return null
} 

const handleSave = async () => {
  formError.value = validateForm() || ''
  if (formError.value) return
  isSaving.value = true

  try {
    if (editingUser.value) {
      // Populate store userForm then call updateUser
      authStore.userForm.tenantId   = form.value.tenantId
      authStore.userForm.email      = form.value.email
      authStore.userForm.pin        = form.value.pin
      authStore.userForm.firstName  = form.value.firstName
      authStore.userForm.middleName = form.value.middleName
      authStore.userForm.lastName   = form.value.lastName
      authStore.userForm.birthday   = form.value.birthday
      authStore.userForm.phone      = form.value.phone
      authStore.userForm.role       = form.value.role
      authStore.userForm.password   = form.value.password

      const res = await authStore.updateUser(editingUser.value._id)
      if (!res?.success) throw new Error(res?.message || 'Update failed')

      toast.add({ severity: 'success', summary: 'Updated', detail: res.message || 'User updated successfully', life: 3000 })
    } else {
      // Populate store userForm then call addUser
      authStore.userForm.tenantId   = form.value.tenantId
      authStore.userForm.email      = form.value.email
      authStore.userForm.pin        = form.value.pin
      authStore.userForm.firstName  = form.value.firstName
      authStore.userForm.middleName = form.value.middleName
      authStore.userForm.lastName   = form.value.lastName
      authStore.userForm.birthday   = form.value.birthday
      authStore.userForm.phone      = form.value.phone
      authStore.userForm.role       = form.value.role
      authStore.userForm.password   = form.value.password

      const res = await authStore.addUser()
      if (!res?.success) throw new Error(res?.message || 'Creation failed')

      toast.add({ severity: 'success', summary: 'Created', detail: res.message || 'User created successfully', life: 3000 })
    }

    closeDialog()
    await loadUsers(currentPage.value)
  } catch (err) {
    formError.value = err.message || 'Something went wrong.'
  } finally {
    isSaving.value = false
  }
}

const handleDevSave = async () => {
  formError.value = validateDevForm() || ''
  if (formError.value) return
  isSaving.value = true

  try {
    // Populate store devForm then call addDevUser
    authStore.devForm.username   = devForm.value.username
    authStore.devForm.email      = devForm.value.email
    authStore.devForm.password   = devForm.value.password
    authStore.devForm.firstName  = devForm.value.firstName
    authStore.devForm.lastName   = devForm.value.lastName
    authStore.devForm.birthday   = devForm.value.birthday
    authStore.devForm.phone      = devForm.value.phone

    const res = await authStore.addDev()
    if (!res?.success) throw new Error(res?.message || 'Creation failed')

    toast.add({ severity: 'success', summary: 'Created', detail: res.message || 'Developer user created successfully', life: 3000 })
    closeDevDialog()
    await loadUsers(currentPage.value)
  } catch (err) {
    formError.value = err.message || 'Something went wrong.'
  } finally {
    isSaving.value = false
  }
}

const openDelete = (user) => {
  userToDelete.value = user
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  isSaving.value = true
  const result = await authStore.removeUserTenant(userToDelete.value._id)
  isSaving.value = false
  deleteDialogVisible.value = false

  if (result.success) {
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'User removed successfully', life: 3000 })
    await loadUsers(currentPage.value)
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 })
  }
  userToDelete.value = null
}

const handleToggleStatus = async (user) => {
  togglingId.value = user._id
  const result = await authStore.toggleUserStatus(user._id)

  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Failed', detail: result.message, life: 3000 })
  } else {
    const idx = users.value.findIndex(u => u._id === user._id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], isActive: result.data.isActive }
    toast.add({ severity: 'info', summary: 'Status Updated', detail: result.message, life: 3000 })
  }
  togglingId.value = null
}

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    loadUsers(),
    tenantStore.fetchTenants(),
  ])
})
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-password),
:deep(.p-password-input) {
  width: 100%;
  border-radius: 0.9rem;
}

:deep(.p-button) {
  white-space: nowrap;
}

:deep(.users-table .p-datatable-table) {
  min-width: 980px;
}

:deep(.users-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
  vertical-align: middle;
}

:deep(.users-table .p-datatable-tbody > tr > td) {
  background: transparent;
  color: #0f172a;
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.users-table .p-datatable-tbody > tr:hover) {
  background: rgba(248, 250, 252, 0.8);
}

.dark :deep(.users-table .p-datatable-thead > tr > th) {
  background: #0f172a;
  color: #cbd5e1;
  border-color: rgba(51, 65, 85, 0.9);
}

.dark :deep(.users-table .p-datatable-tbody > tr > td) {
  color: #e2e8f0;
  border-color: rgba(51, 65, 85, 0.65);
}

.dark :deep(.users-table .p-datatable-tbody > tr:hover) {
  background: rgba(30, 41, 59, 0.6);
}

:deep(.p-tag) {
  font-size: 0.72rem;
}
</style>
