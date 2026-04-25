<template>
  <div class="flex flex-col min-h-screen
           bg-gradient-to-br from-white via-blue-50 to-blue-200
           dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
           dark:text-gray-200">
    <TenantNavBar :first-name="firstName" :last-name="lastName" :is-admin="isAdmin" :is-super-admin="isSuperAdmin" :is-patient="isPatient" :is-dev="isDev" :tenant-logo-url="tenantLogoUrl"/>

    <!-- Queue sticky bar — only rendered for patients with an active queue slot -->
    <QueueStickyBar v-if="isPatient" />

    <main class="flex-1 p-4">
      <slot />
      <router-view />
    </main>
  </div>

  <!-- Floating queue widget — patients only -->
  <QueueFloatingWidget v-if="isPatient" />

  <AppFooter />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthTenantStore } from "../stores/authTenantStore";
import { useTenantStore } from "../stores/tenantStore";
import { useQueueStore } from "../stores/queueStore";
import { useAppointmentStore } from "../stores/appointmentStore";
import TenantNavBar from "../components/TenantNavBar.vue";
import AppFooter from "../components/AppFooter.vue";
import QueueStickyBar from "../components/QueueStickyBar.vue";
import QueueFloatingWidget from "../components/QueueFloatingWidget.vue";
import { storeToRefs } from "pinia";

const authTenantStore = useAuthTenantStore();
const tenantStore = useTenantStore();
const queueStore = useQueueStore();
const apptStore = useAppointmentStore();

const { fetchUserTenant } = authTenantStore;
const { isAdmin, isPatient, isSuperAdmin, isDev } = storeToRefs(authTenantStore);
const { tenant } = storeToRefs(tenantStore);

const firstName = ref("");
const lastName  = ref("");

const tenantLogoUrl = computed(() => tenant.value?.tenantLogo?.url || '');

let queueInterval = null;

async function syncQueue(tenantId) {
  await queueStore.poll(tenantId);

  // Sync patient's own queue slot from appointmentStore
  const active = apptStore.myAppointments?.find(
    a => a.status === 'in-queue' || a.status === 'ongoing'
  );
  queueStore.setMyQueue(active?.queueNumber ?? null, active?.status ?? '');
}

onMounted(async () => {
  try {
    const result = await fetchUserTenant();
    firstName.value = result.data?.firstName || '';
    lastName.value  = result.data?.lastName  || '';

    if (isPatient.value) {
      const tenantId = localStorage.getItem('tenantId');
      if (tenantId) {
        await apptStore.fetchMyAppointments();
        await syncQueue(tenantId);
        queueInterval = setInterval(() => syncQueue(tenantId), 15000);
      }
    }
  } catch (error) {
    console.error({ error: error.message });
  }
});

onUnmounted(() => {
  if (queueInterval) clearInterval(queueInterval);
  queueStore.clear();
});
</script>
