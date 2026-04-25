<template>
  <div class="flex flex-col h-full">

    <!-- Empty state -->
    <div v-if="!message" class="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
      <div class="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
        <i class="pi pi-envelope-open text-3xl text-slate-300 dark:text-slate-600"></i>
      </div>
      <div>
        <h3 class="text-base font-semibold text-slate-500 dark:text-slate-400">No email selected</h3>
        <p class="mt-1.5 text-sm text-slate-400 dark:text-slate-600 max-w-xs">
          Choose a message from the list to read it here.
        </p>
      </div>
    </div>

    <!-- Email content -->
    <template v-else>

      <!-- Header bar -->
      <div class="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-white/10">

        <!-- Top row: back (mobile) + actions -->
        <div class="flex items-center justify-between mb-4">
          <button
            v-if="showBack"
            @click="$emit('back')"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition"
          >
            <i class="pi pi-arrow-left text-xs"></i>
            <span>Back</span>
          </button>
          <div v-else></div>

          <!-- Action buttons -->
          <div class="flex items-center gap-1">
            <button
              @click="$emit('reply')"
              title="Reply"
              class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
            >
              <i class="pi pi-reply text-xs"></i>
              <span class="hidden sm:inline">Reply</span>
            </button>
            <button
              @click="$emit('forward')"
              title="Forward"
              class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
            >
              <i class="pi pi-share-alt text-xs"></i>
              <span class="hidden sm:inline">Forward</span>
            </button>
            <button
              @click="$emit('delete')"
              title="Delete"
              class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
            >
              <i class="pi pi-trash text-xs"></i>
              <span class="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        <!-- Subject -->
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-words leading-snug">
          {{ message.subject || 'No Subject' }}
        </h2>

        <!-- Tags row -->
        <div class="mt-2.5 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="tagClass(message.type)">
            <i :class="[tagIcon(message.type), 'text-[10px]']"></i>
            {{ tagLabel(message.type) }}
          </span>
          <span
            v-if="message.transactionId"
            class="rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2.5 py-1 text-[11px] font-mono tracking-wide"
          >{{ message.transactionId }}</span>
        </div>

        <!-- Sender card -->
        <div class="mt-4 flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
            <i class="pi pi-user text-slate-400 dark:text-slate-500 text-sm"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {{ message.from || 'Unknown Sender' }}
            </p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ message.date }}</p>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
        <div class="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/3 px-5 py-5 shadow-inner">
          <div
            class="prose prose-sm max-w-none dark:prose-invert prose-p:mb-3 prose-strong:text-slate-800 dark:prose-strong:text-white break-words text-slate-700 dark:text-slate-200 leading-relaxed"
            v-html="sanitizedBody"
          ></div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  message:  { type: Object,  default: null  },
  showBack: { type: Boolean, default: false },
})
defineEmits(['back', 'reply', 'forward', 'delete'])

const sanitizedBody = computed(() => {
  const raw = props.message?.html || props.message?.preview || '<p>No message content available.</p>'
  return DOMPurify.sanitize(raw)
})

const tagClass = (type) => {
  if (type === 'philhealth') return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
  if (type === 'clinic')     return 'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300'
  return 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
}
const tagIcon = (type) => {
  if (type === 'philhealth') return 'pi pi-heart'
  if (type === 'clinic')     return 'pi pi-building'
  return 'pi pi-envelope'
}
const tagLabel = (type) => {
  if (type === 'philhealth') return 'PhilHealth'
  if (type === 'clinic')     return 'Clinic Message'
  return 'Notification'
}
</script>
