<template>
  <div class="flex flex-col h-full">

    <!-- Toolbar -->
    <div class="shrink-0 px-3 py-3 border-b border-slate-100 dark:border-white/10 space-y-2.5">
      <!-- Search -->
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Search emails..."
          class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 dark:focus:border-sky-500 transition"
        />
      </div>

      <!-- Filter chips -->
      <div class="flex gap-1.5">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="activeFilter = f.key"
          class="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all"
          :class="activeFilter === f.key
            ? 'bg-sky-500 text-white shadow-sm'
            : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15'"
        >
          {{ f.label }}
          <span
            v-if="f.key === 'unread' && unreadCount > 0"
            class="min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
            :class="activeFilter === 'unread' ? 'bg-white/25 text-white' : 'bg-slate-300 dark:bg-white/20 text-slate-600 dark:text-slate-300'"
          >{{ unreadCount }}</span>
        </button>
      </div>
    </div>

    <!-- Email list -->
    <div class="flex-1 overflow-y-auto">

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-14">
        <div class="flex flex-col items-center gap-3">
          <i class="pi pi-spin pi-spinner text-sky-400 text-xl"></i>
          <p class="text-xs text-slate-400">Loading emails…</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="flex flex-col items-center justify-center py-14 px-5 text-center gap-3">
        <div class="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
          <i class="pi pi-inbox text-slate-300 dark:text-slate-600 text-2xl"></i>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">No emails found</p>
          <p v-if="search" class="text-xs text-slate-400 mt-0.5">Try a different search term.</p>
        </div>
      </div>

      <!-- Email rows -->
      <button
        v-for="msg in filtered"
        :key="msg._id || msg.id"
        @click="$emit('select', msg)"
        class="group w-full text-left border-b border-slate-100 dark:border-white/5 transition-all duration-100 relative"
        :class="[
          selectedId === (msg._id || msg.id)
            ? 'bg-sky-50 dark:bg-sky-500/10'
            : 'hover:bg-slate-50 dark:hover:bg-white/5',
        ]"
      >
        <!-- Unread left bar -->
        <div
          class="absolute left-0 top-0 bottom-0 w-0.5 transition-all"
          :class="msg.isRead === false ? 'bg-sky-500' : 'bg-transparent'"
        ></div>

        <div class="flex items-start gap-3 px-4 py-3.5">
          <!-- Sender icon -->
          <div
            class="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center"
            :class="iconBg(msg.type)"
          >
            <i :class="[iconName(msg.type), 'text-sm']"></i>
          </div>

          <div class="min-w-0 flex-1">
            <!-- From + date row -->
            <div class="flex items-start justify-between gap-2">
              <p
                class="text-sm truncate"
                :class="msg.isRead === false
                  ? 'font-bold text-slate-900 dark:text-white'
                  : 'font-medium text-slate-500 dark:text-slate-400'"
              >{{ msg.from || 'Unknown Sender' }}</p>

              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{{ msg.date }}</span>
                <span
                  v-if="msg.isRead === false"
                  class="h-2 w-2 rounded-full bg-sky-500 shrink-0"
                ></span>
              </div>
            </div>

            <!-- Subject -->
            <p
              class="mt-0.5 text-xs truncate"
              :class="msg.isRead === false
                ? 'font-semibold text-slate-800 dark:text-slate-100'
                : 'font-normal text-slate-500 dark:text-slate-400'"
            >{{ msg.subject || 'No Subject' }}</p>

            <!-- Preview -->
            <p class="mt-0.5 text-[11px] text-slate-400 dark:text-slate-600 truncate leading-relaxed">
              {{ msg.preview || 'No preview available.' }}
            </p>
          </div>
        </div>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  messages:   { type: Array,  default: () => [] },
  selectedId: { type: String, default: null     },
  loading:    { type: Boolean, default: false   },
})
defineEmits(['select'])

const search       = ref('')
const activeFilter = ref('all')

const filters = [
  { key: 'all',    label: 'All'    },
  { key: 'unread', label: 'Unread' },
  { key: 'clinic', label: 'Clinic' },
]

const unreadCount = computed(() => props.messages.filter(m => m.isRead === false).length)

const filtered = computed(() => {
  const kw = search.value.trim().toLowerCase()
  return props.messages.filter(m => {
    const matchSearch =
      !kw ||
      m.subject?.toLowerCase().includes(kw) ||
      m.from?.toLowerCase().includes(kw) ||
      m.preview?.toLowerCase().includes(kw)

    const matchFilter =
      activeFilter.value === 'all' ||
      (activeFilter.value === 'unread' && m.isRead === false) ||
      (activeFilter.value === 'clinic' && m.type === 'clinic')

    return matchSearch && matchFilter
  })
})

const iconBg = (type) => {
  if (type === 'philhealth') return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
  if (type === 'clinic')     return 'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
  return 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
}
const iconName = (type) => {
  if (type === 'philhealth') return 'pi pi-heart'
  if (type === 'clinic')     return 'pi pi-building'
  return 'pi pi-envelope'
}
</script>
