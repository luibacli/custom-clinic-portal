<template>
  <div class="px-4 py-6 sm:px-6 max-w-6xl mx-auto space-y-6">
    <Toast />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Last 30 days · refreshes on load</p>
      </div>
      <button
        @click="loadAnalytics"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
      >
        <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-xs"></i>
        Refresh
      </button>
    </div>

    <!-- Summary KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" :class="kpi.iconBg">
            <i :class="kpi.icon" class="text-sm" :style="{ color: kpi.iconColor }"></i>
          </div>
          <span v-if="kpi.trend !== null"
            class="text-xs font-bold px-2 py-0.5 rounded-full"
            :class="kpi.trend >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'"
          >
            {{ kpi.trend >= 0 ? '+' : '' }}{{ kpi.trend }}%
          </span>
        </div>
        <p class="text-2xl font-black text-slate-900 dark:text-white">{{ kpi.value }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ kpi.label }}</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="n in 4" :key="n" class="h-64 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
    </div>

    <template v-else>
      <!-- Appointments over time -->
      <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
        <p class="text-sm font-semibold text-slate-800 dark:text-white mb-4">Appointments — Last 30 Days</p>
        <Chart type="bar" :data="appointmentsByDayChart" :options="barOptions" class="h-56" />
      </div>

      <!-- Bottom row: status breakdown + top services -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Status donut -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-800 dark:text-white mb-4">Appointments by Status</p>
          <div v-if="statusChart.labels.length" class="flex flex-col sm:flex-row items-center gap-4">
            <Chart type="doughnut" :data="statusChart" :options="donutOptions" class="h-44 w-44 shrink-0" />
            <ul class="space-y-2 flex-1 min-w-0">
              <li v-for="(label, i) in statusChart.labels" :key="label"
                class="flex items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="h-2.5 w-2.5 rounded-full shrink-0" :style="{ background: statusChart.datasets[0].backgroundColor[i] }"></span>
                  <span class="text-slate-600 dark:text-slate-300 capitalize truncate">{{ label }}</span>
                </div>
                <span class="font-semibold text-slate-800 dark:text-white shrink-0">{{ statusChart.datasets[0].data[i] }}</span>
              </li>
            </ul>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-44 text-slate-300 dark:text-slate-600">
            <i class="pi pi-chart-pie text-3xl mb-2"></i>
            <p class="text-xs">No data yet</p>
          </div>
        </div>

        <!-- Top services -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-800 dark:text-white mb-4">Top Services</p>
          <div v-if="topServices.length" class="space-y-3">
            <div v-for="(s, i) in topServices" :key="s.service" class="space-y-1">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-xs font-bold text-slate-400 w-4 shrink-0">{{ i + 1 }}</span>
                  <span class="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{{ s.service }}</span>
                </div>
                <span class="text-xs font-semibold text-slate-800 dark:text-white shrink-0">{{ s.count }}</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                  :style="{ width: `${Math.round((s.count / topServices[0].count) * 100)}%` }">
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-44 text-slate-300 dark:text-slate-600">
            <i class="pi pi-list text-3xl mb-2"></i>
            <p class="text-xs">No data yet</p>
          </div>
        </div>
      </div>

      <!-- Patient growth -->
      <div v-if="patientGrowthChart.labels.length" class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
        <p class="text-sm font-semibold text-slate-800 dark:text-white mb-4">New Patients — Last 8 Weeks</p>
        <Chart type="line" :data="patientGrowthChart" :options="lineOptions" class="h-48" />
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Chart from 'primevue/chart'
import api from '../lib/axios'

const toast = useToast()
const loading = ref(true)
const tenantId = localStorage.getItem('tenantId') || ''

const analytics = ref({
  appointmentsByDay: [],
  byStatus: [],
  topServices: [],
  summary: { thisMonth: 0, lastMonth: 0, trend: null },
  patientGrowth: [],
})

const STATUS_COLORS = {
  pending:   '#f59e0b',
  confirmed: '#3b82f6',
  'in-queue':'#f97316',
  ongoing:   '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
}

const kpis = computed(() => [
  {
    label: 'This Month',
    value: analytics.value.summary.thisMonth,
    trend: analytics.value.summary.trend,
    icon: 'pi pi-calendar',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconColor: '#3b82f6',
  },
  {
    label: 'Last Month',
    value: analytics.value.summary.lastMonth,
    trend: null,
    icon: 'pi pi-calendar-minus',
    iconBg: 'bg-slate-100 dark:bg-white/10',
    iconColor: '#64748b',
  },
  {
    label: 'Top Service',
    value: analytics.value.topServices[0]?.service?.split(' ')[0] || '—',
    trend: null,
    icon: 'pi pi-star',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconColor: '#f59e0b',
  },
  {
    label: 'Completed',
    value: analytics.value.byStatus.find(s => s.status === 'completed')?.count || 0,
    trend: null,
    icon: 'pi pi-check-circle',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: '#10b981',
  },
])

const topServices = computed(() => analytics.value.topServices)

const appointmentsByDayChart = computed(() => ({
  labels: analytics.value.appointmentsByDay.map(d => {
    const dt = new Date(d.date)
    return dt.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  }),
  datasets: [{
    label: 'Appointments',
    data: analytics.value.appointmentsByDay.map(d => d.count),
    backgroundColor: 'rgba(14,165,233,0.15)',
    borderColor: '#0ea5e9',
    borderWidth: 2,
    borderRadius: 6,
  }],
}))

const statusChart = computed(() => {
  const s = analytics.value.byStatus
  return {
    labels: s.map(x => x.status),
    datasets: [{
      data: s.map(x => x.count),
      backgroundColor: s.map(x => STATUS_COLORS[x.status] || '#94a3b8'),
      borderWidth: 0,
    }],
  }
})

const patientGrowthChart = computed(() => ({
  labels: analytics.value.patientGrowth.map(w => `Wk ${w.week?.split('-W')[1] || w.week}`),
  datasets: [{
    label: 'New Patients',
    data: analytics.value.patientGrowth.map(w => w.count),
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.1)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#6366f1',
  }],
}))

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

const barOptions = {
  ...baseChartOptions,
  scales: {
    x: { grid: { display: false }, ticks: { maxTicksLimit: 10, font: { size: 10 } } },
    y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { font: { size: 10 } }, beginAtZero: true },
  },
}

const lineOptions = {
  ...baseChartOptions,
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { font: { size: 10 } }, beginAtZero: true },
  },
}

const donutOptions = {
  ...baseChartOptions,
  cutout: '72%',
}

const loadAnalytics = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/analytics/${tenantId}`)
    if (data.success) analytics.value = data.data
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load analytics', life: 4000 })
  } finally {
    loading.value = false
  }
}

onMounted(loadAnalytics)
</script>
