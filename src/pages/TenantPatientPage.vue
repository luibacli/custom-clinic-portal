<template>
  <div v-if="isLoading" class="flex h-64 w-full items-center justify-center">
    <Loading />
  </div>

  <div
    v-else
    class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-gray-950 dark:via-slate-900 dark:to-black px-3 py-6 sm:px-4 sm:py-8"
  >
    <Toast />

    <!-- "It's Your Turn" full-screen overlay -->
    <Transition name="turn-fade">
      <div
        v-if="showTurnAlert"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click="showTurnAlert = false"
      >
        <div class="relative mx-4 max-w-sm w-full rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-2xl overflow-hidden" @click.stop>
          <div class="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/20 border-2 border-white/30 shadow-xl">
              <i class="pi pi-ticket text-4xl"></i>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-emerald-100/80 mb-1">Now Serving</p>
              <h2 class="text-4xl font-black">It's Your Turn!</h2>
              <p class="mt-2 text-sm text-emerald-50/90">Queue #{{ queueStore.myQueueNumber }} — please proceed to the clinic desk.</p>
            </div>
            <button
              @click="showTurnAlert = false"
              class="mt-2 w-full rounded-2xl bg-white/20 border border-white/30 py-3 text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Service Type</label>
          <Select
            v-model="bookForm.serviceType"
            :options="serviceOptions"
            :loading="servicesLoading"
            placeholder="Select a service"
            class="w-full"
          >
            <template #empty>
              <span class="text-sm text-slate-400">No services available</span>
            </template>
          </Select>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Date</label>
          <InputText
            v-model="bookForm.appointmentDate"
            type="date"
            class="w-full"
            :min="today"
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Notes <span class="text-slate-400 font-normal">(optional)</span></label>
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
          :disabled="!bookForm.serviceType || !bookForm.appointmentDate || serviceOptions.length === 0"
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
        <p class="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to cancel this appointment?</p>
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Reason <span class="text-slate-400 font-normal">(optional)</span></label>
          <InputText v-model="cancelReason" placeholder="Reason for cancellation" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Keep It" severity="secondary" outlined @click="showCancelDialog = false" />
        <Button label="Yes, Cancel" severity="danger" :loading="cancelLoading" @click="handleCancelAppointment" />
      </template>
    </Dialog>

    <!-- Show to Staff Modal -->
    <Dialog
      v-model:visible="showStaffModal"
      modal
      :draggable="false"
      :showHeader="false"
      :dismissableMask="true"
      :style="{ width: 'min(420px, 100vw)', borderRadius: '1.5rem', overflow: 'hidden' }"
      :contentStyle="{ padding: 0 }"
    >
      <div class="relative bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 text-white">
        <!-- Close -->
        <button
          @click="showStaffModal = false"
          class="absolute top-4 right-4 h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-20"
        >
          <i class="pi pi-times text-sm"></i>
        </button>

        <!-- Decorative blobs -->
        <div class="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 gap-5">
          <!-- Avatar -->
          <div class="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/20 border-2 border-white/30 text-3xl font-black shadow-xl">
            {{ initials }}
          </div>

          <!-- Name -->
          <div class="text-center">
            <p class="text-xs uppercase tracking-[0.2em] text-blue-100/80 mb-1">Patient Name</p>
            <h2 class="text-2xl sm:text-3xl font-black leading-snug break-words text-center">{{ fullName || 'No Name' }}</h2>
          </div>

          <!-- QR Code (large, for scanning from counter) -->
          <div class="rounded-2xl bg-white p-3 shadow-xl">
            <img
              v-if="qrDataUrl"
              :src="qrDataUrl"
              alt="Patient QR"
              class="h-44 w-44 rounded-xl"
            />
            <div v-else class="h-44 w-44 flex items-center justify-center rounded-xl bg-slate-50">
              <i class="pi pi-spin pi-spinner text-slate-300 text-2xl"></i>
            </div>
          </div>

          <!-- REF ID -->
          <div class="w-full rounded-2xl bg-white/15 border border-white/20 px-5 py-4 text-center backdrop-blur-md">
            <p class="text-[10px] uppercase tracking-[0.2em] text-blue-100/70 mb-1">Patient REF ID</p>
            <p class="text-3xl font-black tracking-[0.18em]">{{ patientDisplayId }}</p>
          </div>

          <!-- Queue number if active -->
          <div
            v-if="queueStore.hasActiveQueue"
            class="w-full rounded-2xl px-5 py-4 text-center"
            :class="queueStore.isMyTurn ? 'bg-emerald-500/40 border border-emerald-300/30' : 'bg-amber-400/30 border border-amber-300/30'"
          >
            <p class="text-[10px] uppercase tracking-[0.2em] text-blue-100/80 mb-1">
              {{ queueStore.isMyTurn ? 'Now Being Served' : 'Queue Number' }}
            </p>
            <p class="text-4xl font-black">#{{ queueStore.myQueueNumber }}</p>
          </div>

          <!-- Today's appointment -->
          <div v-if="todayAppointment" class="w-full rounded-2xl bg-white/10 border border-white/15 px-5 py-3 text-center">
            <p class="text-[10px] uppercase tracking-[0.18em] text-blue-100/70 mb-1">Today's Appointment</p>
            <p class="font-semibold text-sm">{{ todayAppointment.serviceType }}</p>
          </div>

          <p class="text-[10px] text-blue-100/50 text-center">Show this screen to clinic front desk staff for verification.</p>
        </div>
      </div>
    </Dialog>

    <div class="mx-auto w-full max-w-md sm:max-w-xl lg:max-w-5xl">

      <!-- Tab Bar -->
      <div class="mb-6 w-fit">
        <div class="flex gap-1 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
            :class="activeTab === tab.key
              ? 'bg-white dark:bg-white/15 shadow text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
          >
            <i :class="tab.icon" class="text-xs"></i>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- TAB: MY ID -->
      <div v-if="activeTab === 'id'" class="space-y-4">

        <!-- Item 1: Live Queue Strip -->
        <Transition name="queue-fade">
          <div
            v-if="queueStore.hasActiveQueue"
            class="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-white text-sm font-medium shadow-lg transition-colors duration-500"
            :class="queueStore.isMyTurn
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : queueStore.isAlmostTurn
                ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                : 'bg-gradient-to-r from-sky-500 to-cyan-400'"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-ticket text-base shrink-0"></i>
              <div>
                <p class="text-[10px] uppercase tracking-widest opacity-80 leading-none mb-0.5">
                  {{ queueStore.isMyTurn ? 'Currently Being Served' : 'You Are In Queue' }}
                </p>
                <p class="font-black text-xl leading-none">Queue #{{ queueStore.myQueueNumber }}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[10px] opacity-75 leading-none mb-0.5">Now Serving</p>
              <p class="font-bold text-lg leading-none">
                {{ queueStore.nowServing != null ? `#${queueStore.nowServing}` : '—' }}
              </p>
              <p v-if="!queueStore.isMyTurn && queueStore.peopleAhead != null" class="text-[10px] opacity-75 mt-0.5">
                {{ queueStore.peopleAhead === 0 ? "You're next!" : `${queueStore.peopleAhead} ahead` }}
              </p>
            </div>
          </div>
        </Transition>

        <!-- Item 2: Today's Appointment Banner -->
        <Transition name="queue-fade">
          <div
            v-if="todayAppointment && !queueStore.hasActiveQueue"
            class="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-500/10 dark:to-sky-500/10 px-4 py-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="shrink-0 h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <i class="pi pi-calendar text-blue-500 dark:text-blue-400 text-sm"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">Today's Appointment</p>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ todayAppointment.serviceType }}</p>
              </div>
            </div>
            <span
              class="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="todayAppointment.status === 'confirmed'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'"
            >
              <span class="h-1.5 w-1.5 rounded-full"
                :class="todayAppointment.status === 'confirmed' ? 'bg-blue-500' : 'bg-amber-500'"
              ></span>
              {{ statusLabel(todayAppointment.status) }}
            </span>
          </div>
        </Transition>

        <!-- Show to Staff + Download buttons -->
        <div class="flex items-center justify-end gap-2">
          <button
            @click="downloadId"
            :disabled="downloadingId"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-150 disabled:opacity-60"
          >
            <i :class="downloadingId ? 'pi pi-spin pi-spinner' : 'pi pi-download'" class="text-emerald-500 text-xs"></i>
            {{ downloadingId ? 'Saving…' : 'Save ID' }}
          </button>
          <button
            @click="showStaffModal = true"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-150"
          >
            <i class="pi pi-eye text-sky-500 text-xs"></i>
            Show to Staff
          </button>
        </div>

        <div
          ref="idCardRef"
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
                    Secure patient identity card for portal access, clinic verification, and facility reference.
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
                    <h2 class="mt-1 break-words text-lg sm:text-xl font-semibold leading-snug">{{ fullName || 'No Name Available' }}</h2>
                    <p class="mt-1 break-all text-xs sm:text-sm text-blue-50/85">{{ user.email || 'No email available' }}</p>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs">
                    <i class="pi pi-shield text-[10px]"></i> Active
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[11px] sm:text-xs">
                    <i class="pi pi-star text-[10px]"></i> Portal Member
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
                    <p class="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-blue-50/80">Registered Facility</p>
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
                </div>
                <div class="shrink-0 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 px-3 py-2.5 shadow-lg text-center min-w-[4rem]">
                  <p class="text-[9px] text-white/70 uppercase tracking-widest leading-none">REF ID</p>
                  <p class="mt-1 text-xs font-black text-white tracking-wider leading-none">{{ patientDisplayId }}</p>
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
                    <p class="text-sm font-semibold text-slate-900 dark:text-white break-words">{{ formatBirthday }}</p>
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
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-slate-400">PIN</p>
                    <button
                      @click="copyPin"
                      class="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-200 transition-colors"
                    >
                      <i class="pi pi-copy text-[10px]"></i> Copy
                    </button>
                  </div>
                  <p class="text-sm sm:text-base font-bold tracking-[0.12em] text-sky-600 dark:text-sky-300 break-all">{{ user.pin || '—' }}</p>
                  <p class="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">Present this PIN to front desk staff when checking in or verifying your identity.</p>
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
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">Digital Patient ID</p>
                </div>
              </div>

              <!-- QR Code Section -->
              <div class="mt-5 border-t border-slate-200 dark:border-white/10 pt-5">
                <div class="flex flex-col sm:flex-row items-center gap-5">
                  <!-- QR Image -->
                  <div class="shrink-0 flex flex-col items-center gap-2">
                    <div class="rounded-2xl border-2 border-slate-100 dark:border-white/10 bg-white p-2 shadow-sm">
                      <img
                        v-if="qrDataUrl"
                        :src="qrDataUrl"
                        alt="Patient QR Code"
                        class="h-[110px] w-[110px] rounded-lg"
                      />
                      <div v-else class="h-[110px] w-[110px] flex items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5">
                        <i class="pi pi-spin pi-spinner text-slate-300 text-xl"></i>
                      </div>
                    </div>
                    <p class="text-[9px] text-slate-400 uppercase tracking-widest">Scan to verify</p>
                  </div>

                  <!-- QR Info -->
                  <div class="flex-1 min-w-0 text-center sm:text-left">
                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Patient QR Code</p>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                      Show this QR code at the clinic front desk for instant check-in.
                      <span v-if="todayAppointment" class="text-sky-500 dark:text-sky-400 font-medium">
                        Linked to today's appointment.
                      </span>
                    </p>
                    <div class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1">
                      <i class="pi pi-shield text-emerald-500 text-[10px]"></i>
                      <span class="text-[10px] font-semibold text-slate-600 dark:text-slate-300">REF: {{ patientDisplayId }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Visits -->
      <div v-if="activeTab === 'id' && recentVisits.length > 0" class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2">
          <i class="pi pi-history text-slate-400 text-sm"></i>
          <p class="text-sm font-semibold text-slate-800 dark:text-white">Recent Visits</p>
        </div>
        <div class="divide-y divide-slate-50 dark:divide-white/5">
          <div
            v-for="visit in recentVisits"
            :key="visit._id"
            class="flex items-center gap-3 px-4 py-3"
          >
            <div class="shrink-0 h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <i class="pi pi-check-circle text-emerald-500 text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{{ visit.serviceType }}</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{{ formatDate(visit.appointmentDate) }}</p>
            </div>
            <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
              Completed
            </span>
          </div>
        </div>
      </div>

      <!-- TAB: MY APPOINTMENTS -->
      <div v-if="activeTab === 'appointments'" class="space-y-5">

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
            class="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-150 whitespace-nowrap"
          >
            <i class="pi pi-plus text-[10px] sm:text-xs"></i>
            <span class="sm:hidden">Book</span>
            <span class="hidden sm:inline">Book Appointment</span>
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
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import QRCode from 'qrcode'
import html2pdf from 'html2pdf.js'
import { io } from 'socket.io-client'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useTenantStore } from '../stores/tenantStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { useQueueStore } from '../stores/queueStore'
import { useServiceStore } from '../stores/serviceStore'
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
const queueStore = useQueueStore()
const serviceStore = useServiceStore()
const toast = useToast()

const { fetchTenant } = tenantStore
const { fetchUserTenant } = authTenantStore
const { tenant } = storeToRefs(tenantStore)
const { myAppointments, loading: appointmentLoading } = storeToRefs(appointmentStore)

const activeTab = ref('id')
const tenantId = ref(null)
const isLoading = ref(false)
const tenantName = computed(() => tenant.value?.name || 'Health Facility')

const showBookDialog  = ref(false)
const showCancelDialog = ref(false)
const showStaffModal  = ref(false)
const showTurnAlert   = ref(false)
const qrDataUrl       = ref('')
const bookLoading = ref(false)
const cancelLoading = ref(false)
const downloadingId   = ref(false)
const cancelReason = ref('')
const cancelTarget = ref(null)
const idCardRef = ref(null)

const bookForm = ref({ serviceType: '', appointmentDate: '', notes: '' })

const today = computed(() => new Date().toISOString().split('T')[0])

const tabs = [
  { key: 'id', label: 'My ID', icon: 'pi pi-id-card' },
  { key: 'appointments', label: 'My Appointments', icon: 'pi pi-calendar' },
]

const { services: rawServices, loading: servicesLoading } = storeToRefs(serviceStore)
const serviceOptions = computed(() => rawServices.value.filter(s => s.isActive).map(s => s.name))

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

const todayAppointment = computed(() => {
  const todayStr = new Date().toISOString().split('T')[0]
  return myAppointments.value.find(a =>
    !['cancelled', 'completed'].includes(a.status) &&
    new Date(a.appointmentDate).toISOString().split('T')[0] === todayStr
  ) || null
})

const patientDisplayId = computed(() => {
  const id = user.value.id || user.value._id || ''
  return id ? String(id).slice(-8).toUpperCase() : '—'
})

const recentVisits = computed(() =>
  myAppointments.value
    .filter(a => a.status === 'completed')
    .slice(0, 3)
)

// QR payload — changes to include today's appointment when present (item 9)
const qrPayload = computed(() => {
  const pid = String(user.value.id || user.value._id || '')
  if (!pid) return ''
  const base = {
    v: 1,
    tid: localStorage.getItem('tenantId') || '',
    pid,
    ref: patientDisplayId.value,
  }
  if (todayAppointment.value?._id) {
    base.aid = String(todayAppointment.value._id)
  }
  return JSON.stringify(base)
})

watch(qrPayload, async (payload) => {
  if (!payload) { qrDataUrl.value = ''; return }
  try {
    qrDataUrl.value = await QRCode.toDataURL(payload, {
      width: 220,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
  } catch { qrDataUrl.value = '' }
}, { immediate: true })

const formatBirthday = computed(() => {
  if (!user.value.birthday) return '—'
  try {
    return new Date(user.value.birthday).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return user.value.birthday }
})

const copyPin = async () => {
  if (!user.value.pin) return
  try {
    await navigator.clipboard.writeText(user.value.pin)
    toast.add({ severity: 'success', summary: 'Copied', detail: 'PIN copied to clipboard', life: 2000 })
  } catch {
    toast.add({ severity: 'warn', summary: 'Copy failed', detail: 'Please copy your PIN manually', life: 2000 })
  }
}

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

const downloadId = async () => {
  if (!idCardRef.value || downloadingId.value) return
  downloadingId.value = true
  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: `patient-id-${patientDisplayId.value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
        jsPDF: { unit: 'mm', format: [210, 120], orientation: 'landscape' },
      })
      .from(idCardRef.value)
      .save()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save ID card', life: 3000 })
  } finally {
    downloadingId.value = false
  }
}

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
let socket = null

onMounted(async () => {
  isLoading.value = true
  try {
    tenantId.value = localStorage.getItem('tenantId')

    if (tenantId.value) {
      await fetchTenant(tenantId.value)
      serviceStore.fetchServices(tenantId.value)
    }

    const result = await fetchUserTenant()
    user.value = result.data

    await loadMyAppointments()

    // Socket.io — real-time "It's Your Turn" notification
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:3000'
    socket = io(baseUrl, { transports: ['websocket'], reconnectionAttempts: 5 })
    const userId = user.value.id || user.value._id
    if (userId) {
      socket.emit('join:patient', String(userId))
    }
    socket.on('appointment:ongoing', () => {
      showTurnAlert.value = true
      queueStore.setMyQueue(queueStore.myQueueNumber, 'ongoing')
    })
  } catch (error) {
    console.error('Error fetching user', error)
  } finally {
    isLoading.value = false
  }

  pollInterval = setInterval(loadMyAppointments, 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (socket) socket.disconnect()
})
</script>

<style scoped>
.queue-fade-enter-active,
.queue-fade-leave-active {
  transition: all 0.3s ease;
}
.queue-fade-enter-from,
.queue-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.turn-fade-enter-active,
.turn-fade-leave-active {
  transition: all 0.25s ease;
}
.turn-fade-enter-from,
.turn-fade-leave-to {
  opacity: 0;
}
.turn-fade-enter-active > div,
.turn-fade-leave-active > div {
  transition: transform 0.25s ease;
}
.turn-fade-enter-from > div,
.turn-fade-leave-to > div {
  transform: scale(0.92);
}
</style>
