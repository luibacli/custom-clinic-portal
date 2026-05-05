<template>
  <TenantSidebar :first-name="firstName" :last-name="lastName" :tenant-logo-url="tenantLogoUrl" />

  <div
    class="transition-[padding] duration-300 ease-in-out min-h-screen
      bg-gradient-to-br from-white via-blue-50 to-blue-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-gray-200"
    :class="[
      'pt-14 lg:pt-0',
      collapsed ? 'lg:pl-16' : 'lg:pl-64'
    ]"
  >
    <QueueStickyBar v-if="isPatient" />
    <main class="p-4">
      <slot />
      <router-view />
    </main>
    <AppFooter />
  </div>

  <QueueFloatingWidget v-if="isPatient" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthTenantStore } from "../stores/authTenantStore";
import { useTenantStore } from "../stores/tenantStore";
import { useQueueStore } from "../stores/queueStore";
import { useAppointmentStore } from "../stores/appointmentStore";
import TenantSidebar from "../components/TenantSidebar.vue";
import AppFooter from "../components/AppFooter.vue";
import QueueStickyBar from "../components/QueueStickyBar.vue";
import QueueFloatingWidget from "../components/QueueFloatingWidget.vue";
import { useSidebarState } from "../composables/useSidebarState";
import { storeToRefs } from "pinia";

const authTenantStore = useAuthTenantStore();
const tenantStore     = useTenantStore();
const queueStore      = useQueueStore();
const apptStore       = useAppointmentStore();

const { fetchUserTenant } = authTenantStore;
const { isAdmin, isPatient, isSuperAdmin, isDev } = storeToRefs(authTenantStore);
const { tenant } = storeToRefs(tenantStore);
const { collapsed } = useSidebarState();

const firstName = ref("");
const lastName  = ref("");

const tenantLogoUrl = computed(() => tenant.value?.tenantLogo?.url || '');

let queueInterval = null;

async function syncQueue(tenantId) {
  await queueStore.poll(tenantId);
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

    const role     = result.data?.role;
    const tenantId = result.data?.tenantId;
    if (role !== 'dev' && tenantId) {
      await authTenantStore.fetchTenant(tenantId);
    }

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
