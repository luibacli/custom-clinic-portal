<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 dark:from-gray-950 dark:via-slate-900 dark:to-black p-3 sm:p-4 lg:p-6"
  >
    <!-- Header -->
    <div class="mb-4 sm:mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
          My Inbox
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
          View your account notifications, PhilHealth updates, and care reminders.
        </p>
      </div>

      <div
        class="flex items-center gap-3 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-4 py-3 shadow-sm self-start lg:self-auto"
      >
        <div
          class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold"
        >
          {{ initials }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-slate-800 dark:text-white">
            {{ firstName }} {{ lastName }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">User Account</p>
        </div>
      </div>
    </div>

    <!-- Mobile top switch -->
    <div class="mb-3 flex lg:hidden rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 p-1 backdrop-blur-xl shadow-sm">
      <button
        class="flex-1 rounded-xl px-4 py-2 text-sm font-medium transition"
        :class="!showDetailMobile
          ? 'bg-blue-600 text-white shadow'
          : 'text-slate-600 dark:text-slate-300'"
        @click="showDetailMobile = false"
      >
        Inbox
      </button>
      <button
        class="flex-1 rounded-xl px-4 py-2 text-sm font-medium transition"
        :class="showDetailMobile
          ? 'bg-blue-600 text-white shadow'
          : 'text-slate-600 dark:text-slate-300'"
        @click="showDetailMobile = true"
        :disabled="!selectedMessage"
      >
        Message
      </button>
    </div>

    <!-- Main -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Inbox List -->
      <div
        class="lg:col-span-4 xl:col-span-4"
        :class="showDetailMobile ? 'hidden lg:block' : 'block'"
      >
        <div
          class="overflow-hidden rounded-[1.75rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl"
        >
          <!-- Search/filter -->
          <div class="sticky top-0 z-10 border-b border-slate-200/70 dark:border-white/10 bg-white/90 dark:bg-slate-950/70 backdrop-blur-xl p-4 space-y-3">
            <span class="relative block">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <InputText
                v-model="search"
                placeholder="Search messages..."
                class="w-full pl-10 rounded-xl"
              />
            </span>

            <div class="flex flex-wrap gap-2">
              <Button
                label="All"
                size="small"
                :severity="activeFilter === 'all' ? 'info' : 'secondary'"
                :outlined="activeFilter !== 'all'"
                class="rounded-xl"
                @click="activeFilter = 'all'"
              />
              <Button
                label="Unread"
                size="small"
                :severity="activeFilter === 'unread' ? 'info' : 'secondary'"
                :outlined="activeFilter !== 'unread'"
                class="rounded-xl"
                @click="activeFilter = 'unread'"
              />
              <Button
                label="Clinic"
                size="small"
                :severity="activeFilter === 'clinic' ? 'success' : 'secondary'"
                :outlined="activeFilter !== 'clinic'"
                class="rounded-xl"
                @click="activeFilter = 'clinic'"
              />
            </div>
          </div>

          <!-- Messages -->
          <div class="max-h-[70vh] overflow-y-auto">
            <button
              v-for="message in filteredMessages"
              :key="message._id || message.id"
              @click="openMessage(message)"
              class="group w-full border-b border-slate-100 dark:border-white/5 px-4 py-4 text-left transition hover:bg-blue-50/80 dark:hover:bg-white/5"
              :class="selectedMessageKey === (message._id || message.id)
                ? 'bg-blue-100/70 dark:bg-blue-500/10'
                : ''"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  :class="iconClass(message.type)"
                >
                  <i :class="message.icon || 'pi pi-envelope'"></i>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <p
                      class="truncate text-sm"
                      :class="message.isRead === false
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'font-medium text-slate-700 dark:text-slate-200'"
                    >
                      {{ message.from || 'Unknown Sender' }}
                    </p>

                    <div class="flex shrink-0 items-center gap-2">
                      <span class="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
                        {{ message.date }}
                      </span>
                      <span
                        v-if="message.isRead === false"
                        class="h-2.5 w-2.5 rounded-full bg-blue-500"
                      ></span>
                    </div>
                  </div>

                  <p
                    class="mt-1 truncate text-sm"
                    :class="message.isRead === false
                      ? 'font-semibold text-slate-800 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-300'"
                  >
                    {{ message.subject || 'No Subject' }}
                  </p>

                  <p class="mt-1 line-clamp-2 text-xs text-slate-400 dark:text-slate-500">
                    {{ message.preview || 'No preview available.' }}
                  </p>

                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <Tag
                      :value="message.label || 'Message'"
                      :severity="tagSeverity(message.type)"
                      rounded
                    />
                  </div>
                </div>
              </div>
            </button>

            <div
              v-if="!filteredMessages.length"
              class="p-8 text-center text-sm text-slate-400 dark:text-slate-500"
            >
              No messages available.
            </div>
          </div>
        </div>
      </div>

      <!-- Message View -->
      <div
        class="lg:col-span-8 xl:col-span-8"
        :class="showDetailMobile ? 'block' : 'hidden lg:block'"
      >
        <div
          class="min-h-[72vh] overflow-hidden rounded-[1.75rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl"
        >
          <template v-if="selectedMessage">
            <!-- Top -->
            <div class="border-b border-slate-200/70 dark:border-white/10 p-4 sm:p-5 md:p-6">
              <div class="mb-3 flex items-center justify-between lg:hidden">
                <button
                  @click="showDetailMobile = false"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <i class="pi pi-arrow-left"></i>
                  Back
                </button>
              </div>

              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0">
                  <div class="mb-3 flex flex-wrap items-center gap-2">
                    <Tag
                      :value="selectedMessage.label || 'Message'"
                      :severity="tagSeverity(selectedMessage.type)"
                      rounded
                    />
                    <Tag
                      v-if="selectedMessage.transactionId"
                      :value="selectedMessage.transactionId"
                      severity="contrast"
                      rounded
                    />
                  </div>

                  <h2 class="break-words text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {{ selectedMessage.subject || 'No Subject' }}
                  </h2>

                  <div class="mt-3 space-y-1">
                    <p class="text-sm text-slate-700 dark:text-slate-200 break-all">
                      <span class="font-semibold">From:</span> {{ selectedMessage.from || 'Unknown Sender' }}
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ selectedMessage.date }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-4 sm:p-5 md:p-6">
              <h3 class="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
                Message
              </h3>

              <div
                class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-950 p-4 sm:p-5 md:p-6 shadow-inner"
              >
                <div
                  class="prose prose-sm max-w-none dark:prose-invert prose-p:mb-3 prose-strong:text-slate-800 dark:prose-strong:text-white break-words"
                  v-html="sanitizedBody"
                ></div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex min-h-[72vh] items-center justify-center p-8">
              <div class="text-center">
                <div
                  class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300"
                >
                  <i class="pi pi-envelope text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 dark:text-white">
                  No message selected
                </h3>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Select a message from your inbox to view its details.
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useEmailStore } from '../stores/emailStore'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { storeToRefs } from 'pinia'
import DOMPurify from 'dompurify'

const authTenantStore = useAuthTenantStore()
const emailStore = useEmailStore()

const { fetchUserTenant } = authTenantStore
const { fetchInboxByAddress, markEmailAsRead } = emailStore
const { inbox } = storeToRefs(emailStore)

const search = ref('')
const activeFilter = ref('all')
const selectedMessage = ref(null)
const firstName = ref('')
const lastName = ref('')
const showDetailMobile = ref(false)

const selectedMessageKey = computed(() => selectedMessage.value?._id || selectedMessage.value?.id)

const sanitizedBody = computed(() => {
  const raw = selectedMessage.value?.html || selectedMessage.value?.preview || '<p>No message content available.</p>'
  return DOMPurify.sanitize(raw)
})

const filteredMessages = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return inbox.value.filter((message) => {
    const matchSearch =
      !keyword ||
      message.subject?.toLowerCase().includes(keyword) ||
      message.from?.toLowerCase().includes(keyword) ||
      message.preview?.toLowerCase().includes(keyword)

    const matchFilter =
      activeFilter.value === 'all' ||
      (activeFilter.value === 'unread' && message.isRead === false) ||
      (activeFilter.value === 'clinic' && message.type === 'clinic')

    return matchSearch && matchFilter
  })
})

const initials = computed(() => {
  const first = firstName.value?.[0] || ''
  const last = lastName.value?.[0] || ''
  return `${first}${last}`.toUpperCase() || 'ID'
})

const iconClass = (type) => {
  if (type === 'philhealth') {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  }

  if (type === 'clinic') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  }

  return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
}

const tagSeverity = (type) => {
  if (type === 'philhealth') return 'success'
  if (type === 'clinic') return 'info'
  return 'secondary'
}

const openMessage = async (message) => {
  selectedMessage.value = message
  showDetailMobile.value = true

  if (message.isRead === false) {
    try {
      await markEmailAsRead(message._id || message.id)
      message.isRead = true

      if (selectedMessage.value) {
        selectedMessage.value.isRead = true
      }
    } catch (error) {
      console.error('Failed to mark email as read:', error.message)
    }
  }
}

watch(
  inbox,
  (newInbox) => {
    if (newInbox.length && !selectedMessage.value) {
      selectedMessage.value = newInbox[0]
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    const result = await fetchUserTenant()

    if (!result?.data?.email) {
      throw new Error('No Address Found')
    }

    const userData = result.data
    firstName.value = userData.firstName || ''
    lastName.value = userData.lastName || ''

    await fetchInboxByAddress(userData.email)

    if (inbox.value.length && !selectedMessage.value) {
      selectedMessage.value = inbox.value[0]
    }
  } catch (error) {
    console.error('Inbox Server Error:', error.message)
  }
})
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-button) {
  width: auto;
}

:deep(.p-inputtext) {
  width: 100%;
  border-radius: 0.9rem;
}

:deep(.p-tag) {
  font-size: 0.72rem;
}

:deep(.p-button) {
  border-radius: 0.85rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>