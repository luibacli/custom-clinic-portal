<template>
  <div class="flex flex-col h-full py-3">

    <!-- Compose button -->
    <div class="px-2 xl:px-3 mb-3">
      <button
        @click="$emit('compose')"
        class="w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-sky-600 hover:to-cyan-600 transition-all duration-200"
      >
        <i class="pi pi-pencil text-sm shrink-0"></i>
        <span class="hidden xl:inline">Compose</span>
      </button>
    </div>

    <!-- Nav folders -->
    <nav class="flex-1 px-1.5 xl:px-2 space-y-0.5 overflow-y-auto">
      <button
        v-for="item in folders"
        :key="item.key"
        @click="$emit('folder-change', item.key)"
        class="w-full flex items-center justify-center xl:justify-start gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="activeFolder === item.key
          ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'"
        :title="item.label"
      >
        <i :class="[item.icon, 'text-[15px] shrink-0']"></i>

        <span class="hidden xl:flex flex-1 items-center justify-between min-w-0 gap-1">
          <span class="truncate">{{ item.label }}</span>
          <span
            v-if="item.key === 'inbox' && unreadCount > 0"
            class="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-sky-500 text-white"
          >{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        </span>

        <!-- Collapsed unread dot -->
        <span
          v-if="item.key === 'inbox' && unreadCount > 0"
          class="xl:hidden absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-500 pointer-events-none"
        ></span>
      </button>
    </nav>

    <!-- Bottom divider + hint -->
    <div class="px-3 pt-3 mt-2 border-t border-slate-100 dark:border-white/10 hidden xl:block">
      <p class="text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed">
        Clinic notifications and portal updates arrive here.
      </p>
    </div>

  </div>
</template>

<script setup>
defineProps({
  activeFolder: { type: String, default: 'inbox' },
  unreadCount:  { type: Number, default: 0 },
})
defineEmits(['compose', 'folder-change'])

const folders = [
  { key: 'inbox',  label: 'Inbox',  icon: 'pi pi-inbox'    },
  { key: 'sent',   label: 'Sent',   icon: 'pi pi-send'     },
  { key: 'drafts', label: 'Drafts', icon: 'pi pi-file-edit' },
  { key: 'trash',  label: 'Trash',  icon: 'pi pi-trash'    },
]
</script>
