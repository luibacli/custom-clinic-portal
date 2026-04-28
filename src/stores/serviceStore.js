import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../lib/axios'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])
  const loading  = ref(false)

  const fetchServices = async (tenantId) => {
    loading.value = true
    try {
      const res = await api.get(`/services/${tenantId}`)
      services.value = res.data.data || []
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch services' }
    } finally {
      loading.value = false
    }
  }

  const createService = async (tenantId, payload) => {
    try {
      const res = await api.post(`/services/${tenantId}`, payload)
      services.value.push(res.data.data)
      return { success: true, data: res.data.data, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create service' }
    }
  }

  const updateService = async (id, payload) => {
    try {
      const res = await api.patch(`/services/${id}`, payload)
      const idx = services.value.findIndex(s => s._id === id)
      if (idx !== -1) services.value[idx] = res.data.data
      return { success: true, data: res.data.data, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update service' }
    }
  }

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`)
      services.value = services.value.filter(s => s._id !== id)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete service' }
    }
  }

  const seedDefaults = async (tenantId) => {
    try {
      const res = await api.post(`/services/${tenantId}/seed`)
      services.value = res.data.data || []
      return { success: true, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to seed defaults' }
    }
  }

  const toggleActive = async (id) => {
    const service = services.value.find(s => s._id === id)
    if (!service) return { success: false, message: 'Service not found' }
    return updateService(id, { isActive: !service.isActive })
  }

  return {
    services,
    loading,
    fetchServices,
    createService,
    updateService,
    deleteService,
    seedDefaults,
    toggleActive,
  }
})
