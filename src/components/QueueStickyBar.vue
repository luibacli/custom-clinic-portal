<template>
  <Transition name="queue-bar">
    <div
      v-if="queueStore.hasActiveQueue"
      class="w-full px-4 py-2 flex items-center justify-between gap-3 text-sm font-medium border-b z-40 transition-colors duration-500"
      :class="barClass"
    >
      <!-- Left: now serving -->
      <div class="flex items-center gap-2 min-w-0">
        <i class="pi pi-ticket text-base shrink-0"></i>
        <span class="shrink-0">Now Serving:</span>
        <span class="text-lg font-bold leading-none">
          {{ queueStore.nowServing != null ? `#${queueStore.nowServing}` : '—' }}
        </span>
      </div>

      <!-- Center: your number -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="opacity-70">Your #:</span>
        <span class="font-bold">
          {{ queueStore.myQueueNumber != null ? `#${queueStore.myQueueNumber}` : '—' }}
        </span>
      </div>

      <!-- Right: status pill -->
      <div class="shrink-0">
        <span
          v-if="queueStore.isMyTurn"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/30 font-bold animate-pulse"
        >
          <i class="pi pi-check-circle"></i> It's your turn!
        </span>
        <span
          v-else-if="queueStore.isAlmostTurn"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/30"
        >
          <i class="pi pi-clock"></i>
          {{ queueStore.peopleAhead === 0 ? 'You\'re next!' : `${queueStore.peopleAhead} ahead` }}
        </span>
        <span v-else-if="queueStore.peopleAhead != null" class="opacity-80 text-xs">
          {{ queueStore.peopleAhead }} ahead
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useQueueStore } from '../stores/queueStore';

const queueStore = useQueueStore();

const barClass = computed(() => {
  if (queueStore.isMyTurn) {
    return 'bg-emerald-500 text-white border-emerald-600';
  }
  if (queueStore.isAlmostTurn) {
    return 'bg-amber-400 text-amber-900 border-amber-500';
  }
  return 'bg-sky-500 text-white border-sky-600';
});
</script>

<style scoped>
.queue-bar-enter-active,
.queue-bar-leave-active {
  transition: all 0.25s ease;
}
.queue-bar-enter-from,
.queue-bar-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
