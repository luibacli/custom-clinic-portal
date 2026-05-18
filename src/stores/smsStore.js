import { defineStore } from 'pinia'
import api from '../lib/axios'

export const useSmsStore = defineStore('sms', {
  state: () => ({
    credits:    0,
    recipients: 0,
    blasts:     [],
    total:      0,
    page:       1,
    pages:      1,
    packages:   [],
    loading:    false,
    sending:    false,
  }),
  actions: {
    async fetchStats() {
      try {
        const { data } = await api.get('/sms/stats')
        if (data.success) {
          this.credits    = data.credits
          this.recipients = data.recipients
        }
      } catch (error) {
        console.error('Failed to fetch SMS stats', error.message)
      }
    },
    async fetchBlasts(page = 1) {
      this.loading = true
      try {
        const { data } = await api.get('/sms/blasts', { params: { page, limit: 10 } })
        if (data.success) {
          this.blasts = data.data
          this.total  = data.total
          this.page   = data.page
          this.pages  = data.pages
        }
      } catch (error) {
        console.error('Failed to fetch blast history', error.message)
      } finally {
        this.loading = false
      }
    },
    async fetchPackages() {
      try {
        const { data } = await api.get('/sms/packages')
        if (data.success) this.packages = data.data
      } catch (error) {
        console.error('Failed to fetch SMS packages', error.message)
      }
    },
    async sendBlast(message) {
      this.sending = true
      try {
        const { data } = await api.post('/sms/blast', { message })
        return { success: data.success, data, message: data.message }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to send blast' }
      } finally {
        this.sending = false
      }
    },
    async sendCsvBatch(formData) {
      this.sending = true
      try {
        const { data } = await api.post('/sms/blast/csv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { success: data.success, data, message: data.message }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to send CSV batch' }
      } finally {
        this.sending = false
      }
    },
    async createCheckout(packageKey) {
      try {
        const { data } = await api.post('/sms/credits/checkout', { packageKey })
        return { success: data.success, checkoutUrl: data.checkoutUrl, credits: data.credits, amount: data.amount }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Checkout failed' }
      }
    },
  },
})
