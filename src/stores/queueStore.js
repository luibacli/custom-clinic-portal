import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '../lib/axios';

export const useQueueStore = defineStore('queue', () => {
  const nowServing   = ref(null);   // queue number currently being served (ongoing appt)
  const inQueueCount = ref(0);      // count of in-queue appointments
  const myQueueNumber = ref(null);  // patient's own queue number
  const myStatus      = ref('');    // patient's appointment status

  // How many people are ahead: people serving lower numbers that haven't been called yet.
  // Simple approximation: if my number is assigned and nowServing is known, gap = my# - nowServing - 1
  const peopleAhead = computed(() => {
    if (myQueueNumber.value == null || nowServing.value == null) return null;
    const ahead = myQueueNumber.value - nowServing.value - 1;
    return Math.max(0, ahead);
  });

  const isMyTurn     = computed(() => myStatus.value === 'ongoing');
  const isAlmostTurn = computed(() => {
    if (isMyTurn.value) return false;
    if (myStatus.value !== 'in-queue') return false;
    return peopleAhead.value !== null && peopleAhead.value <= 2;
  });

  const hasActiveQueue = computed(() =>
    myStatus.value === 'in-queue' || myStatus.value === 'ongoing'
  );

  async function poll(tenantId) {
    if (!tenantId) return;
    try {
      const { data } = await api.get(`/appointments/${tenantId}/queue`);
      if (data?.success) {
        nowServing.value   = data.data.nowServing;
        inQueueCount.value = data.data.inQueueCount;
      }
    } catch {
      // silent — polling should never throw to callers
    }
  }

  function setMyQueue(queueNumber, status) {
    myQueueNumber.value = queueNumber ?? null;
    myStatus.value      = status || '';
  }

  function clear() {
    nowServing.value    = null;
    inQueueCount.value  = 0;
    myQueueNumber.value = null;
    myStatus.value      = '';
  }

  return {
    nowServing, inQueueCount, myQueueNumber, myStatus,
    peopleAhead, isMyTurn, isAlmostTurn, hasActiveQueue,
    poll, setMyQueue, clear,
  };
});
