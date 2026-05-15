<template>
  <TenantSidebar :first-name="firstName" :last-name="lastName" :tenant-logo-url="tenantLogoUrl" />

  <!-- Suspension wall — full screen, replaces all content -->
  <div
    v-if="isHardBlocked"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 p-6"
  >
    <div class="max-w-md w-full text-center space-y-6">
      <div class="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
        <i class="pi pi-lock text-red-500 text-2xl"></i>
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">
          {{ suspensionTitle }}
        </h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {{ suspensionMessage }}
        </p>
      </div>
      <router-link
        v-if="isSuperAdmin"
        to="/billing"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
      >
        <i class="pi pi-credit-card text-sm"></i>
        Go to Billing
      </router-link>
      <p v-else-if="isAdmin" class="text-xs text-slate-400">Please contact your clinic owner to restore access.</p>
      <p v-else class="text-xs text-slate-400">Please contact your clinic administrator.</p>
    </div>
  </div>

  <div
    v-else
    class="transition-[padding] duration-300 ease-in-out min-h-screen
      bg-gradient-to-br from-white via-blue-50 to-blue-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-gray-200"
    :class="[
      'pt-14 lg:pt-0',
      collapsed ? 'lg:pl-16' : 'lg:pl-64'
    ]"
  >
    <QueueStickyBar v-if="isPatient" />

    <!-- Subscription warning banner -->
    <div
      v-if="subscriptionBanner && (isAdmin || isSuperAdmin)"
      :class="[
        'flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5 text-sm font-medium',
        subscriptionBanner.bg,
      ]"
    >
      <div class="flex items-center gap-2 min-w-0">
        <i :class="['shrink-0 text-base', subscriptionBanner.icon]"></i>
        <span class="min-w-0">{{ subscriptionBanner.message }}</span>
      </div>
      <router-link
        to="/billing"
        :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors', subscriptionBanner.btn]"
      >
        {{ subscriptionBanner.cta }}
      </router-link>
    </div>

    <main class="p-4">
      <slot />
      <router-view />
    </main>
    <AppFooter />
  </div>

  <QueueFloatingWidget v-if="isPatient && !isHardBlocked" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
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

const route           = useRoute();
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

// ─── Subscription state ───────────────────────────────────────────────────────
const sub = computed(() => tenant.value?.subscription || {});

const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const trialDaysLeft  = computed(() => daysUntil(sub.value.trialEndsAt));
const graceDaysLeft  = computed(() => daysUntil(sub.value.gracePeriodEnd));

// Hard block: suspended, cancelled, or past_due with grace expired
// Patients are never blocked — they have no control over the clinic's billing.
// Billing route is exempt so admins can actually pay and restore access.
const isHardBlocked = computed(() => {
  if (isPatient.value) return false;
  if (route.path === '/billing') return false;
  const status = sub.value.status;
  if (status === 'suspended' || status === 'cancelled') return true;
  if (status === 'past_due' && graceDaysLeft.value !== null && graceDaysLeft.value <= 0) return true;
  return false;
});

const suspensionTitle = computed(() => {
  if (sub.value.status === 'cancelled') return 'Subscription Cancelled';
  return 'Account Suspended';
});

const suspensionMessage = computed(() => {
  if (sub.value.status === 'cancelled') {
    return 'Your subscription has been cancelled. Please resubscribe to restore clinic access.';
  }
  return 'Your account has been suspended due to non-payment. Please settle your billing to restore access for your clinic.';
});

// Soft warning banner for trial-ending and past_due within grace
const subscriptionBanner = computed(() => {
  const status = sub.value.status;

  if (status === 'past_due') {
    const days = graceDaysLeft.value;
    const label = days === 1 ? '1 day' : days !== null ? `${days} days` : '';
    return {
      message: `Payment failed. Your grace period ends in ${label} — services will be suspended after that.`,
      icon:    'pi pi-exclamation-triangle text-red-500',
      bg:      'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-500/20',
      btn:     'bg-red-600 hover:bg-red-700 text-white',
      cta:     'Pay Now',
    };
  }

  if (status === 'trial' && trialDaysLeft.value !== null) {
    const days = trialDaysLeft.value;
    if (days <= 7 && days > 0) {
      return {
        message: `Your free trial expires in ${days} day${days !== 1 ? 's' : ''}. Subscribe to keep your clinic running.`,
        icon:    'pi pi-clock text-amber-500',
        bg:      'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-b border-amber-200 dark:border-amber-500/20',
        btn:     'bg-amber-500 hover:bg-amber-600 text-white',
        cta:     'View Plans',
      };
    }
    if (days <= 0) {
      return {
        message: 'Your trial has expired. Subscribe now to restore access.',
        icon:    'pi pi-exclamation-circle text-red-500',
        bg:      'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-500/20',
        btn:     'bg-red-600 hover:bg-red-700 text-white',
        cta:     'Subscribe Now',
      };
    }
  }

  return null;
});

// ─── Queue polling ─────────────────────────────────────────────────────────────
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
      await tenantStore.fetchTenant(tenantId);
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
