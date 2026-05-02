import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../lib/axios'

const APPT_KEY = 'notif_appt_statuses'

export const useNotificationStore = defineStore('notifications', () => {
  const messageUnread   = ref(0)
  const emailUnread     = ref(0)
  const apptUpdateCount = ref(0)
  const recentItems     = ref([])  // for dropdown preview

  const totalBadge = computed(() => messageUnread.value + emailUnread.value + apptUpdateCount.value)

  // Load stored appointment statuses from localStorage
  const getStoredApptStatuses = () => {
    try { return JSON.parse(localStorage.getItem(APPT_KEY) || '{}') } catch { return {} }
  }
  const saveApptStatuses = (map) => {
    localStorage.setItem(APPT_KEY, JSON.stringify(map))
  }

  const clearApptNotifications = () => {
    apptUpdateCount.value = 0
    // Persist current statuses so next poll won't re-trigger
    const stored = getStoredApptStatuses()
    saveApptStatuses(stored)
  }

  const poll = async () => {
    const role     = localStorage.getItem('tenantRole')
    const tenantId = localStorage.getItem('tenantId')
    if (!role || !tenantId) return

    const items = []

    // ── 1. Message unread ───────────────────────────────────────────────────
    try {
      if (role === 'patient') {
        const res = await api.get('/conversations/my')
        const conv = res.data.data
        messageUnread.value = conv?.patientUnread || 0
        if (conv?.patientUnread > 0) {
          items.push({
            id: `msg-${conv._id}`,
            type: 'message',
            title: 'New message from clinic',
            body: conv.lastMessage || '',
            route: '/messages',
            at: conv.lastMessageAt,
          })
        }
      } else if (['admin', 'superadmin'].includes(role)) {
        const res = await api.get(`/conversations/${tenantId}/all`)
        const convs = res.data.data || []
        const total = convs.reduce((sum, c) => sum + (c.adminUnread || 0), 0)
        messageUnread.value = total
        if (total > 0) {
          const recent = convs.filter(c => c.adminUnread > 0).slice(0, 3)
          recent.forEach(c => {
            items.push({
              id: `msg-${c._id}`,
              type: 'message',
              title: `Message from ${c.patientName}`,
              body: c.lastMessage || '',
              route: '/messages',
              at: c.lastMessageAt,
            })
          })
        }
      }
    } catch (_) { /* silent */ }

    // ── 2. Email unread (backend isRead field) ──────────────────────────────
    try {
      if (role === 'patient') {
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const res = await api.get(`email/emails/${userEmail}`)
          const emails = Array.isArray(res.data) ? res.data : (res.data?.data || [])
          const unread = emails.filter(e => !e.isRead).length
          emailUnread.value = unread
          if (unread > 0) {
            items.push({ id: 'email-unread', type: 'email', title: `${unread} unread email${unread > 1 ? 's' : ''}`, body: 'Tap to view your emails', route: '/inbox', at: null })
          }
        }
      } 
    } catch (_) { /* silent */ }

    // ── 3. Appointment status updates (patient only) ────────────────────────
    if (role === 'patient') {
      try {
        const res = await api.get('/appointments/my')
        const appts = res.data.data || []
        const stored = getStoredApptStatuses()
        let changed = 0
        const nowMap = {}

        appts.forEach(a => {
          nowMap[a._id] = a.status
          if (stored[a._id] && stored[a._id] !== a.status) {
            changed++
            const label = {
              confirmed: 'confirmed', 'in-queue': 'added to queue',
              ongoing: 'now being served', completed: 'completed', cancelled: 'cancelled',
            }[a.status] || a.status
            items.push({
              id: `appt-${a._id}`,
              type: 'appointment',
              title: 'Appointment Update',
              body: `Your ${a.serviceType} appointment has been ${label}.`,
              route: '/patient',
              at: a.updatedAt,
            })
          }
          // First time seeing this appointment — store but don't notify
          if (!stored[a._id]) nowMap[a._id] = a.status
        })

        // Only update stored if we have real data (don't overwrite on error)
        saveApptStatuses({ ...stored, ...nowMap })

        // Only increment, don't reset (cleared explicitly by clearApptNotifications)
        apptUpdateCount.value = changed > 0 ? changed : apptUpdateCount.value
      } catch (_) { /* silent */ }
    }

    // Sort recent items by time, newest first, cap at 6
    recentItems.value = items
      .sort((a, b) => (b.at ? new Date(b.at) : 0) - (a.at ? new Date(a.at) : 0))
      .slice(0, 6)
  }

  const markEmailsRead = () => { emailUnread.value = 0 }
  const markMessagesRead = () => { messageUnread.value = 0 }

  return {
    messageUnread, emailUnread, apptUpdateCount,
    totalBadge, recentItems,
    poll, clearApptNotifications, markEmailsRead, markMessagesRead,
  }
})
