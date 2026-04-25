<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-5">
    <Toast />

    <!-- Manage Dialog -->
    <Dialog
      v-model:visible="showManageDialog"
      modal
      :draggable="false"
      :header="'Manage Appointment — ' + (selectedAppt?.patientName || '')"
      :style="{ width: 'min(520px, 95vw)' }"
    >
      <div v-if="selectedAppt" class="space-y-4 py-1">
        <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-sm space-y-1.5">
          <p><span class="text-slate-400">Service:</span> <span class="font-semibold text-slate-800 dark:text-white">{{ selectedAppt.serviceType }}</span></p>
          <p><span class="text-slate-400">Date:</span> <span class="font-semibold text-slate-800 dark:text-white">{{ formatDate(selectedAppt.appointmentDate) }}</span></p>
          <p v-if="selectedAppt.notes"><span class="text-slate-400">Patient note:</span> {{ selectedAppt.notes }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Update Status</label>
          <Select v-model="manageForm.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Queue Number
            <span class="text-slate-400 font-normal">(assign when confirmed or in-queue)</span>
          </label>
          <InputText v-model="manageForm.queueNumber" type="number" min="1" placeholder="e.g. 12" class="w-full" />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Clinic Notes <span class="text-slate-400 font-normal">(visible to patient)</span></label>
          <InputText v-model="manageForm.adminNotes" placeholder="Optional notes for patient" class="w-full" />
        </div>

        <div v-if="manageForm.status === 'cancelled'" class="space-y-1">
          <label class="text-sm font-medium text-red-600">Cancellation Reason</label>
          <InputText v-model="manageForm.cancelReason" placeholder="Reason for cancellation" class="w-full" />
        </div>
      </div>

      <template #footer>
        <Button label="Close" severity="secondary" outlined @click="showManageDialog = false" />
        <Button label="Save Changes" :loading="manageLoading" @click="handleManage" />
      </template>
    </Dialog>

    <!-- Hero Header -->
    <section class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shrink-0">
              <i class="pi pi-calendar text-xl"></i>
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-[0.18em]">Clinic Management</p>
              <h1 class="mt-1 text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Appointments</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage patient requests and queue assignments</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80 px-3 py-2 text-center shadow-sm">
              <p class="text-xs text-slate-400 dark:text-slate-500">Total</p>
              <p class="text-lg font-bold text-slate-800 dark:text-white">{{ allAppointments.length }}</p>
            </div>
            <button
              @click="loadAll"
              class="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <i class="pi pi-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Summary Chips -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="chip in summaryChips"
        :key="chip.status"
        @click="filterStatus = chip.status"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150"
        :class="filterStatus === chip.status
          ? chip.activeClass
          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="chip.dot"></span>
        {{ chip.label }}
        <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="filterStatus === chip.status ? chip.countClass : 'bg-slate-100 dark:bg-white/10 text-slate-500'">
          {{ countByStatus(chip.status) }}
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <InputText
          v-model="searchQuery"
          placeholder="Search patient name or service..."
          class="w-full"
        />
      </div>
      <div>
        <InputText
          v-model="filterDate"
          type="date"
          class="w-full sm:w-44"
          title="Filter by date"
        />
      </div>
      <button
        v-if="filterDate || searchQuery"
        @click="filterDate = ''; searchQuery = ''"
        class="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-14">
      <i class="pi pi-spin pi-spinner text-sky-500 text-2xl"></i>
    </div>

    <!-- Empty -->
    <div
      v-else-if="filteredAppointments.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 py-14 text-center"
    >
      <i class="pi pi-calendar text-slate-300 dark:text-slate-600 text-4xl mb-3"></i>
      <p class="font-semibold text-slate-600 dark:text-slate-300">No appointments found</p>
      <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
    </div>

    <!-- Appointment Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="appt in filteredAppointments"
        :key="appt._id"
        class="rounded-2xl border bg-white dark:bg-white/5 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-150"
        :class="apptBorderClass(appt.status)"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="statusBadgeClass(appt.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(appt.status)"></span>
                {{ statusLabel(appt.status) }}
              </span>
              <span v-if="appt.queueNumber" class="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 px-2.5 py-1 text-[11px] font-bold">
                <i class="pi pi-ticket text-[10px]"></i> Queue #{{ appt.queueNumber }}
              </span>
            </div>

            <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <div>
                <span class="text-slate-400 text-xs uppercase tracking-wide">Patient</span>
                <p class="font-semibold text-slate-900 dark:text-white">{{ appt.patientName }}</p>
              </div>
              <div>
                <span class="text-slate-400 text-xs uppercase tracking-wide">Service</span>
                <p class="font-semibold text-slate-900 dark:text-white">{{ appt.serviceType }}</p>
              </div>
              <div>
                <span class="text-slate-400 text-xs uppercase tracking-wide">Date</span>
                <p class="font-semibold text-slate-900 dark:text-white">{{ formatDate(appt.appointmentDate) }}</p>
              </div>
            </div>

            <div v-if="appt.notes" class="mt-2 text-xs text-slate-400 dark:text-slate-500 italic">
              Patient note: {{ appt.notes }}
            </div>
            <div v-if="appt.adminNotes" class="mt-1 text-xs text-blue-600 dark:text-blue-400">
              Clinic note: {{ appt.adminNotes }}
            </div>
            <div v-if="appt.cancelReason" class="mt-1 text-xs text-red-500 dark:text-red-400">
              Cancel reason: {{ appt.cancelReason }}
            </div>

            <p class="mt-2 text-[11px] text-slate-400">Submitted {{ formatRelative(appt.createdAt) }}</p>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <button
              v-if="appt.status === 'pending'"
              @click="quickAction(appt, 'confirmed')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <i class="pi pi-check text-[10px]"></i> Confirm
            </button>
            <button
              v-if="appt.status === 'confirmed'"
              @click="quickAction(appt, 'in-queue')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
            >
              <i class="pi pi-ticket text-[10px]"></i> Set In Queue
            </button>
            <button
              v-if="appt.status === 'in-queue'"
              @click="quickAction(appt, 'ongoing')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <i class="pi pi-play text-[10px]"></i> Start
            </button>
            <button
              v-if="appt.status === 'ongoing'"
              @click="quickAction(appt, 'completed')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <i class="pi pi-check-circle text-[10px]"></i> Complete
            </button>

            <button
              @click="openManageDialog(appt)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <i class="pi pi-sliders-h text-[10px]"></i> Manage
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-center text-xs text-slate-400 pt-2">Auto-refreshes every 30 seconds.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import { useAppointmentStore } from '../stores/appointmentStore'

const toast = useToast()
const appointmentStore = useAppointmentStore()
const { allAppointments, loading } = storeToRefs(appointmentStore)

const tenantId = ref(localStorage.getItem('tenantId') || '')
const filterStatus = ref('all')
const filterDate = ref('')
const searchQuery = ref('')

const showManageDialog = ref(false)
const manageLoading = ref(false)
const selectedAppt = ref(null)
const manageForm = ref({ status: '', queueNumber: '', adminNotes: '', cancelReason: '' })

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Queue', value: 'in-queue' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const summaryChips = [
  { status: 'all',       label: 'All',       dot: 'bg-slate-400', activeClass: 'bg-slate-800 border-slate-800 text-white', countClass: 'bg-white/20 text-white' },
  { status: 'pending',   label: 'Pending',   dot: 'bg-slate-400', activeClass: 'bg-slate-100 border-slate-300 text-slate-700', countClass: 'bg-slate-200 text-slate-600' },
  { status: 'confirmed', label: 'Confirmed', dot: 'bg-blue-500',  activeClass: 'bg-blue-50 border-blue-300 text-blue-700',  countClass: 'bg-blue-100 text-blue-700' },
  { status: 'in-queue',  label: 'In Queue',  dot: 'bg-amber-500', activeClass: 'bg-amber-50 border-amber-300 text-amber-700', countClass: 'bg-amber-100 text-amber-700' },
  { status: 'ongoing',   label: 'Ongoing',   dot: 'bg-emerald-500', activeClass: 'bg-emerald-50 border-emerald-300 text-emerald-700', countClass: 'bg-emerald-100 text-emerald-700' },
  { status: 'completed', label: 'Completed', dot: 'bg-slate-400', activeClass: 'bg-slate-100 border-slate-300 text-slate-600', countClass: 'bg-slate-200 text-slate-500' },
]

const countByStatus = (status) => {
  if (status === 'all') return allAppointments.value.length
  return allAppointments.value.filter(a => a.status === status).length
}

const filteredAppointments = computed(() => {
  let list = allAppointments.value
  if (filterStatus.value !== 'all') list = list.filter(a => a.status === filterStatus.value)
  if (filterDate.value) {
    list = list.filter(a => {
      const d = new Date(a.appointmentDate)
      return d.toISOString().startsWith(filterDate.value)
    })
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(a =>
      a.patientName?.toLowerCase().includes(q) || a.serviceType?.toLowerCase().includes(q)
    )
  }
  return list
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatRelative = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const statusLabel = (status) => ({
  pending: 'Pending', confirmed: 'Confirmed', 'in-queue': 'In Queue',
  ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled',
}[status] || status)

const statusBadgeClass = (status) => ({
  pending:   'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  'in-queue':'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  ongoing:   'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  completed: 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400',
  cancelled: 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300',
}[status] || 'bg-slate-100 text-slate-600')

const statusDotClass = (status) => ({
  pending:   'bg-slate-400', confirmed: 'bg-blue-500', 'in-queue': 'bg-amber-500',
  ongoing:   'bg-emerald-500', completed: 'bg-slate-400', cancelled: 'bg-red-400',
}[status] || 'bg-slate-400')

const apptBorderClass = (status) => ({
  pending:   'border-slate-200 dark:border-white/10',
  confirmed: 'border-blue-100 dark:border-blue-500/20',
  'in-queue':'border-amber-200 dark:border-amber-500/20',
  ongoing:   'border-emerald-200 dark:border-emerald-500/20',
  completed: 'border-slate-100 dark:border-white/5',
  cancelled: 'border-red-100 dark:border-red-500/20 opacity-60',
}[status] || 'border-slate-200')

const loadAll = async () => {
  if (!tenantId.value) return
  await appointmentStore.fetchAllAppointments(tenantId.value)
}

const openManageDialog = (appt) => {
  selectedAppt.value = appt
  manageForm.value = {
    status: appt.status,
    queueNumber: appt.queueNumber ?? '',
    adminNotes: appt.adminNotes || '',
    cancelReason: appt.cancelReason || '',
  }
  showManageDialog.value = true
}

const handleManage = async () => {
  manageLoading.value = true
  const payload = {
    status: manageForm.value.status,
    adminNotes: manageForm.value.adminNotes,
  }
  if (manageForm.value.queueNumber !== '') payload.queueNumber = Number(manageForm.value.queueNumber)
  if (manageForm.value.status === 'cancelled') payload.cancelReason = manageForm.value.cancelReason

  const res = await appointmentStore.manageAppointment(selectedAppt.value._id, payload)
  manageLoading.value = false

  if (res.success) {
    showManageDialog.value = false
    toast.add({ severity: 'success', summary: 'Updated', detail: 'Appointment updated successfully.', life: 3000 })
    await loadAll()
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: res.message, life: 4000 })
  }
}

const quickAction = async (appt, newStatus) => {
  const payload = { status: newStatus }
  if (newStatus === 'in-queue' && !appt.queueNumber) {
    const nextNum = Math.max(0, ...allAppointments.value.filter(a => a.queueNumber).map(a => a.queueNumber)) + 1
    payload.queueNumber = nextNum
  }
  const res = await appointmentStore.manageAppointment(appt._id, payload)
  if (res.success) {
    toast.add({ severity: 'success', summary: 'Updated', detail: `Appointment marked as ${statusLabel(newStatus)}.`, life: 3000 })
    await loadAll()
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: res.message, life: 4000 })
  }
}

let pollInterval = null

onMounted(() => {
  loadAll()
  pollInterval = setInterval(loadAll, 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
