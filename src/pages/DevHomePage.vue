<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 transition-colors duration-300"
  >
    <Toast />

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="h-[60vh] w-full flex items-center justify-center text-slate-500 dark:text-slate-400"
    >
      <Loading />
    </div>

    <template v-else>
      <div class="max-w-7xl mx-auto space-y-5">
        <!-- Hero Header -->
        <section
          class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
        >
          <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          <div class="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-sky-200/30 blur-2xl dark:bg-sky-500/10"></div>

          <div class="relative p-4 sm:p-6 lg:p-7">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div class="max-w-2xl">
                <p class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">
                  Portal Admin
                </p>
                <h1 class="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
                  Tenants Management
                </h1>
                <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                  Manage facility portals, domain setup, and tenant activation in one place.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                <Button
                  label="Refresh"
                  icon="pi pi-refresh"
                  severity="secondary"
                  outlined
                  class="rounded-2xl w-full sm:w-auto"
                  @click="handleRefresh"
                />
                <Button
                  label="Create Tenant"
                  icon="pi pi-plus"
                  class="rounded-2xl w-full sm:w-auto"
                  @click="openCreateDialog"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- KPI Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-500 dark:text-slate-400">Total Tenants</p>
                <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {{ tenants.length }}
                </h2>
              </div>
              <div class="shrink-0 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center dark:bg-primary/15">
                <i class="pi pi-building text-primary text-xl"></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-500 dark:text-slate-400">Active</p>
                <h2 class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {{ activeCount }}
                </h2>
              </div>
              <div class="shrink-0 h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center dark:bg-green-500/15">
                <i class="pi pi-check-circle text-green-600 dark:text-green-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-500 dark:text-slate-400">Inactive</p>
                <h2 class="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {{ inactiveCount }}
                </h2>
              </div>
              <div class="shrink-0 h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center dark:bg-amber-500/15">
                <i class="pi pi-times-circle text-amber-600 dark:text-amber-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-500 dark:text-slate-400">On Trial</p>
                <h2 class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {{ onTrialCount }}
                </h2>
              </div>
              <div class="shrink-0 h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center dark:bg-blue-500/15">
                <i class="pi pi-clock text-blue-600 dark:text-blue-300 text-xl"></i>
              </div>
            </div>
          </div>
        </section>

        <!-- Table Section -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
                  Tenant Directory
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  View and manage all registered tenant portals.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),220px] gap-2 w-full xl:max-w-[620px]">
                <IconField iconPosition="left" class="w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="search"
                    placeholder="Search tenant, domain, status..."
                    class="w-full rounded-2xl"
                  />
                </IconField>

                <Select
                  v-model="selectedStatus"
                  :options="statusFilterOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Filter Status"
                  class="w-full"
                  showClear
                />
              </div>
            </div>
          </div>

          <div class="p-2 sm:p-3">
            <DataTable
              :value="filteredTenants"
              paginator
              :rows="10"
              dataKey="_id"
              responsiveLayout="scroll"
              class="p-datatable-sm tenant-table"
              :rowHover="true"
              paginatorTemplate="PrevPageLink PageLinks NextPageLink"
              @row-click="handleRowClick"
            >
              <template #empty>
                <div class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <i class="pi pi-building text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                    No tenants found
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Try adjusting your search or status filter.
                  </p>
                </div>
              </template>

              <Column header="Tenant" style="min-width: 280px">
                <template #body="{ data }">
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="h-12 w-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <img
                        v-if="data?.tenantLogo?.url"
                        :src="data.tenantLogo.url"
                        alt="Tenant Logo"
                        class="h-full w-full object-cover"
                      />
                      <i v-else class="pi pi-building text-slate-400 dark:text-slate-500 text-lg"></i>
                    </div>

                    <div class="min-w-0">
                      <p class="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {{ data.name || 'No Name' }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {{ data.domain || 'No Domain' }}
                      </p>
                    </div>
                  </div>
                </template>
              </Column>

              <Column header="Plan" style="min-width: 130px">
                <template #body="{ data }">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold capitalize"
                    :class="{
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300': data.subscription?.plan === 'starter' || !data.subscription?.plan,
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300': data.subscription?.plan === 'growth',
                      'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300': data.subscription?.plan === 'premium',
                    }"
                  >
                    <i class="pi text-[10px]"
                      :class="{
                        'pi-box': data.subscription?.plan === 'starter' || !data.subscription?.plan,
                        'pi-bolt': data.subscription?.plan === 'growth',
                        'pi-star-fill': data.subscription?.plan === 'premium',
                      }"
                    ></i>
                    {{ data.subscription?.plan || 'starter' }}
                  </span>
                </template>
              </Column>

              <Column header="Sub Status" style="min-width: 130px">
                <template #body="{ data }">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold capitalize"
                    :class="{
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300': data.subscription?.status === 'active',
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300': data.subscription?.status === 'trial',
                      'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300': data.subscription?.status === 'past_due',
                      'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300': data.subscription?.status === 'suspended' || data.subscription?.status === 'cancelled',
                    }"
                  >
                    <span class="h-1.5 w-1.5 rounded-full shrink-0"
                      :class="{
                        'bg-emerald-500': data.subscription?.status === 'active',
                        'bg-blue-500': data.subscription?.status === 'trial',
                        'bg-amber-500': data.subscription?.status === 'past_due',
                        'bg-red-500': data.subscription?.status === 'suspended' || data.subscription?.status === 'cancelled',
                      }"
                    ></span>
                    {{ (data.subscription?.status || 'trial').replace('_', ' ') }}
                  </span>
                </template>
              </Column>

              <Column header="Created" style="min-width: 170px">
                <template #body="{ data }">
                  <span class="text-slate-600 dark:text-slate-400">
                    {{ formatDate(data.createdAt) }}
                  </span>
                </template>
              </Column>

              <Column header="Actions" style="min-width: 200px">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <Button
                      icon="pi pi-arrow-right"
                      label="Manage"
                      size="small"
                      class="rounded-xl whitespace-nowrap"
                      @click.stop="router.push(`/tenant/${data._id}`)"
                    />
                    <Button
                      icon="pi pi-pencil"
                      size="small"
                      outlined
                      severity="secondary"
                      class="rounded-xl"
                      v-tooltip.top="'Edit'"
                      @click.stop="openEditDialog(data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </section>
      </div>
    </template>

    <!-- Create / Edit Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="isEditMode ? 'Edit Tenant' : 'Create Tenant'"
      :style="{ width: '95vw', maxWidth: '680px' }"
      class="rounded-3xl tenant-dialog"
    >
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Tenant Name</label>
            <InputText
              v-model="tenantForm.name"
              placeholder="Enter tenant name"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Domain</label>
            <InputText
              v-model="tenantForm.domain"
              placeholder="example.com"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <Select
              v-model="tenantForm.status"
              :options="statusOption"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Plan</label>
            <Select
              v-model="createPlan"
              :options="planOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select plan"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Subscription Status</label>
            <Select
              v-model="createSubStatus"
              :options="subStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select subscription status"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Logo URL</label>
            <InputText
              v-model="tenantForm.tenantLogo.url"
              placeholder="https://..."
              class="w-full rounded-2xl"
            />
          </div>
        </div>

        <div
          class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 flex items-center gap-3 dark:border-slate-700 dark:bg-slate-950"
        >
          <div
            class="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0 dark:border-slate-700 dark:bg-slate-900"
          >
            <img
              v-if="tenantForm?.tenantLogo?.url"
              :src="tenantForm.tenantLogo.url"
              alt="Logo Preview"
              class="h-full w-full object-cover"
            />
            <i v-else class="pi pi-image text-slate-400 dark:text-slate-500 text-xl"></i>
          </div>

          <div class="min-w-0">
            <p class="font-medium text-slate-700 dark:text-slate-200">Logo Preview</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 break-all">
              Paste a valid logo URL to preview the tenant logo.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            class="rounded-2xl w-full sm:w-auto"
            @click="closeDialog"
          />
          <Button
            :label="isSubmitting ? 'Saving...' : isEditMode ? 'Update Tenant' : 'Create Tenant'"
            :icon="isEditMode ? 'pi pi-check' : 'pi pi-plus'"
            :loading="isSubmitting"
            class="rounded-2xl w-full sm:w-auto"
            @click="handleSubmit"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useTenantStore } from '../stores/tenantStore';
import Loading from '../components/Loading.vue';

const toast = useToast();
const tenantStore = useTenantStore();
const router = useRouter();

const {
  tenants,
  tenantForm,
  dialogVisible,
  isLoading,
  statusOption
} = storeToRefs(tenantStore);

const {
  fetchTenants,
  createTenant,
  updateTenant,
  resetTenantForm
} = tenantStore;

const search = ref('');
const selectedStatus = ref(null);
const isSubmitting = ref(false);
const isEditMode = ref(false);
const createPlan = ref('starter');
const createSubStatus = ref('trial');

const statusFilterOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const planOptions = [
  { label: 'Starter',  value: 'starter'  },
  { label: 'Growth',   value: 'growth'   },
  { label: 'Premium',  value: 'premium'  },
];

const subStatusOptions = [
  { label: 'Trial',     value: 'trial'     },
  { label: 'Active',    value: 'active'    },
  { label: 'Past Due',  value: 'past_due'  },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Cancelled', value: 'cancelled' },
];

const activeCount = computed(() =>
  tenants.value.filter(t => t.status === 'active').length
);

const inactiveCount = computed(() =>
  tenants.value.filter(t => t.status === 'inactive').length
);

const filteredTenants = computed(() => {
  return tenants.value.filter((tenant) => {
    const keyword = search.value.trim().toLowerCase();

    const matchesSearch =
      !keyword ||
      tenant?.name?.toLowerCase().includes(keyword) ||
      tenant?.domain?.toLowerCase().includes(keyword) ||
      tenant?.status?.toLowerCase().includes(keyword);

    const matchesStatus =
      !selectedStatus.value || tenant?.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusSeverity = (status) => {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'warn';
  return 'secondary';
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const openCreateDialog = () => {
  isEditMode.value = false;
  resetTenantForm();
  createPlan.value = 'starter';
  createSubStatus.value = 'trial';

  tenantForm.value.tenantLogo = {
    url: '',
    publicId: ''
  };

  dialogVisible.value = true;
};

const openEditDialog = (tenantData) => {
  isEditMode.value = true;

  tenantForm.value = {
    id: tenantData._id,
    name: tenantData.name || '',
    domain: tenantData.domain || '',
    status: tenantData.status || '',
    tenantLogo: {
      url: tenantData?.tenantLogo?.url || '',
      publicId: tenantData?.tenantLogo?.publicId || ''
    }
  };

  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  isEditMode.value = false;
  resetTenantForm();

  tenantForm.value.tenantLogo = {
    url: '',
    publicId: ''
  };
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    if (isEditMode.value && tenantForm.value.id) {
      const payload = {
        name: tenantForm.value.name,
        domain: tenantForm.value.domain,
        status: tenantForm.value.status,
        tenantLogo: tenantForm.value.tenantLogo
      };

      const res = await updateTenant(tenantForm.value.id, payload);

      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: res.message || 'Tenant updated successfully',
        life: 3000
      });
    } else {
      tenantForm.value.plan = createPlan.value;
      tenantForm.value.subscriptionStatus = createSubStatus.value;

      const res = await createTenant();

      toast.add({
        severity: 'success',
        summary: 'Created',
        detail: res.message || 'Tenant created successfully',
        life: 3000
      });
    }

    closeDialog();
    await fetchTenants();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong',
      life: 3500
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleRefresh = async () => {
  try {
    tenantStore.isLoading = true;
    await fetchTenants();

    toast.add({
      severity: 'success',
      summary: 'Refreshed',
      detail: 'Tenant list updated',
      life: 2000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to refresh tenants',
      life: 3000
    });
  } finally {
    tenantStore.isLoading = false;
  }
};

const handleRowClick = (event) => {
  const tenant = event.data;
  router.push(`/tenant/${tenant._id}`);
};

onMounted(async () => {
  try {
    tenantStore.isLoading = true;
    await fetchTenants();
  } finally {
    tenantStore.isLoading = false;
  }
});
</script>

<style scoped>
:deep(.tenant-dialog .p-dialog) {
  border-radius: 1.5rem;
  overflow: hidden;
  background: #ffffff;
  color: #0f172a;
}

:deep(.tenant-dialog .p-dialog-header) {
  padding-bottom: 0.75rem;
  background: #ffffff;
  color: #0f172a;
}

:deep(.tenant-dialog .p-dialog-content) {
  padding-top: 0.5rem;
  background: #ffffff;
  color: #0f172a;
}

:deep(.tenant-dialog .p-dialog-footer) {
  background: #ffffff;
  color: #0f172a;
}

:deep(.p-inputtext),
:deep(.p-select) {
  width: 100%;
}

:deep(.p-button) {
  white-space: nowrap;
}

:deep(.tenant-table .p-datatable-table) {
  min-width: 920px;
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
  border: 0;
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

/* app-controlled dark mode only */
.dark :deep(.tenant-dialog .p-dialog),
.dark :deep(.tenant-dialog .p-dialog-header),
.dark :deep(.tenant-dialog .p-dialog-content),
.dark :deep(.tenant-dialog .p-dialog-footer) {
  background: #0f172a;
  color: #e2e8f0;
}

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
  :deep(.tenant-dialog .p-dialog) {
    margin: 0 0.5rem;
  }

  :deep(.tenant-table .p-datatable-wrapper) {
    border-radius: 1rem;
  }
}
</style>