<template>
  <div class="flex h-[calc(100vh-80px)] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 shadow-sm">

    <!-- ── LEFT SIDEBAR ──────────────────────────────────────────────── -->
    <aside class="shrink-0 w-14 xl:w-56 border-r border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <MailSidebar
        :active-folder="activeFolder"
        :unread-count="unreadCount"
        @compose="showCompose = true"
        @folder-change="onFolderChange"
      />
    </aside>

    <!-- ── MIDDLE: EMAIL LIST ────────────────────────────────────────── -->
    <div
      class="shrink-0 border-r border-slate-100 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-950"
      :class="showViewer && isMobile ? 'hidden' : isMobile ? 'flex-1' : 'w-72 lg:w-80 xl:w-96'"
    >
      <!-- Inbox / placeholder header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white capitalize">{{ activeFolder }}</h2>
          <span
            v-if="activeFolder === 'inbox' && displayedMessages.length > 0"
            class="rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-semibold px-1.5 py-0.5"
          >{{ displayedMessages.length }}</span>
        </div>
        <button
          v-if="activeFolder === 'inbox'"
          @click="refreshInbox"
          :disabled="loading"
          class="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
          title="Refresh"
        >
          <i class="pi text-sm" :class="loading ? 'pi-spin pi-spinner' : 'pi-refresh'"></i>
        </button>
      </div>

      <!-- Inbox is connected to live data -->
      <MailList
        v-if="activeFolder === 'inbox'"
        :messages="displayedMessages"
        :selected-id="selectedId"
        :loading="loading"
        @select="openMessage"
      />

      <!-- Placeholder folders -->
      <div v-else class="flex flex-col items-center justify-center h-[calc(100%-49px)] gap-4 px-5 text-center">
        <div class="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
          <i class="text-slate-300 dark:text-slate-600 text-2xl" :class="folderIcon(activeFolder)"></i>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">{{ activeFolder }}</p>
          <p class="mt-1 text-xs text-slate-400 dark:text-slate-600">This folder will be available soon.</p>
        </div>
      </div>
    </div>

    <!-- ── RIGHT: EMAIL VIEWER ───────────────────────────────────────── -->
    <div
      class="flex-1 min-w-0 overflow-hidden bg-white dark:bg-slate-950"
      :class="!showViewer && isMobile ? 'hidden' : ''"
    >
      <MailViewer
        :message="selectedMessage"
        :show-back="isMobile && showViewer"
        @back="showViewer = false"
        @reply="onReply"
        @forward="onForward"
        @delete="onDelete"
      />
    </div>

    <!-- ── COMPOSE MODAL ─────────────────────────────────────────────── -->
    <ComposeModal
      v-model:visible="showCompose"
      @send="onComposeSend"
      @draft="onComposeDraft"
    />

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

import { useAuthTenantStore } from '../stores/authTenantStore'
import { useEmailStore }      from '../stores/emailStore'
import { useNotificationStore } from '../stores/notificationStore'

import MailSidebar   from '../components/mail/MailSidebar.vue'
import MailList      from '../components/mail/MailList.vue'
import MailViewer    from '../components/mail/MailViewer.vue'
import ComposeModal  from '../components/mail/ComposeModal.vue'

// ── Stores ─────────────────────────────────────────────────────────────────
const authTenantStore = useAuthTenantStore()
const emailStore      = useEmailStore()
const notifStore      = useNotificationStore()
const toast           = useToast()

const { fetchUserTenant }          = authTenantStore
const { fetchInboxByAddress, markEmailAsRead } = emailStore
const { inbox }                    = storeToRefs(emailStore)

// ── State ──────────────────────────────────────────────────────────────────
const activeFolder    = ref('inbox')
const selectedMessage = ref(null)
const showCompose     = ref(false)
const showViewer      = ref(false)
const loading         = ref(false)
const isMobile        = ref(window.innerWidth < 768)

// ── Computed ───────────────────────────────────────────────────────────────
const selectedId = computed(() =>
  selectedMessage.value?._id || selectedMessage.value?.id || null
)

const unreadCount = computed(() =>
  inbox.value.filter(m => m.isRead === false).length
)

// inbox is the live data source; placeholder folders use empty arrays
const displayedMessages = computed(() =>
  activeFolder.value === 'inbox' ? inbox.value : []
)

// ── Watch inbox — auto-select first item on load ───────────────────────────
watch(
  inbox,
  (newInbox) => {
    if (newInbox.length && !selectedMessage.value) {
      selectedMessage.value = newInbox[0]
    }
  },
  { immediate: true }
)

// ── Folder change ──────────────────────────────────────────────────────────
const onFolderChange = (folder) => {
  activeFolder.value = folder
  if (folder !== 'inbox') {
    selectedMessage.value = null
    showViewer.value = false
  }
}

// ── Open message ───────────────────────────────────────────────────────────
const openMessage = async (message) => {
  selectedMessage.value = message
  showViewer.value = true

  if (message.isRead === false) {
    try {
      await markEmailAsRead(message._id || message.id)
      message.isRead = true
      if (selectedMessage.value) selectedMessage.value.isRead = true
      // Sync notification badge
      notifStore.markEmailsRead()
    } catch (error) {
      console.error('Failed to mark email as read:', error.message)
    }
  }
}

// ── Refresh ────────────────────────────────────────────────────────────────
const refreshInbox = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const result = await fetchUserTenant()
    if (result?.data?.email) {
      await fetchInboxByAddress(result.data.email)
    }
  } catch (error) {
    console.error('Refresh error:', error.message)
  } finally {
    loading.value = false
  }
}

// ── Compose handlers (UI-only, no backend) ────────────────────────────────
const onComposeSend = () => {
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Email sending is not yet available.', life: 3500 })
}
const onComposeDraft = () => {
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Draft saving is not yet available.', life: 3500 })
}

// ── Viewer action handlers (UI-only) ──────────────────────────────────────
const onReply   = () => { showCompose.value = true }
const onForward = () => { showCompose.value = true }
const onDelete  = () => {
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Delete functionality is not yet available.', life: 3500 })
}

// ── Folder icon helper ─────────────────────────────────────────────────────
const folderIcon = (f) => ({
  sent:   'pi pi-send',
  drafts: 'pi pi-file-edit',
  trash:  'pi pi-trash',
}[f] || 'pi pi-folder')

// ── Lifecycle ──────────────────────────────────────────────────────────────
let handleResize

onMounted(async () => {
  handleResize = () => { isMobile.value = window.innerWidth < 768 }
  window.addEventListener('resize', handleResize)

  loading.value = true
  try {
    const result = await fetchUserTenant()
    if (!result?.data?.email) throw new Error('No email address found')

    await fetchInboxByAddress(result.data.email)

    if (inbox.value.length && !selectedMessage.value) {
      selectedMessage.value = inbox.value[0]
    }

    // Mark email notifications as read on open
    notifStore.markEmailsRead()
  } catch (error) {
    console.error('Mail load error:', error.message)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
})
</script>
