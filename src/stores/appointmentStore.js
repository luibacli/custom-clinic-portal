import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../lib/axios'

export const useAppointmentStore = defineStore('appointment', () => {
  const myAppointments = ref([])
  const allAppointments = ref([])
  const loading = ref(false)

  const createAppointment = async (data) => {
    try {
      const res = await api.post('/appointments', data)
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to book appointment' }
    }
  }

  const fetchMyAppointments = async () => {
    loading.value = true
    try {
      const res = await api.get('/appointments/my')
      myAppointments.value = res.data.data || []
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch appointments' }
    } finally {
      loading.value = false
    }
  }

  const fetchAllAppointments = async (tenantId, filters = {}) => {
    loading.value = true
    try {
      const params = {}
      if (filters.status && filters.status !== 'all') params.status = filters.status
      if (filters.date) params.date = filters.date
      if (filters.page) params.page = filters.page
      const res = await api.get(`/appointments/${tenantId}/all`, { params })
      allAppointments.value = res.data.data || []
      return { success: true, total: res.data.total, pages: res.data.pages }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch appointments' }
    } finally {
      loading.value = false
    }
  }

  const manageAppointment = async (id, data) => {
    try {
      const res = await api.patch(`/appointments/${id}/manage`, data)
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update appointment' }
    }
  }

  const cancelAppointment = async (id, cancelReason = '') => {
    try {
      const res = await api.patch(`/appointments/${id}/cancel`, { cancelReason })
      return { success: true, data: res.data.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to cancel' }
    }
  }

  return {
    myAppointments,
    allAppointments,
    loading,
    createAppointment,
    fetchMyAppointments,
    fetchAllAppointments,
    manageAppointment,
    cancelAppointment,
  }
})
