<template>
  <!-- Loading -->
  <div
    v-if="loading"
    class="min-h-[60vh] w-full flex items-center justify-center text-slate-500 dark:text-slate-400"
  >
    <Loading />
  </div>

  <div
    v-else-if="tenantName"
    class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto space-y-5">
      <!-- Hero Header -->
      <section
        class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
      >
        <div
          class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        ></div>
        <div
          class="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-sky-300/20 blur-2xl dark:bg-sky-500/10"
        ></div>

        <div class="relative p-4 sm:p-6 lg:p-7">
          <div
            class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
          >
            <div class="flex items-start gap-4 min-w-0">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shrink-0"
              >
                <i class="pi pi-building text-xl sm:text-2xl"></i>
              </div>

              <div class="min-w-0">
                <p
                  class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]"
                >
                  Tenant Profile
                </p>

                <h1
                  class="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight break-words"
                >
                  {{ tenantName || "Health Facility Portal" }}
                </h1>

                <p
                  class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl"
                >
                  Overview of patient accounts, pending users, and active
                  administrators.
                </p>
              </div>
            </div>

            <div
              class="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm w-full xl:w-auto dark:border-slate-700 dark:bg-slate-900/80"
            >
              <p
                class="text-xs uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500"
              >
                Tenant ID
              </p>
              <p
                class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200 break-all"
              >
                {{ tenantId || "No Tenant ID" }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <!-- Active Patients -->
        <div
          class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Active Patients
              </p>
              <h2
                class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1"
              >
                {{ activePatients.length }}
              </h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Registered patient accounts under this tenant.
              </p>
            </div>

            <div
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 dark:bg-emerald-500/15 dark:text-emerald-300"
            >
              <i class="pi pi-user-plus text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Pending Users -->
        <div
          class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Pending Users
              </p>
              <h2
                class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1"
              >
                {{ emails.length }}
              </h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Incoming email-based accounts waiting for creation.
              </p>
            </div>

            <div
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 dark:bg-amber-500/15 dark:text-amber-300"
            >
              <i class="pi pi-clock text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Admins -->
        <div
          class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 sm:col-span-2 xl:col-span-1 dark:bg-slate-900 dark:border-slate-800"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">Admins</p>
              <h2
                class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1"
              >
                {{ activeAdmin.length }}
              </h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Active administrators managing this portal.
              </p>
            </div>

            <div
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 dark:bg-purple-500/15 dark:text-purple-300"
            >
              <i class="pi pi-address-book text-xl"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Today's Operations Row -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">Today's Appointments</p>
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ todayApptCount }}</h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Scheduled for today.</p>
            </div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 dark:bg-sky-500/15 dark:text-sky-300">
              <i class="pi pi-calendar text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">In Queue Now</p>
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ todayInQueueCount }}</h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Patients waiting in queue.</p>
            </div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 dark:bg-amber-500/15 dark:text-amber-300">
              <i class="pi pi-ticket text-xl"></i>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-slate-500 dark:text-slate-400">Completed Today</p>
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ todayCompletedCount }}</h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Appointments served today.</p>
            </div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 dark:bg-emerald-500/15 dark:text-emerald-300">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Activity Logs -->
      <section
        class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800"
      >
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Recent Activity</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Latest login and logout events from this portal.</p>
          </div>
        </div>

        <div v-if="logsLoading" class="flex h-40 items-center justify-center text-slate-400">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
        </div>

        <div v-else-if="!activityLogs.length" class="flex h-40 items-center justify-center">
          <p class="text-sm text-slate-400 dark:text-slate-500">No activity recorded yet.</p>
        </div>

        <ul v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <li
            v-for="log in activityLogs"
            :key="log._id"
            class="flex items-center gap-4 px-4 sm:px-5 py-3"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              :class="log.action === 'LOGIN'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'"
            >
              <i :class="log.action === 'LOGIN' ? 'pi pi-sign-in' : 'pi pi-sign-out'" class="text-sm"></i>
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-800 dark:text-white truncate">
                {{ log.userTenantId?.firstName || '—' }} {{ log.userTenantId?.lastName || '' }}
                <span class="font-normal text-slate-400 dark:text-slate-500">· {{ log.userTenantId?.email || '' }}</span>
              </p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {{ log.action }} · {{ formatLogTime(log.timestamp) }}
              </p>
            </div>

            <Tag
              :value="log.status"
              :severity="log.status === 'SUCCESS' ? 'success' : 'danger'"
              rounded
              class="shrink-0"
            />
          </li>
        </ul>
      </section>

      <!-- Users Table -->
      <section
        class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800"
      >
        <div
          class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800"
        >
          <div
            class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
          >
            <div>
              <h2
                class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white"
              >
                Users
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                List of registered users under this health facility portal.
              </p>
            </div>

            <div
              class="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2 w-full xl:w-auto dark:bg-slate-950 dark:border-slate-800"
            >
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Total Users: {{ tenants.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-2 sm:p-3">
          <DataTable
            :value="tenants"
            paginator
            :rows="10"
            stripedRows
            responsiveLayout="scroll"
            class="w-full tenant-table"
            size="small"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          >
            <template #empty>
              <div class="py-12 text-center">
                <div
                  class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 dark:bg-blue-500/15 dark:text-blue-300"
                >
                  <i class="pi pi-users text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                  No users found
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  User records will appear here once accounts are created.
                </p>
              </div>
            </template>

            <Column
              field="firstName"
              header="FIRST NAME"
              style="min-width: 12rem"
            >
              <template #body="slotProps">
                <span class="font-medium text-slate-800 dark:text-slate-100">
                  {{ slotProps.data.firstName || "—" }}
                </span>
              </template>
            </Column>

            <Column
              field="lastName"
              header="LAST NAME"
              style="min-width: 12rem"
            >
              <template #body="slotProps">
                <span class="font-medium text-slate-800 dark:text-slate-100">
                  {{ slotProps.data.lastName || "—" }}
                </span>
              </template>
            </Column>

            <Column field="email" header="EMAIL" style="min-width: 18rem">
              <template #body="slotProps">
                <span class="text-slate-700 dark:text-slate-300 break-all">
                  {{ slotProps.data.email || "—" }}
                </span>
              </template>
            </Column>

            <Column field="role" header="ROLE" style="min-width: 10rem">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.role || '—'"
                  :severity="slotProps.data.role === 'admin' ? 'success' : slotProps.data.role === 'superadmin' ? 'warn' : 'info'"
                  rounded
                />
              </template>
            </Column>

            <Column field="type" header="TYPE" style="min-width: 10rem">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.type || '—'"
                  severity="secondary"
                  rounded
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTenantStore } from "../stores/tenantStore";
import { useAuthTenantStore } from "../stores/authTenantStore";
import { useEmailStore } from "../stores/emailStore";
import { useAppointmentStore } from "../stores/appointmentStore";
import Loading from "../components/Loading.vue";
import { storeToRefs } from "pinia";
import Tag from "primevue/tag";

const tenantStore = useTenantStore();
const authTenantStore = useAuthTenantStore();
const emailStore = useEmailStore();
const appointmentStore = useAppointmentStore();

const { fetchTenant } = tenantStore;
const { fetchTenantUsers, fetchActivityLogs } = authTenantStore;
const { fetchLinksByTenant } = emailStore;
const { fetchAllAppointments } = appointmentStore;

const { emails } = storeToRefs(emailStore);

const tenantId = ref(null);
const tenantName = ref("");
const tenants = ref([]);
const loading = ref(false);
const logsLoading = ref(false);
const activePatients = ref([]);
const activeAdmin = ref([]);
const activityLogs = ref([]);
const todayApptCount = ref(0);
const todayInQueueCount = ref(0);
const todayCompletedCount = ref(0);

const formatLogTime = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-PH', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

onMounted(async () => {
  loading.value = true;
  try {
    tenantId.value = localStorage.getItem("tenantId");

    if (!tenantId.value) {
      console.error("No Tenant ID Found");
      return;
    }

    logsLoading.value = true;

    const todayStr = new Date().toISOString().split('T')[0];
    const [res, users] = await Promise.all([
      fetchTenant(tenantId.value),
      fetchTenantUsers(tenantId.value),
      fetchLinksByTenant(tenantId.value),
      fetchAllAppointments(tenantId.value, { date: todayStr, limit: 100 }).then(result => {
        if (result.success) {
          const appts = appointmentStore.allAppointments;
          todayApptCount.value = appts.length;
          todayInQueueCount.value = appts.filter(a => a.status === 'in-queue').length;
          todayCompletedCount.value = appts.filter(a => a.status === 'completed').length;
        }
      }),
    ]);

    if (res?.data) {
      tenantName.value = res.data.name;
    }

    if (users?.success) {
      tenants.value = users.data || [];
    }

    activePatients.value = tenants.value.filter((i) => i.role === "patient");
    activeAdmin.value = tenants.value.filter(
      (i) => i.role === "admin" || i.role === "superadmin"
    );

    const logs = await fetchActivityLogs(tenantId.value, 15);
    activityLogs.value = logs?.data || [];
    logsLoading.value = false;
  } catch (error) {
    console.error({ error: error.message });
    logsLoading.value = false;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
:deep(.tenant-table .p-datatable-table) {
  min-width: 900px;
}

:deep(.tenant-table .p-datatable-header) {
  background: transparent;
  border: none;
}

:deep(.tenant-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
  vertical-align: middle;
}

:deep(.tenant-table .p-datatable-tbody > tr > td) {
  background: transparent;
  color: #0f172a;
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.tenant-table .p-datatable-tbody > tr:hover) {
  background: rgba(248, 250, 252, 0.8);
}

:deep(.tenant-table .p-paginator) {
  border: none;
  background: transparent;
  padding-top: 1rem;
  padding-bottom: 0.25rem;
}

:deep(.tenant-table .p-paginator .p-paginator-page),
:deep(.tenant-table .p-paginator .p-paginator-prev),
:deep(.tenant-table .p-paginator .p-paginator-next) {
  color: #475569;
}

:deep(.tenant-table .p-paginator .p-paginator-page.p-highlight) {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border-radius: 9999px;
}

:deep(.p-tag) {
  font-size: 0.72rem;
}

/* Only apply dark mode when your app/root has .dark */
.dark :deep(.tenant-table .p-datatable-thead > tr > th) {
  background: #0f172a;
  color: #cbd5e1;
  border-color: rgba(51, 65, 85, 0.9);
}

.dark :deep(.tenant-table .p-datatable-tbody > tr > td) {
  color: #e2e8f0;
  border-color: rgba(51, 65, 85, 0.65);
}

.dark :deep(.tenant-table .p-datatable-tbody > tr:hover) {
  background: rgba(30, 41, 59, 0.6);
}

.dark :deep(.tenant-table .p-paginator .p-paginator-page),
.dark :deep(.tenant-table .p-paginator .p-paginator-prev),
.dark :deep(.tenant-table .p-paginator .p-paginator-next) {
  color: #cbd5e1;
}

.dark :deep(.tenant-table .p-paginator .p-paginator-page.p-highlight) {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

@media (max-width: 640px) {
  :deep(.tenant-table .p-datatable-wrapper) {
    border-radius: 1rem;
  }
}
</style>