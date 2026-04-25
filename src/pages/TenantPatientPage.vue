<template>
  <div v-if="isLoading" class="flex h-64 w-full items-center justify-center">
    <Loading />
  </div>

  <div
    v-else
    class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-gray-950 dark:via-slate-900 dark:to-black px-3 py-6 sm:px-4 sm:py-8"
  >
    <Toast />

    <!-- Booking Dialog -->
    <Dialog
      v-model:visible="showBookDialog"
      modal
      :draggable="false"
      header="Book an Appointment"
      :style="{ width: 'min(500px, 95vw)' }"
    >
      <div class="space-y-4 py-1">
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Service Type</label>
          <Select
            v-model="bookForm.serviceType"
            :options="serviceTypes"
            placeholder="Select a service"
            class="w-full"
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Preferred Date</label>
          <InputText
            v-model="bookForm.appointmentDate"
            type="date"
            class="w-full"
            :min="today"
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Notes <span class="text-slate-400 font-normal">(optional)</span></label>
          <Textarea
            v-model="bookForm.notes"
            rows="3"
            placeholder="Any additional notes or concerns..."
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" outlined @click="showBookDialog = false" />
        <Button
          label="Submit Request"
          :loading="bookLoading"
          :disabled="!bookForm.serviceType || !bookForm.appointmentDate"
          @click="handleBookAppointment"
        />
      </template>
    </Dialog>

    <!-- Cancel Dialog -->
    <Dialog
      v-model:visible="showCancelDialog"
      modal
      :draggable="false"
      header="Cancel Appointment"
      :style="{ width: 'min(420px, 95vw)' }"
    >
      <div class="py-2 space-y-3">
        <p class="text-sm text-slate-600">Are you sure you want to cancel this appointment?</p>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Reason <span class="text-slate-400 font-normal">(optional)</span></label>
          <InputText v-model="cancelReason" placeholder="Reason for cancellation" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Keep It" severity="secondary" outlined @click="showCancelDialog = false" />
        <Button label="Yes, Cancel" severity="danger" :loading="cancelLoading" @click="handleCancelAppointment" />
      </template>
    </Dialog>

    <div class="mx-auto w-full max-w-md sm:max-w-xl lg:max-w-5xl">

      <!-- Tab Bar -->
      <div class="flex gap-2 mb-5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
          :class="activeTab === tab.key
            ? 'bg-white shadow-md text-sky-600 border border-sky-100'
            : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'"
        >
          <i :class="tab.icon" class="text-xs"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB: MY ID -->
      <div v-if="activeTab === 'id'">
        <div
          class="relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400"></div>
          <div class="absolute inset-0 bg-black/10"></div>

          <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/15 blur-3xl"></div>
          <div class="absolute top-8 right-0 h-40 w-40 rounded-full bg-cyan-100/30 blur-3xl"></div>
          <div class="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-sky-200/20 blur-3xl"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <!-- LEFT SIDE -->
            <div class="p-5 sm:p-6 lg:p-8 text-white">
              <div class="flex items-start justify-between gap-4">
                <div
                  class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] sm:text-xs backdrop-blur-md border border-white/20 shadow-sm"
                >
                  <span class="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]"></span>
                  Verified Patient Record
                </div>

                <div
                  class="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md shadow-lg overflow-hidden"
                >
                  <img v-if="tenantLogoUrl" :src="tenantLogoUrl" alt="Clinic Logo" class="h-full w-full object-cover" />
                  <div v-else class="flex items-center justify-center h-full w-full">
                    <i class="pi pi-building text-lg sm:text-xl text-white"></i>
                  </div>
                </div>
              </div>

              <div class="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h1 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">Patient Digital ID</h1>
                  <p class="mt-2 max-w-sm text-xs sm:text-sm text-blue-50/90 leading-5">
                    Secure patient identity card for portal access, YAKAP verification, and clinic reference.
                  </p>
                </div>
                <div class="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md shadow-lg">
                  <i class="pi pi-id-card text-lg sm:text-xl"></i>
                </div>
              </div>

              <div class="mt-5 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl">
                <div class="flex items-center gap-3">
                  <div class="flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] shrink-0 items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/15 text-lg sm:text-xl font-bold shadow-md">
                    {{ initials }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-blue-50/80">Patient Name</p>
                    <h2 class="mt-1 truncate text-lg sm:text-xl font-semibold">{{ fullName || 'No Name Available' }}</h2>
                    <p class="mt-1 truncate text-xs sm:text-sm text-blue-50/85">{{ user.email || 'No email available' }}</p>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs">
                    <i class="pi pi-shield text-[10px]"></i> Active
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs">
                    <i class="pi pi-heart text-[10px]"></i> YAKAP Enrolled
                  </span>
                </div>
              </div>

              <div class="mt-5 rounded-[1.25rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 overflow-hidden">
                    <img v-if="tenantLogoUrl" :src="tenantLogoUrl" alt="Facility Logo" class="h-full w-full object-cover" />
                    <i v-else class="pi pi-building text-white text-base"></i>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-blue-50/80">YAKAP Facility</p>
                    <p class="mt-1 text-sm sm:text-base lg:text-lg font-semibold leading-snug truncate">{{ tenantName || 'Health Facility' }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div>
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-blue-50/70">Card Status</p>
                  <p class="mt-1 text-xs sm:text-sm font-semibold text-emerald-300">Verified & Active</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-blue-50/70">Card Type</p>
                  <p class="mt-1 text-xs sm:text-sm font-semibold">Digital ID</p>
                </div>
              </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="bg-white/95 dark:bg-slate-950/85 backdrop-blur-2xl p-5 sm:p-6 lg:p-8">
              <div class="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Patient Information</p>
                  <h2 class="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">ID Details</h2>
                  <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">Registered portal details.</p>
                </div>
                <div class="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm sm:text-base font-bold text-white shadow-lg">
                  ID
                </div>
              </div>

              <div class="space-y-3">
                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Full Name</p>
                  <p class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white break-words">{{ fullName || '—' }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                    <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Birthday</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white break-words">{{ user.birthday || '—' }}</p>
                  </div>
                  <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                    <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Phone Number</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white break-words">{{ user.phone || '—' }}</p>
                  </div>
                </div>

                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 shadow-sm">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Email Address</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white break-all">{{ user.email || '—' }}</p>
                </div>

                <div class="rounded-[1rem] border border-sky-100 dark:border-sky-400/20 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-500/10 dark:to-cyan-500/10 px-4 py-3.5 shadow-sm">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">PIN</p>
                  <p class="text-sm sm:text-base font-bold tracking-[0.12em] text-sky-600 dark:text-sky-300 break-all">{{ user.pin || '—' }}</p>
                </div>
              </div>

              <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Status</p>
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Active</p>
                  </div>
                </div>
                <div class="rounded-[1rem] border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5">
                  <p class="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Card Type</p>
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">YAKAP Digital ID</p>
                </div>
              </div>

              <div class="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Issued For</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Patient Portal Access</p>
                </div>
                <div class="sm:text-right">
                  <p class="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">Reference</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">DIGITAL VERIFIED ID</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: MY APPOINTMENTS -->
      <div v-else-if="activeTab === 'appointments'" class="space-y-5">

        <!-- Active Queue Card (shown when in-queue or ongoing) -->
        <div
          v-if="activeQueueAppointment"
          class="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-xl"
          :class="activeQueueAppointment.status === 'ongoing' ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-400'"
        >
          <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
          <div class="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-80">
                {{ activeQueueAppointment.status === 'ongoing' ? 'Currently Being Served' : 'You\'re in the Queue' }}
              </p>
              <div class="mt-2 flex items-end gap-3">
                <p class="text-6xl sm:text-7xl font-black leading-none">
                  {{ activeQueueAppointment.queueNumber ?? '—' }}
                </p>
                <p class="text-sm font-medium opacity-80 mb-1">Queue<br>Number</p>
              </div>
              <p class="mt-3 text-sm opacity-90">{{ activeQueueAppointment.serviceType }} &bull; {{ formatDate(activeQueueAppointment.appointmentDate) }}</p>
            </div>
            <div class="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <i class="pi pi-ticket text-3xl sm:text-4xl"></i>
            </div>
          </div>
          <div v-if="activeQueueAppointment.adminNotes" class="relative z-10 mt-4 rounded-xl bg-white/15 px-4 py-2.5 text-sm">
            <span class="font-medium">Clinic Note:</span> {{ activeQueueAppointment.adminNotes }}
          </div>
        </div>

        <!-- Confirmed Appointment Card -->
        <div
          v-else-if="confirmedAppointment"
          class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-6 text-white shadow-xl"
        >
          <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
          <div class="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-80">Appointment Confirmed</p>
              <p class="mt-2 text-xl sm:text-2xl font-bold">{{ confirmedAppointment.serviceType }}</p>
              <p class="mt-1 text-sm opacity-90">{{ formatDate(confirmedAppointment.appointmentDate) }}</p>
              <p class="mt-3 text-xs opacity-75">Please arrive on time. You will be assigned a queue number when you arrive.</p>
            </div>
            <div class="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <i class="pi pi-calendar-check text-3xl sm:text-4xl"></i>
            </div>
          </div>
          <div v-if="confirmedAppointment.adminNotes" class="relative z-10 mt-4 rounded-xl bg-white/15 px-4 py-2.5 text-sm">
            <span class="font-medium">Clinic Note:</span> {{ confirmedAppointment.adminNotes }}
          </div>
        </div>

        <!-- Header Row -->
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">My Appointments</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ myAppointments.length }} appointment{{ myAppointments.length !== 1 ? 's' : '' }}</p>
          </div>
          <button
            @click="openBookDialog"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-150"
          >
            <i class="pi pi-plus text-xs"></i>
            Book Appointment
          </button>
        </div>

        <!-- Appointment loading -->
        <div v-if="appointmentLoading" class="flex justify-center py-10">
          <i class="pi pi-spin pi-spinner text-sky-500 text-2xl"></i>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="myAppointments.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-white/5 py-14 text-center"
        >
          <div class="mx-auto h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-4">
            <i class="pi pi-calendar text-slate-400 text-2xl"></i>
          </div>
          <p class="font-semibold text-slate-700 dark:text-slate-200">No appointments yet</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Book your first appointment to get started.</p>
          <button
            @click="openBookDialog"
            class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <i class="pi pi-plus text-xs"></i>
            Book an Appointment
          </button>
        </div>

        <!-- Appointments List -->
        <div v-else class="space-y-3">
          <div
            v-for="appt in myAppointments"
            :key="appt._id"
            class="rounded-2xl border bg-white dark:bg-white/5 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-150"
            :class="apptBorderClass(appt.status)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="statusBadgeClass(appt.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(appt.status)"></span>
                    {{ statusLabel(appt.status) }}
                  </span>
                  <span v-if="appt.queueNumber" class="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 text-[11px] font-semibold">
                    <i class="pi pi-ticket text-[10px]"></i> Queue #{{ appt.queueNumber }}
                  </span>
                </div>
                <p class="mt-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{{ appt.serviceType }}</p>
                <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <i class="pi pi-calendar text-[10px] mr-1"></i>
                  {{ formatDate(appt.appointmentDate) }}
                </p>
                <p v-if="appt.notes" class="mt-1.5 text-xs text-slate-400 dark:text-slate-500 italic">{{ appt.notes }}</p>
                <p v-if="appt.adminNotes" class="mt-1.5 text-xs text-blue-600 dark:text-blue-400">
                  <span class="font-semibold not-italic">Clinic note:</span> {{ appt.adminNotes }}
                </p>
                <p v-if="appt.cancelReason" class="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  <span class="font-semibold">Reason:</span> {{ appt.cancelReason }}
                </p>
              </div>

              <button
                v-if="['pending', 'confirmed'].includes(appt.status)"
                @click="openCancelDialog(appt)"
                class="shrink-0 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <p class="text-center text-xs text-slate-400 pt-2">Updates every 30 seconds. <button @click="loadMyAppointments" class="text-sky-500 hover:underline">Refresh now</button></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Loading from '../components/Loading.vue'

const authTenantStore = useAuthTenantStore()
const tenantStore = useTenantStore()
const appointmentStore = useAppointmentStore()
const toast = useToast()

const { fetchTenant } = tenantStore
const { fetchUserTenant } = authTenantStore
const { tenant } = storeToRefs(tenantStore)
const { myAppointments, loading: appointmentLoading } = storeToRefs(appointmentStore)

const activeTab = ref('id')
const tenantId = ref(null)
const isLoading = ref(false)
const tenantName = ref('')

const showBookDialog = ref(false)
const showCancelDialog = ref(false)
const bookLoading = ref(false)
const cancelLoading = ref(false)
const cancelReason = ref('')
const cancelTarget = ref(null)

const bookForm = ref({ serviceType: '', appointmentDate: '', notes: '' })

const today = computed(() => new Date().toISOString().split('T')[0])

const tabs = [
  { key: 'id', label: 'My ID', icon: 'pi pi-id-card' },
  { key: 'appointments', label: 'My Appointments', icon: 'pi pi-calendar' },
]

const serviceTypes = [
  'General Consultation',
  'Follow-up Checkup',
  'Laboratory Request',
  'Prescription Renewal',
  'Vaccination',
  'Medical Certificate',
  'Others',
]

const tenantLogoUrl = computed(() => tenant.value?.tenantLogo?.url || null)

const user = ref({
  email: '', pin: '', firstName: '', middleName: '', lastName: '', birthday: '', phone: ''
})

const fullName = computed(() =>
  [user.value.firstName, user.value.middleName, user.value.lastName].filter(Boolean).join(' ')
)

const initials = computed(() => {
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last ? (first + last).toUpperCase() : 'ID')
})

const activeQueueAppointment = computed(() =>
  myAppointments.value.find(a => ['in-queue', 'ongoing'].includes(a.status)) || null
)

const confirmedAppointment = computed(() =>
  myAppointments.value.find(a => a.status === 'confirmed') || null
)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const statusLabel = (status) => ({
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-queue': 'In Queue',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
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
  pending:   'bg-slate-400',
  confirmed: 'bg-blue-500',
  'in-queue':'bg-amber-500',
  ongoing:   'bg-emerald-500',
  completed: 'bg-slate-400',
  cancelled: 'bg-red-400',
}[status] || 'bg-slate-400')

const apptBorderClass = (status) => ({
  pending:   'border-slate-200 dark:border-white/10',
  confirmed: 'border-blue-100 dark:border-blue-500/20',
  'in-queue':'border-amber-200 dark:border-amber-500/20',
  ongoing:   'border-emerald-200 dark:border-emerald-500/20',
  completed: 'border-slate-100 dark:border-white/5 opacity-70',
  cancelled: 'border-red-100 dark:border-red-500/20 opacity-60',
}[status] || 'border-slate-200')

const openBookDialog = () => {
  bookForm.value = { serviceType: '', appointmentDate: '', notes: '' }
  showBookDialog.value = true
}

const openCancelDialog = (appt) => {
  cancelTarget.value = appt
  cancelReason.value = ''
  showCancelDialog.value = true
}

const handleBookAppointment = async () => {
  bookLoading.value = true
  const res = await appointmentStore.createAppointment({
    serviceType: bookForm.value.serviceType,
    appointmentDate: bookForm.value.appointmentDate,
    notes: bookForm.value.notes,
  })
  bookLoading.value = false

  if (res.success) {
    showBookDialog.value = false
    toast.add({ severity: 'success', summary: 'Appointment Requested', detail: 'Your appointment has been submitted. Please wait for clinic confirmation.', life: 5000 })
    await loadMyAppointments()
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: res.message, life: 4000 })
  }
}

const handleCancelAppointment = async () => {
  if (!cancelTarget.value) return
  cancelLoading.value = true
  const res = await appointmentStore.cancelAppointment(cancelTarget.value._id, cancelReason.value)
  cancelLoading.value = false

  if (res.success) {
    showCancelDialog.value = false
    toast.add({ severity: 'info', summary: 'Appointment Cancelled', detail: 'Your appointment has been cancelled.', life: 4000 })
    await loadMyAppointments()
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: res.message, life: 4000 })
  }
}

const loadMyAppointments = async () => {
  await appointmentStore.fetchMyAppointments()
}

let pollInterval = null

onMounted(async () => {
  isLoading.value = true
  try {
    tenantId.value = localStorage.getItem('tenantId')

    if (tenantId.value) {
      const res = await fetchTenant(tenantId.value)
      tenantName.value = res?.data?.name || ''
    }

    const result = await fetchUserTenant()
    user.value = result.data

    await loadMyAppointments()
  } catch (error) {
    console.error('Error fetching user', error)
  } finally {
    isLoading.value = false
  }

  pollInterval = setInterval(loadMyAppointments, 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
