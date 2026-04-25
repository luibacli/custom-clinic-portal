<template>
  <Transition name="widget-pop">
    <div
      v-if="queueStore.hasActiveQueue"
      class="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2"
    >
      <!-- Expanded card -->
      <Transition name="card-slide">
        <div
          v-if="expanded"
          class="mb-1 w-64 rounded-2xl shadow-2xl border overflow-hidden"
          :class="cardClass"
        >
          <!-- Card header -->
          <div class="px-4 py-3 flex items-center justify-between border-b border-white/20">
            <div class="flex items-center gap-2">
              <i class="pi pi-ticket text-base"></i>
              <span class="font-bold text-sm">Queue Status</span>
            </div>
            <button @click="expanded = false" class="opacity-70 hover:opacity-100 transition-opacity">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Card body -->
          <div class="px-4 py-4 space-y-3">
            <!-- Now serving -->
            <div class="flex items-center justify-between">
              <span class="text-xs opacity-70 uppercase tracking-wide">Now Serving</span>
              <span class="text-2xl font-black leading-none">
                {{ queueStore.nowServing != null ? `#${queueStore.nowServing}` : '—' }}
              </span>
            </div>

            <div class="border-t border-white/20"></div>

            <!-- My number -->
            <div class="flex items-center justify-between">
              <span class="text-xs opacity-70 uppercase tracking-wide">Your Number</span>
              <span class="text-2xl font-black leading-none">
                {{ queueStore.myQueueNumber != null ? `#${queueStore.myQueueNumber}` : '—' }}
              </span>
            </div>

            <div class="border-t border-white/20"></div>

            <!-- Status row -->
            <div class="flex items-center justify-between">
              <span class="text-xs opacity-70 uppercase tracking-wide">Ahead of you</span>
              <span class="font-bold">
                <template v-if="queueStore.isMyTurn">
                  <span class="animate-pulse">Your turn!</span>
                </template>
                <template v-else-if="queueStore.peopleAhead != null">
                  {{ queueStore.peopleAhead === 0 ? "You're next!" : `${queueStore.peopleAhead} people` }}
                </template>
                <template v-else>—</template>
              </span>
            </div>

            <!-- In-queue total -->
            <p class="text-[11px] text-center opacity-60 pt-1">
              {{ queueStore.inQueueCount }} patient{{ queueStore.inQueueCount !== 1 ? 's' : '' }} waiting
            </p>
          </div>
        </div>
      </Transition>

      <!-- Floating pill button -->
      <button
        @click="expanded = !expanded"
        class="flex items-center gap-2 rounded-full shadow-xl px-4 py-2.5 font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        :class="pillClass"
        :title="expanded ? 'Collapse queue info' : 'View queue status'"
      >
        <i class="pi pi-ticket text-base"></i>
        <span v-if="queueStore.isMyTurn" class="animate-pulse">Your turn!</span>
        <span v-else-if="queueStore.myQueueNumber != null">#{{ queueStore.myQueueNumber }}</span>
        <span v-else>Queue</span>
        <span
          v-if="!expanded && queueStore.nowServing != null"
          class="text-[10px] opacity-75 font-normal hidden sm:inline"
        >
          · Serving #{{ queueStore.nowServing }}
        </span>
        <i class="pi text-xs opacity-70" :class="expanded ? 'pi-chevron-down' : 'pi-chevron-up'"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQueueStore } from '../stores/queueStore';

const queueStore = useQueueStore();
const expanded = ref(false);

const pillClass = computed(() => {
  if (queueStore.isMyTurn)     return 'bg-emerald-500 text-white ring-4 ring-emerald-300/50';
  if (queueStore.isAlmostTurn) return 'bg-amber-400 text-amber-900';
  return 'bg-sky-500 text-white';
});

const cardClass = computed(() => {
  if (queueStore.isMyTurn)     return 'bg-emerald-500 text-white border-emerald-600';
  if (queueStore.isAlmostTurn) return 'bg-amber-400 text-amber-900 border-amber-500';
  return 'bg-sky-500 text-white border-sky-600';
});
</script>

<style scoped>
.widget-pop-enter-active,
.widget-pop-leave-active {
  transition: all 0.2s ease;
}
.widget-pop-enter-from,
.widget-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: all 0.2s ease;
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
