import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../lib/axios'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const summary      = ref({ totalRevenue: 0, subTotal: 0, smsTotal: 0, count: 0 })
  const pagination   = ref({ total: 0, page: 1, limit: 20, pages: 1 })
  const loading      = ref(false)
  const summaryLoading = ref(false)

  const fetchTransactions = async (filters = {}) => {
    loading.value = true
    try {
      const params = {}
      if (filters.type)         params.type         = filters.type
      if (filters.status)       params.status       = filters.status
      if (filters.tenantFilter) params.tenantFilter = filters.tenantFilter
      if (filters.from)         params.from         = filters.from
      if (filters.to)           params.to           = filters.to
      if (filters.page)         params.page         = filters.page
      if (filters.limit)        params.limit        = filters.limit

      const { data } = await api.get('/billing/transactions', { params })
      transactions.value = data.data    || []
      pagination.value   = data.pagination || { total: 0, page: 1, limit: 20, pages: 1 }
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchSummary = async (tenantFilter) => {
    summaryLoading.value = true
    try {
      const params = tenantFilter ? { tenantFilter } : {}
      const { data } = await api.get('/billing/transactions/summary', { params })
      summary.value = data.data || { totalRevenue: 0, subTotal: 0, smsTotal: 0, count: 0 }
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || err.message }
    } finally {
      summaryLoading.value = false
    }
  }

  return { transactions, summary, pagination, loading, summaryLoading, fetchTransactions, fetchSummary }
})
