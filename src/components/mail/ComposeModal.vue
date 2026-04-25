<template>
  <Teleport to="body">
    <Transition name="compose-pop">
      <div
        v-if="visible"
        class="fixed bottom-5 right-5 z-[500] w-full max-w-[480px]"
        @click.stop
      >
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

          <!-- Header -->
          <div class="shrink-0 flex items-center justify-between px-4 py-3 bg-slate-900 dark:bg-slate-950">
            <p class="text-sm font-semibold text-white">New Message</p>
            <div class="flex items-center gap-0.5">
              <button
                @click="minimized = !minimized"
                class="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                :title="minimized ? 'Expand' : 'Minimize'"
              >
                <i :class="minimized ? 'pi pi-window-maximize' : 'pi pi-minus'" class="text-xs"></i>
              </button>
              <button
                @click="$emit('update:visible', false)"
                class="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Close"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Body (collapses when minimized) -->
          <Transition name="compose-body">
            <div v-if="!minimized" class="flex flex-col flex-1 min-h-0">

              <!-- Field rows -->
              <div class="shrink-0 divide-y divide-slate-100 dark:divide-white/10 border-b border-slate-100 dark:border-white/10">
                <div class="flex items-center px-4 py-2.5 gap-3">
                  <span class="text-xs font-medium text-slate-400 w-14 shrink-0">To</span>
                  <input
                    v-model="form.to"
                    type="email"
                    placeholder="recipient@email.com"
                    class="flex-1 text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div class="flex items-center px-4 py-2.5 gap-3">
                  <span class="text-xs font-medium text-slate-400 w-14 shrink-0">Subject</span>
                  <input
                    v-model="form.subject"
                    type="text"
                    placeholder="Email subject"
                    class="flex-1 text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Message body -->
              <textarea
                v-model="form.body"
                rows="10"
                placeholder="Write your message here..."
                class="flex-1 px-4 py-3 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none min-h-[160px]"
              ></textarea>

              <!-- Footer actions -->
              <div class="shrink-0 flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60">
                <div class="flex items-center gap-2">
                  <button
                    @click="handleSend"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <i class="pi pi-send text-xs"></i>
                    Send
                  </button>
                  <button
                    @click="handleDraft"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition"
                  >
                    <i class="pi pi-save text-xs"></i>
                    Save Draft
                  </button>
                </div>
                <button
                  @click="$emit('update:visible', false)"
                  class="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                  title="Discard"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>

            </div>
          </Transition>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'

defineProps({ visible: { type: Boolean, default: false } })
const emit = defineEmits(['update:visible', 'send', 'draft'])

const minimized = ref(false)
const form = reactive({ to: '', subject: '', body: '' })

const handleSend = () => {
  emit('send', { ...form })
  form.to      = ''
  form.subject = ''
  form.body    = ''
  emit('update:visible', false)
}

const handleDraft = () => {
  emit('draft', { ...form })
  emit('update:visible', false)
}
</script>

<style scoped>
.compose-pop-enter-active,
.compose-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.compose-pop-enter-from,
.compose-pop-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.compose-body-enter-active,
.compose-body-leave-active {
  transition: all 0.18s ease;
  overflow: hidden;
}
.compose-body-enter-from,
.compose-body-leave-to {
  opacity: 0;
  max-height: 0;
}
.compose-body-enter-to,
.compose-body-leave-from {
  max-height: 600px;
}
</style>
