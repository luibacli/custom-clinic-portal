<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 transition-colors duration-300">
    <Toast />

    <div class="max-w-7xl mx-auto space-y-5">

      <!-- Header -->
      <section class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="relative p-4 sm:p-6 lg:p-7">
          <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <p class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">Platform Inbox</p>
              <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Contact Submissions</h1>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Messages sent through the public Contact Us form.</p>
            </div>
            <div class="flex gap-2">
              <Button
                label="Refresh"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                class="rounded-2xl"
                :loading="loading"
                @click="load"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- KPI row -->
      <section class="grid grid-cols-2 gap-4">
        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Total Messages</p>
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-1">{{ pagination.total }}</h2>
            </div>
            <div class="shrink-0 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <i class="pi pi-inbox text-primary text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Unread</p>
              <h2 class="text-2xl font-bold mt-1" :class="unreadCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'">
                {{ unreadCount }}
              </h2>
            </div>
            <div class="shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center" :class="unreadCount > 0 ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-slate-100 dark:bg-slate-800'">
              <i class="pi pi-envelope text-xl" :class="unreadCount > 0 ? 'text-rose-500' : 'text-slate-400'"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Main content: list + viewer -->
      <section class="grid grid-cols-1 lg:grid-cols-5 gap-4">

        <!-- Submissions list -->
        <div class="lg:col-span-2 rounded-[24px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-hidden flex flex-col" style="max-height: 640px;">

          <!-- Filter bar -->
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              :class="filter === 'all' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
              @click="setFilter('all')"
            >All</button>
            <button
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              :class="filter === 'unread' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
              @click="setFilter('unread')"
            >Unread <span v-if="unreadCount > 0">({{ unreadCount }})</span></button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            <i class="pi pi-spin pi-spinner mr-2"></i> Loading…
          </div>

          <!-- Empty -->
          <div v-else-if="submissions.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500">
            <i class="pi pi-inbox text-4xl mb-3"></i>
            <p class="text-sm font-medium">No messages yet</p>
          </div>

          <!-- List -->
          <ul v-else class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            <li
              v-for="s in submissions"
              :key="s._id"
              class="p-4 cursor-pointer transition-colors"
              :class="[
                selected?._id === s._id
                  ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-primary'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
                !s.isRead ? 'font-semibold' : ''
              ]"
              @click="select(s)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <span v-if="!s.isRead" class="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
                    <p class="text-sm truncate text-slate-800 dark:text-white" :class="!s.isRead ? 'font-semibold' : 'font-medium'">
                      {{ s.subject }}
                    </p>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ s.name }} · {{ s.email }}</p>
                </div>
                <time class="text-xs text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">{{ formatDate(s.createdAt) }}</time>
              </div>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{{ s.message }}</p>
            </li>
          </ul>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              class="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              :disabled="page === 1"
              @click="changePage(page - 1)"
            >Prev</button>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ page }} / {{ pagination.pages }}</span>
            <button
              class="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              :disabled="page === pagination.pages"
              @click="changePage(page + 1)"
            >Next</button>
          </div>
        </div>

        <!-- Message viewer -->
        <div class="lg:col-span-3 rounded-[24px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col" style="max-height: 640px;">

          <!-- Empty state -->
          <div v-if="!selected" class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center">
            <i class="pi pi-envelope-open text-5xl mb-4 opacity-30"></i>
            <p class="text-sm font-medium">Select a message to read</p>
          </div>

          <!-- Viewer -->
          <div v-else class="flex flex-col flex-1 overflow-hidden">
            <!-- Header -->
            <div class="p-5 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h2 class="text-base font-bold text-slate-800 dark:text-white leading-snug">{{ selected.subject }}</h2>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ selected.name }}</span>
                    · <a :href="`mailto:${selected.email}`" class="text-primary hover:underline">{{ selected.email }}</a>
                  </p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ formatFull(selected.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span v-if="!selected.isRead" class="inline-flex items-center gap-1 text-xs font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full">
                    <i class="pi pi-circle-fill text-[6px]"></i> Unread
                  </span>
                  <span v-else class="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                    <i class="pi pi-check text-[10px]"></i> Read
                  </span>
                </div>
              </div>

              <!-- Reply shortcut -->
              <a
                :href="`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`"
                class="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                <i class="pi pi-reply"></i> Reply via email
              </a>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5">
              <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{{ selected.message }}</p>
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
import api from '../lib/axios'

const toast = useToast()

const submissions = ref([])
const selected    = ref(null)
const loading     = ref(false)
const unreadCount = ref(0)
const filter      = ref('all')
const page        = ref(1)
const pagination  = ref({ total: 0, pages: 1, page: 1, limit: 20 })

const load = async () => {
  loading.value = true
  try {
    const params = { page: page.value, limit: 20 }
    if (filter.value === 'unread') params.unread = 'true'
    const { data } = await api.get('/contact', { params })
    submissions.value  = data.data
    pagination.value   = data.pagination
    unreadCount.value  = data.unreadCount
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load submissions.', life: 3000 })
  } finally {
    loading.value = false
  }
}

const select = async (s) => {
  selected.value = s
  if (!s.isRead) {
    try {
      await api.patch(`/contact/${s._id}/read`)
      s.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch {
      // non-critical — viewer still shows the message
    }
  }
}

const setFilter = (f) => {
  filter.value = f
  page.value = 1
  selected.value = null
  load()
}

const changePage = (p) => {
  page.value = p
  selected.value = null
  load()
}

const formatDate = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

const formatFull = (iso) => new Date(iso).toLocaleString('en-PH', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit',
})

onMounted(load)
</script>
