import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../lib/axios'

export const useMessageStore = defineStore('messages', () => {
  // Patient: their single conversation
  const myConversation = ref(null)

  // Admin: list of all conversations
  const conversations = ref([])

  // Active chat messages
  const messages = ref([])

  // Currently viewed conversation ID (admin)
  const activeConversationId = ref(null)

  const loading = ref(false)
  const sending = ref(false)

  // Patient: start or retrieve their conversation
  const initMyConversation = async () => {
    try {
      const res = await api.post('/conversations')
      myConversation.value = res.data.data
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to start conversation' }
    }
  }

  const fetchMyConversation = async () => {
    try {
      const res = await api.get('/conversations/my')
      myConversation.value = res.data.data
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false }
    }
  }

  // Admin: fetch all conversations for a tenant
  const fetchAllConversations = async (tenantId) => {
    try {
      const res = await api.get(`/conversations/${tenantId}/all`)
      conversations.value = res.data.data || []
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  }

  // Fetch messages for the active conversation
  const fetchMessages = async (conversationId) => {
    loading.value = true
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`)
      messages.value = res.data.data || []
      activeConversationId.value = conversationId
      return { success: true }
    } catch (err) {
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  // Poll for new messages (append only new ones)
  const pollMessages = async (conversationId) => {
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`)
      const fresh = res.data.data || []
      if (fresh.length !== messages.value.length) {
        messages.value = fresh
      }
    } catch (_) { /* silent */ }
  }

  const sendMessage = async (conversationId, content) => {
    sending.value = true
    try {
      const res = await api.post(`/conversations/${conversationId}/messages`, { content })
      if (res.data.success) {
        messages.value.push(res.data.data)
        // Update local conversation preview
        const conv = conversations.value.find(c => String(c._id) === String(conversationId))
        if (conv) {
          conv.lastMessage = content.substring(0, 120)
          conv.lastMessageAt = new Date().toISOString()
        }
        if (myConversation.value && String(myConversation.value._id) === String(conversationId)) {
          myConversation.value.lastMessage = content.substring(0, 120)
          myConversation.value.lastMessageAt = new Date().toISOString()
        }
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to send' }
    } finally {
      sending.value = false
    }
  }

  const markAsRead = async (conversationId) => {
    try {
      await api.patch(`/conversations/${conversationId}/read`)
      // Clear local unread indicator
      const conv = conversations.value.find(c => String(c._id) === String(conversationId))
      if (conv) conv.adminUnread = 0
      if (myConversation.value && String(myConversation.value._id) === String(conversationId)) {
        myConversation.value.patientUnread = 0
      }
    } catch (_) { /* silent */ }
  }

  const clearMessages = () => {
    messages.value = []
    activeConversationId.value = null
  }

  return {
    myConversation,
    conversations,
    messages,
    activeConversationId,
    loading,
    sending,
    initMyConversation,
    fetchMyConversation,
    fetchAllConversations,
    fetchMessages,
    pollMessages,
    sendMessage,
    markAsRead,
    clearMessages,
  }
})
