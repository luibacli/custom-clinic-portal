<template>
  <div class="flex h-[calc(100svh-88px)] lg:h-[calc(100svh-32px)] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 shadow-sm">
    <Toast />

    <!-- ── PATIENT VIEW ──────────────────────────────────────────────── -->
    <template v-if="isPatient">
      <div class="flex flex-col w-full">
        <!-- Chat header -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shrink-0">
            <i class="pi pi-building text-white text-sm"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ tenantName || 'Your Clinic' }}</p>
            <p class="text-xs text-slate-400">Clinic Support</p>
          </div>
          <div class="ml-auto flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs text-slate-400">Active</span>
          </div>
        </div>

        <!-- Messages area -->
        <div ref="msgContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
          <!-- Init state -->
          <div v-if="!myConversation && !messageStore.loading" class="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div class="h-16 w-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
              <i class="pi pi-comments text-sky-500 text-2xl"></i>
            </div>
            <div>
              <p class="font-semibold text-slate-800 dark:text-white">Start a conversation</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Send a message to your clinic and they'll get back to you.</p>
            </div>
          </div>

          <!-- Loading -->
          <div v-else-if="messageStore.loading" class="flex justify-center py-10">
            <i class="pi pi-spin pi-spinner text-sky-400 text-xl"></i>
          </div>

          <!-- Empty conversation -->
          <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-3 text-center">
            <i class="pi pi-comments text-slate-300 dark:text-slate-600 text-4xl"></i>
            <p class="text-sm text-slate-400">No messages yet. Say hello!</p>
          </div>

          <!-- Message bubbles -->
          <template v-else>
            <div
              v-for="msg in messages"
              :key="msg._id"
              class="flex"
              :class="isOwnMessage(msg) ? 'justify-end' : 'justify-start'"
            >
              <div class="max-w-[78%] sm:max-w-[65%]">
                <div
                  class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  :class="isOwnMessage(msg)
                    ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-br-md'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-bl-md'"
                >
                  {{ msg.content }}
                </div>
                <p class="mt-1 text-[10px] text-slate-400 dark:text-slate-500" :class="isOwnMessage(msg) ? 'text-right' : 'text-left'">
                  {{ formatTime(msg.createdAt) }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900">
          <form @submit.prevent="handleSend" class="flex items-end gap-2">
            <Textarea
              v-model="draft"
              rows="1"
              :autoResize="true"
              placeholder="Type a message..."
              class="flex-1 resize-none !rounded-2xl text-sm"
              @keydown.enter.exact.prevent="handleSend"
            />
            <button
              type="submit"
              :disabled="!draft.trim() || messageStore.sending"
              class="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i class="pi pi-send text-sm" :class="{ 'animate-pulse': messageStore.sending }"></i>
            </button>
          </form>
          <p class="mt-1 text-[10px] text-slate-400 text-center">Enter to send &bull; Updates every 8 seconds</p>
        </div>
      </div>
    </template>

    <!-- ── ADMIN VIEW ────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Conversation List (left panel) -->
      <div
        class="flex flex-col shrink-0 border-r border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900"
        :class="activeConv && isMobile ? 'hidden' : 'w-full sm:w-72 lg:w-80'"
      >
        <div class="px-4 py-3 border-b border-slate-100 dark:border-white/10">
          <p class="font-bold text-slate-900 dark:text-white text-base">Messages</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ conversations.length }} conversation{{ conversations.length !== 1 ? 's' : '' }}</p>
        </div>

        <div class="flex-1 overflow-y-auto">
          <!-- Loading -->
          <div v-if="messageStore.loading" class="flex justify-center py-10">
            <i class="pi pi-spin pi-spinner text-sky-400 text-xl"></i>
          </div>

          <!-- Empty -->
          <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
            <i class="pi pi-comments text-slate-300 dark:text-slate-600 text-3xl"></i>
            <p class="text-sm text-slate-400">No patient conversations yet.</p>
          </div>

          <!-- List -->
          <button
            v-for="conv in conversations"
            :key="conv._id"
            @click="selectConversation(conv)"
            class="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/5"
            :class="activeConv?._id === conv._id ? 'bg-sky-50 dark:bg-sky-500/10 border-b-sky-100 dark:border-b-sky-500/20' : ''"
          >
            <!-- Avatar -->
            <div class="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold">
              {{ initials(conv.patientName) }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ conv.patientName }}</p>
                <span class="text-[10px] text-slate-400 shrink-0">{{ formatTimeShort(conv.lastMessageAt) }}</span>
              </div>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                {{ conv.lastMessage || 'No messages yet' }}
              </p>
            </div>

            <!-- Unread badge -->
            <span v-if="conv.adminUnread > 0"
              class="shrink-0 mt-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center"
            >{{ conv.adminUnread }}</span>
          </button>
        </div>
      </div>

      <!-- Chat Panel (right) -->
      <div
        class="flex flex-col flex-1 min-w-0"
        :class="!activeConv && isMobile ? 'hidden' : ''"
      >
        <!-- No conversation selected -->
        <div v-if="!activeConv" class="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
          <div class="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
            <i class="pi pi-comments text-slate-400 text-2xl"></i>
          </div>
          <div>
            <p class="font-semibold text-slate-700 dark:text-slate-200">Select a conversation</p>
            <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Choose a patient from the list to view their messages.</p>
          </div>
        </div>

        <template v-else>
          <!-- Chat header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900">
            <button v-if="isMobile" @click="activeConv = null" class="text-slate-400 hover:text-slate-600 mr-1">
              <i class="pi pi-arrow-left"></i>
            </button>
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {{ initials(activeConv.patientName) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ activeConv.patientName }}</p>
              <p class="text-xs text-slate-400 truncate">{{ activeConv.patientEmail }}</p>
            </div>
          </div>

          <!-- Messages -->
          <div ref="msgContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <div v-if="messageStore.loading" class="flex justify-center py-10">
              <i class="pi pi-spin pi-spinner text-sky-400 text-xl"></i>
            </div>

            <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-3 text-center">
              <i class="pi pi-comments text-slate-300 dark:text-slate-600 text-4xl"></i>
              <p class="text-sm text-slate-400">No messages in this conversation yet.</p>
            </div>

            <template v-else>
              <div
                v-for="msg in messages"
                :key="msg._id"
                class="flex"
                :class="isOwnMessage(msg) ? 'justify-end' : 'justify-start'"
              >
                <div class="max-w-[75%] sm:max-w-[60%]">
                  <p v-if="!isOwnMessage(msg)" class="text-[10px] text-slate-400 mb-1 pl-1">{{ msg.senderName }}</p>
                  <div
                    class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    :class="isOwnMessage(msg)
                      ? 'bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-bl-md'"
                  >
                    {{ msg.content }}
                  </div>
                  <p class="mt-1 text-[10px] text-slate-400 dark:text-slate-500" :class="isOwnMessage(msg) ? 'text-right' : 'text-left'">
                    {{ formatTime(msg.createdAt) }}
                  </p>
                </div>
              </div>
            </template>
          </div>

          <!-- Input -->
          <div class="px-4 py-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900">
            <form @submit.prevent="handleSend" class="flex items-end gap-2">
              <Textarea
                v-model="draft"
                rows="1"
                :autoResize="true"
                placeholder="Reply to patient..."
                class="flex-1 resize-none !rounded-2xl text-sm"
                @keydown.enter.exact.prevent="handleSend"
              />
              <button
                type="submit"
                :disabled="!draft.trim() || messageStore.sending"
                class="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i class="pi pi-send text-sm"></i>
              </button>
            </form>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Textarea from 'primevue/textarea'
import { useTenantStore } from '../stores/tenantStore'
import { useMessageStore } from '../stores/messageStore'
import { useNotificationStore } from '../stores/notificationStore'

const toast = useToast()
const tenantStore = useTenantStore()
const messageStore = useMessageStore()
const notifStore = useNotificationStore()

const { tenant } = storeToRefs(tenantStore)

// Use localStorage as source of truth — Pinia flags reset to false on page refresh
// because fetchUserTenant() (which sets them) is only called during login, not on every load.
const _role = localStorage.getItem('tenantRole') || ''
const isPatient = _role === 'patient'
const isAdmin   = _role === 'admin' || _role === 'superadmin'
const { myConversation, conversations, messages } = storeToRefs(messageStore)

const tenantName = computed(() => tenant.value?.name || '')
const tenantId = computed(() => localStorage.getItem('tenantId') || '')

// Decode userId from JWT (JWT payload contains { id })
const userId = computed(() => {
  const token = localStorage.getItem('tenantToken')
  if (!token) return ''
  try {
    return JSON.parse(atob(token.split('.')[1]))?.id || ''
  } catch { return '' }
})

const draft = ref('')
const activeConv = ref(null)
const msgContainer = ref(null)
const isMobile = ref(window.innerWidth < 640)

let pollInterval = null
const handleResize = () => { isMobile.value = window.innerWidth < 640 }

const isOwnMessage = (msg) => String(msg.senderId) === userId.value

const initials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  return sameDay
    ? d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatTimeShort = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  return sameDay
    ? d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}

watch(messages, scrollToBottom)

const handleSend = async () => {
  const text = draft.value.trim()
  if (!text) return

  let convId
  if (isPatient) {
    if (!myConversation.value) {
      const r = await messageStore.initMyConversation()
      if (!r.success) { toast.add({ severity: 'error', summary: 'Error', detail: r.message, life: 3000 }); return }
    }
    convId = myConversation.value._id
  } else {
    if (!activeConv.value) return
    convId = activeConv.value._id
  }

  draft.value = ''
  const res = await messageStore.sendMessage(convId, text)
  if (!res.success) {
    draft.value = text
    toast.add({ severity: 'error', summary: 'Failed to send', detail: res.message, life: 3000 })
  }
}

const selectConversation = async (conv) => {
  activeConv.value = conv
  await messageStore.fetchMessages(conv._id)
  await messageStore.markAsRead(conv._id)
  notifStore.markMessagesRead()
}

const pollPatient = async () => {
  if (!myConversation.value) return
  await messageStore.pollMessages(myConversation.value._id)
}

const pollAdmin = async () => {
  await messageStore.fetchAllConversations(tenantId.value)
  if (activeConv.value) {
    await messageStore.pollMessages(activeConv.value._id)
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  if (isPatient) {
    await messageStore.fetchMyConversation()
    if (myConversation.value) {
      await messageStore.fetchMessages(myConversation.value._id)
      await messageStore.markAsRead(myConversation.value._id)
    }
    notifStore.markMessagesRead()
    pollInterval = setInterval(pollPatient, 8000)
  } else {
    await messageStore.fetchAllConversations(tenantId.value)
    pollInterval = setInterval(pollAdmin, 10000)
  }

  scrollToBottom()
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  messageStore.clearMessages()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
:deep(.p-textarea) {
  border-radius: 1rem;
  max-height: 120px;
  font-size: 0.875rem;
}
</style>
