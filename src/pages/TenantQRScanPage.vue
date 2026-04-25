<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-gray-950 dark:via-slate-900 dark:to-black">
    <Toast />

    <div class="mx-auto max-w-xl space-y-5">

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shrink-0">
          <i class="pi pi-qrcode text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">QR Check-In</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Scan a patient's QR code to verify and check them in.</p>
        </div>
      </div>

      <!-- Camera / Scanner Panel -->
      <div
        v-if="!foundPatient"
        class="rounded-3xl border border-white/60 dark:border-white/10 bg-white dark:bg-white/5 shadow-xl overflow-hidden"
      >
        <!-- Camera view -->
        <div class="relative bg-slate-900 aspect-square sm:aspect-video max-h-72 overflow-hidden">
          <video
            ref="videoRef"
            class="w-full h-full object-cover"
            playsinline
            muted
          ></video>
          <canvas ref="canvasRef" class="hidden"></canvas>

          <!-- Scanning overlay -->
          <div v-if="scanning" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="relative h-48 w-48">
              <div class="absolute inset-0 rounded-2xl border-2 border-white/60"></div>
              <!-- Corner accents -->
              <div class="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-sky-400 rounded-tl-xl"></div>
              <div class="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-sky-400 rounded-tr-xl"></div>
              <div class="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-sky-400 rounded-bl-xl"></div>
              <div class="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-sky-400 rounded-br-xl"></div>
              <!-- Scan line -->
              <div class="scan-line absolute left-2 right-2 h-0.5 bg-sky-400/80 shadow-[0_0_8px_2px_rgba(56,189,248,0.5)]"></div>
            </div>
            <p class="absolute bottom-4 text-white/70 text-xs font-medium tracking-wide">Align QR code within frame</p>
          </div>

          <!-- No camera state -->
          <div v-if="!scanning && !cameraError" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-800">
            <div class="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <i class="pi pi-camera text-white text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm">Camera not started</p>
          </div>

          <!-- Camera error -->
          <div v-if="cameraError" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-800">
            <div class="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <i class="pi pi-ban text-red-400 text-2xl"></i>
            </div>
            <p class="text-white/60 text-sm text-center px-6">{{ cameraError }}</p>
          </div>
        </div>

        <!-- Camera controls -->
        <div class="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <button
            v-if="!scanning"
            @click="startCamera"
            :disabled="lookupLoading"
            class="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <i class="pi pi-camera text-xs"></i>
            Start Camera
          </button>
          <button
            v-else
            @click="stopCamera"
            class="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-white/10"
          >
            <i class="pi pi-stop-circle text-xs text-red-400"></i>
            Stop Camera
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-3 px-4 pb-2">
          <div class="flex-1 border-t border-slate-200 dark:border-white/10"></div>
          <span class="text-xs text-slate-400">or enter manually</span>
          <div class="flex-1 border-t border-slate-200 dark:border-white/10"></div>
        </div>

        <!-- Manual REF ID input -->
        <div class="px-4 pb-4">
          <div class="flex gap-2">
            <InputText
              v-model="manualRef"
              placeholder="Type REF ID (e.g. A3F2B8C1)"
              class="flex-1"
              maxlength="8"
              @keyup.enter="handleManualLookup"
              style="text-transform: uppercase; font-family: monospace; letter-spacing: 0.1em;"
            />
            <Button
              label="Look Up"
              :loading="lookupLoading"
              :disabled="manualRef.trim().length < 4"
              @click="handleManualLookup"
              class="shrink-0"
            />
          </div>
          <p v-if="scanError" class="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
            <i class="pi pi-exclamation-circle text-[10px]"></i>
            {{ scanError }}
          </p>
        </div>
      </div>

      <!-- Result Panel — Patient found -->
      <div v-if="foundPatient" class="space-y-4">

        <!-- Patient Card -->
        <div class="rounded-3xl border border-emerald-100 dark:border-emerald-500/20 bg-white dark:bg-white/5 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-4 flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white font-black text-sm">
              {{ (foundPatient.firstName?.[0] || '') + (foundPatient.lastName?.[0] || '') }}
            </div>
            <div class="min-w-0">
              <p class="text-white font-bold text-base leading-snug">
                {{ [foundPatient.firstName, foundPatient.middleName, foundPatient.lastName].filter(Boolean).join(' ') }}
              </p>
              <p class="text-emerald-100 text-xs">{{ foundPatient.email }}</p>
            </div>
            <div class="ml-auto shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-center">
              <p class="text-[9px] text-white/70 uppercase tracking-widest leading-none">REF ID</p>
              <p class="text-sm font-black text-white tracking-wide mt-0.5">{{ scannedPayload?.ref || '—' }}</p>
            </div>
          </div>

          <div class="p-5 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Birthday</p>
              <p class="font-semibold text-slate-800 dark:text-slate-100 text-xs">{{ foundPatient.birthday || '—' }}</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Phone</p>
              <p class="font-semibold text-slate-800 dark:text-slate-100 text-xs">{{ foundPatient.phone || '—' }}</p>
            </div>
            <div class="col-span-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">PIN</p>
              <p class="font-mono font-bold tracking-widest text-sky-600 dark:text-sky-300 text-sm">{{ foundPatient.pin || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Appointment Check-In Card (item 9) -->
        <div
          v-if="foundAppointment"
          class="rounded-3xl border bg-white dark:bg-white/5 shadow-xl overflow-hidden"
          :class="checkInSuccess
            ? 'border-emerald-200 dark:border-emerald-500/20'
            : 'border-blue-100 dark:border-blue-500/20'"
        >
          <div
            class="px-5 py-4 flex items-center justify-between gap-3"
            :class="checkInSuccess
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-blue-600 to-cyan-500'"
          >
            <div class="flex items-center gap-3">
              <i :class="checkInSuccess ? 'pi pi-check-circle' : 'pi pi-calendar'" class="text-white text-lg"></i>
              <div>
                <p class="text-white font-bold text-sm">{{ checkInSuccess ? 'Checked In!' : "Today's Appointment" }}</p>
                <p class="text-white/80 text-xs">{{ foundAppointment.serviceType }}</p>
              </div>
            </div>
            <span class="shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-white text-xs font-semibold">
              {{ checkInSuccess ? `Queue #${finalQueueNumber}` : statusLabel(foundAppointment.status) }}
            </span>
          </div>

          <div v-if="!checkInSuccess" class="p-5 space-y-4">
            <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-4 py-3">
              <i class="pi pi-calendar text-slate-400 text-sm shrink-0"></i>
              <p class="text-sm text-slate-700 dark:text-slate-200">
                {{ new Date(foundAppointment.appointmentDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
            </div>

            <div v-if="foundAppointment.notes" class="text-xs text-slate-500 dark:text-slate-400 italic px-1">
              Patient note: {{ foundAppointment.notes }}
            </div>

            <!-- Queue number assignment -->
            <div v-if="['pending', 'confirmed'].includes(foundAppointment.status)" class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Assign Queue Number
                <span class="ml-1 text-slate-400 font-normal text-xs">(suggested: #{{ suggestedQueue }})</span>
              </label>
              <InputText
                v-model="queueInput"
                type="number"
                :placeholder="`Suggested: ${suggestedQueue}`"
                class="w-full"
                min="1"
              />
            </div>

            <Button
              v-if="['pending', 'confirmed'].includes(foundAppointment.status)"
              label="Check In — Set In Queue"
              icon="pi pi-ticket"
              :loading="checkingIn"
              class="w-full"
              @click="handleCheckIn"
            />

            <p v-else class="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
              This appointment is already <strong>{{ statusLabel(foundAppointment.status) }}</strong>.
            </p>
          </div>

          <div v-else class="px-5 pb-5 pt-3 text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Patient is now in queue. They have been notified.
            </p>
          </div>
        </div>

        <!-- No appointment today -->
        <div
          v-else-if="!lookupLoading"
          class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-white/5 py-8 text-center"
        >
          <i class="pi pi-calendar text-slate-300 dark:text-slate-600 text-3xl mb-2 block"></i>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">No appointment today</p>
          <p class="text-xs text-slate-400 mt-1">This patient has no scheduled appointment for today.</p>
        </div>

        <!-- Reset -->
        <button
          @click="resetScanner"
          class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
        >
          <i class="pi pi-refresh mr-2 text-xs"></i>
          Scan Another Patient
        </button>
      </div>

      <!-- Loading overlay -->
      <div v-if="lookupLoading" class="flex flex-col items-center justify-center py-14 gap-3">
        <i class="pi pi-spin pi-spinner text-sky-500 text-3xl"></i>
        <p class="text-sm text-slate-500 dark:text-slate-400">Looking up patient…</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import jsQR from 'jsqr'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useAppointmentStore } from '../stores/appointmentStore'

const toast = useToast()
const authTenantStore = useAuthTenantStore()
const appointmentStore = useAppointmentStore()

// Camera refs
const videoRef   = ref(null)
const canvasRef  = ref(null)
const scanning   = ref(false)
const cameraError = ref('')
let animFrame = null
let mediaStream = null

// Lookup state
const lookupLoading    = ref(false)
const scanError        = ref('')
const manualRef        = ref('')
const foundPatient     = ref(null)
const foundAppointment = ref(null)
const scannedPayload   = ref(null)
const suggestedQueue   = ref(1)
const queueInput       = ref('')

// Check-in state
const checkingIn     = ref(false)
const checkInSuccess = ref(false)
const finalQueueNumber = ref(null)

const currentTenantId = localStorage.getItem('tenantId') || ''
const todayStr = new Date().toISOString().split('T')[0]

// ── Camera ──────────────────────────────────────────────

const startCamera = async () => {
  cameraError.value = ''
  scanError.value   = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
    })
    videoRef.value.srcObject = mediaStream
    await videoRef.value.play()
    scanning.value = true
    tick()
  } catch (err) {
    cameraError.value = err.name === 'NotAllowedError'
      ? 'Camera permission denied. Please allow camera access and try again.'
      : 'Could not access camera. Use manual REF ID entry instead.'
  }
}

const stopCamera = () => {
  scanning.value = false
  if (animFrame) cancelAnimationFrame(animFrame)
  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop())
    mediaStream = null
  }
}

const tick = () => {
  if (!scanning.value) return
  const video  = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })
    if (code?.data) {
      stopCamera()
      handleQRData(code.data)
      return
    }
  }
  animFrame = requestAnimationFrame(tick)
}

// ── QR / Manual Lookup ───────────────────────────────────

const handleQRData = async (raw) => {
  scanError.value = ''
  try {
    const payload = JSON.parse(raw)
    if (payload.v !== 1) throw new Error('Unknown QR version')
    if (payload.tid !== currentTenantId) {
      scanError.value = 'This QR code belongs to a different clinic.'
      return
    }
    scannedPayload.value = payload
    await lookupByPayload(payload)
  } catch (e) {
    if (!scanError.value) scanError.value = 'Invalid QR code. Please try again or use manual entry.'
  }
}

const handleManualLookup = async () => {
  const ref = manualRef.value.trim().toUpperCase()
  if (!ref || ref.length < 4) return
  scanError.value = ''
  scannedPayload.value = { ref, tid: currentTenantId, pid: null }
  await lookupByPayload(scannedPayload.value)
}

const lookupByPayload = async (payload) => {
  lookupLoading.value = true
  try {
    const result = await authTenantStore.fetchTenantUsers(currentTenantId, payload.ref)
    const users  = result?.data || []

    // Prefer exact _id match when available, otherwise take first result
    foundPatient.value = (payload.pid
      ? users.find(u => String(u._id) === String(payload.pid))
      : null) || users[0] || null

    if (!foundPatient.value) {
      scanError.value = 'No patient found with that REF ID in this clinic.'
      scannedPayload.value = null
      return
    }

    // Load today's appointments to find the linked one
    await appointmentStore.fetchAllAppointments(currentTenantId, { date: todayStr })
    const all = appointmentStore.allAppointments

    if (payload.aid) {
      foundAppointment.value = all.find(a => String(a._id) === String(payload.aid)) || null
    } else {
      // Fallback: find any active appointment today for this patient
      foundAppointment.value = all.find(a =>
        String(a.patientId) === String(foundPatient.value._id) &&
        !['cancelled', 'completed'].includes(a.status)
      ) || null
    }

    // Compute suggested queue number
    const maxQ = Math.max(0, ...all.filter(a => a.queueNumber).map(a => a.queueNumber))
    suggestedQueue.value = maxQ + 1
    queueInput.value     = String(suggestedQueue.value)

  } finally {
    lookupLoading.value = false
  }
}

// ── Check-In (item 9) ────────────────────────────────────

const handleCheckIn = async () => {
  if (!foundAppointment.value) return
  checkingIn.value = true
  const qNum = Number(queueInput.value) || suggestedQueue.value

  const res = await appointmentStore.manageAppointment(foundAppointment.value._id, {
    status: 'in-queue',
    queueNumber: qNum,
  })
  checkingIn.value = false

  if (res.success) {
    checkInSuccess.value  = true
    finalQueueNumber.value = qNum
    foundAppointment.value = res.data
    toast.add({
      severity: 'success',
      summary: 'Checked In!',
      detail: `${foundPatient.value.firstName} is now in Queue #${qNum}`,
      life: 4000,
    })
  } else {
    toast.add({ severity: 'error', summary: 'Check-In Failed', detail: res.message, life: 4000 })
  }
}

// ── Helpers ──────────────────────────────────────────────

const statusLabel = (status) => ({
  pending: 'Pending', confirmed: 'Confirmed', 'in-queue': 'In Queue',
  ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled',
}[status] || status)

const resetScanner = () => {
  stopCamera()
  foundPatient.value     = null
  foundAppointment.value = null
  scannedPayload.value   = null
  checkInSuccess.value   = false
  finalQueueNumber.value = null
  scanError.value        = ''
  manualRef.value        = ''
  queueInput.value       = ''
  cameraError.value      = ''
}

onUnmounted(() => stopCamera())
</script>

<style scoped>
.scan-line {
  top: 50%;
  animation: scan 2s linear infinite;
}
@keyframes scan {
  0%   { top: 12px; }
  50%  { top: calc(100% - 12px); }
  100% { top: 12px; }
}
</style>
