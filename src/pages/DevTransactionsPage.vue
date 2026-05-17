<template>
  <Toast />
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-5">

      <!-- Header -->
      <section class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-emerald-200/30 blur-2xl dark:bg-emerald-500/10"></div>
        <div class="relative p-4 sm:p-6 lg:p-7">
          <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <p class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">Dev Console</p>
              <h1 class="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Transaction Logs</h1>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">All payment transactions across every tenant.</p>
            </div>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              class="rounded-2xl w-full xl:w-auto"
              :loading="transactionStore.loading"
              @click="loadAll"
            />
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Revenue MTD</p>
              <h2 class="text-xl font-bold text-slate-800 dark:text-white mt-1">
                {{ transactionStore.summaryLoading ? '—' : formatAmount(transactionStore.summary.totalRevenue) }}
              </h2>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center dark:bg-emerald-500/15 shrink-0">
              <i class="pi pi-chart-line text-emerald-600 dark:text-emerald-300 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Subscriptions MTD</p>
              <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {{ transactionStore.summaryLoading ? '—' : formatAmount(transactionStore.summary.subTotal) }}
              </h2>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center dark:bg-blue-500/15 shrink-0">
              <i class="pi pi-credit-card text-blue-600 dark:text-blue-300 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">SMS Credits MTD</p>
              <h2 class="text-xl font-bold text-violet-600 dark:text-violet-400 mt-1">
                {{ transactionStore.summaryLoading ? '—' : formatAmount(transactionStore.summary.smsTotal) }}
              </h2>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center dark:bg-violet-500/15 shrink-0">
              <i class="pi pi-mobile text-violet-600 dark:text-violet-300 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Transactions MTD</p>
              <h2 class="text-xl font-bold text-slate-800 dark:text-white mt-1">
                {{ transactionStore.summaryLoading ? '—' : transactionStore.summary.count }}
              </h2>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center dark:bg-slate-800 shrink-0">
              <i class="pi pi-list text-slate-600 dark:text-slate-300 text-xl"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters + Table -->
      <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <!-- Filter bar -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
            <Select
              v-model="filters.type"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Types"
              showClear
              class="w-full"
            />
            <Select
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              showClear
              class="w-full"
            />
            <InputText
              v-model="filters.from"
              type="date"
              placeholder="From"
              class="w-full rounded-2xl"
            />
            <InputText
              v-model="filters.to"
              type="date"
              placeholder="To"
              class="w-full rounded-2xl"
            />
            <Button
              label="Apply"
              icon="pi pi-filter"
              class="rounded-2xl w-full"
              @click="applyFilters"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="p-2 sm:p-3">
          <DataTable
            :value="transactionStore.transactions"
            :loading="transactionStore.loading"
            dataKey="_id"
            responsiveLayout="scroll"
            class="p-datatable-sm tx-table"
            :rowHover="true"
          >
            <template #empty>
              <div class="text-center py-12">
                <div class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 dark:bg-slate-800 dark:text-slate-300">
                  <i class="pi pi-list text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white">No transactions found</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Adjust your filters or wait for the first payment.</p>
              </div>
            </template>

            <Column header="Tenant" style="min-width: 200px">
              <template #body="{ data }">
                <div>
                  <p class="font-semibold text-slate-800 dark:text-slate-100 truncate">{{ data.tenantId?.name || '—' }}</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ data.tenantId?.domain || '' }}</p>
                </div>
              </template>
            </Column>

            <Column header="Type" style="min-width: 160px">
              <template #body="{ data }">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="data.type === 'subscription'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                    : 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300'"
                >
                  <i :class="data.type === 'subscription' ? 'pi pi-credit-card' : 'pi pi-mobile'" class="text-[10px]"></i>
                  {{ data.type === 'subscription' ? 'Subscription' : 'SMS Credits' }}
                </span>
              </template>
            </Column>

            <Column header="Detail" style="min-width: 160px">
              <template #body="{ data }">
                <span v-if="data.type === 'subscription'" class="text-sm text-slate-700 dark:text-slate-300 capitalize">
                  {{ data.plan || '—' }}
                  <span v-if="data.billing" class="text-xs text-slate-400 dark:text-slate-500">({{ data.billing }})</span>
                </span>
                <span v-else class="text-sm text-slate-700 dark:text-slate-300">
                  {{ data.credits != null ? `${data.credits} credits` : '—' }}
                </span>
              </template>
            </Column>

            <Column header="Amount" style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-semibold text-slate-800 dark:text-slate-100">{{ formatAmount(data.amount) }}</span>
              </template>
            </Column>

            <Column header="Status" style="min-width: 110px">
              <template #body="{ data }">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="data.status === 'success'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="data.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ data.status === 'success' ? 'Paid' : 'Failed' }}
                </span>
              </template>
            </Column>

            <Column header="Gateway Ref" style="min-width: 180px">
              <template #body="{ data }">
                <span class="font-mono text-xs text-slate-500 dark:text-slate-400 truncate block max-w-[160px]" :title="data.gatewayRef">
                  {{ data.gatewayRef || '—' }}
                </span>
              </template>
            </Column>

            <Column header="Date" style="min-width: 160px">
              <template #body="{ data }">
                <span class="text-slate-600 dark:text-slate-400 text-sm">{{ formatDate(data.createdAt) }}</span>
              </template>
            </Column>
          </DataTable>

          <!-- Pagination -->
          <div v-if="transactionStore.pagination.pages > 1" class="flex items-center justify-between px-2 pt-4 pb-2 gap-4">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, transactionStore.pagination.total) }}
              of {{ transactionStore.pagination.total }}
            </p>
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-chevron-left"
                severity="secondary"
                outlined
                :disabled="currentPage <= 1"
                class="rounded-xl w-9 h-9"
                @click="changePage(currentPage - 1)"
              />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ currentPage }} / {{ transactionStore.pagination.pages }}
              </span>
              <Button
                icon="pi pi-chevron-right"
                severity="secondary"
                outlined
                :disabled="currentPage >= transactionStore.pagination.pages"
                class="rounded-xl w-9 h-9"
                @click="changePage(currentPage + 1)"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTransactionStore } from '../stores/transactionStore'

const toast            = useToast()
const transactionStore = useTransactionStore()

const currentPage = ref(1)
const pageSize    = ref(20)

const filters = ref({
  type:   null,
  status: null,
  from:   '',
  to:     '',
})

const typeOptions = [
  { label: 'Subscription', value: 'subscription' },
  { label: 'SMS Credits',  value: 'sms_credits'  },
]

const statusOptions = [
  { label: 'Paid',   value: 'success' },
  { label: 'Failed', value: 'failed'  },
]

const buildQuery = () => ({
  ...(filters.value.type   && { type:   filters.value.type   }),
  ...(filters.value.status && { status: filters.value.status }),
  ...(filters.value.from   && { from:   filters.value.from   }),
  ...(filters.value.to     && { to:     filters.value.to     }),
  page:  currentPage.value,
  limit: pageSize.value,
})

const loadTransactions = async () => {
  const res = await transactionStore.fetchTransactions(buildQuery())
  if (!res.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: res.message, life: 3000 })
  }
}

const loadAll = async () => {
  await Promise.all([
    transactionStore.fetchSummary(),
    loadTransactions(),
  ])
}

const applyFilters = () => {
  currentPage.value = 1
  loadTransactions()
}

const changePage = (page) => {
  currentPage.value = page
  loadTransactions()
}

const formatAmount = (val) => {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val / 100)
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(loadAll)
</script>

<style scoped>
:deep(.tx-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
  vertical-align: middle;
}

:deep(.tx-table .p-datatable-tbody > tr > td) {
  background: transparent;
  color: #0f172a;
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.tx-table .p-datatable-tbody > tr:hover) {
  background: rgba(248, 250, 252, 0.8);
}

.dark :deep(.tx-table .p-datatable-thead > tr > th) {
  background: #0f172a;
  color: #cbd5e1;
  border-color: rgba(51, 65, 85, 0.9);
}

.dark :deep(.tx-table .p-datatable-tbody > tr > td) {
  color: #e2e8f0;
  border-color: rgba(51, 65, 85, 0.65);
}

.dark :deep(.tx-table .p-datatable-tbody > tr:hover) {
  background: rgba(30, 41, 59, 0.6);
}
</style>
