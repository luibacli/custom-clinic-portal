<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6">
    <Toast />

    <div v-if="isLoading" class="h-[60vh] flex items-center justify-center text-slate-500">
      <Loading />
    </div>

    <template v-else>
      <div class="max-w-6xl mx-auto space-y-5">

        <!-- Header -->
        <section class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          <div class="relative p-4 sm:p-6 lg:p-7">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <p class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">Developer</p>
                <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Pricing Configuration</h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit plan prices, limits, and feature flags. Changes apply immediately.</p>
              </div>
              <div class="flex gap-2">
                <Button label="Reset to Defaults" icon="pi pi-refresh" severity="secondary" outlined class="rounded-2xl" @click="resetToDefaults" :loading="isSaving" />
                <Button label="Save Changes" icon="pi pi-check" class="rounded-2xl" @click="saveChanges" :loading="isSaving" />
              </div>
            </div>
          </div>
        </section>

        <!-- Trial Features -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 class="text-base font-semibold text-slate-800 dark:text-white">Trial Features</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Features enabled for all tenants during their 30-day free trial.</p>
          </div>
          <div class="p-4 sm:p-5">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div v-for="feat in FEATURE_KEYS" :key="feat.key" class="flex items-center gap-2.5">
                <ToggleSwitch
                  :modelValue="trialFeatures[feat.key]"
                  @update:modelValue="trialFeatures[feat.key] = $event"
                  :inputId="`trial-${feat.key}`"
                />
                <label :for="`trial-${feat.key}`" class="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">{{ feat.label }}</label>
              </div>
            </div>
          </div>
        </section>

        <!-- Plan Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div v-for="(plan, idx) in editablePlans" :key="plan.key"
            class="rounded-[28px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col"
          >
            <!-- Plan Header -->
            <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <span class="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold capitalize"
                :class="{
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300':      plan.key === 'starter',
                  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300':       plan.key === 'growth',
                  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300':   plan.key === 'premium',
                }"
              >
                <i class="pi text-[10px]" :class="{
                  'pi-box':      plan.key === 'starter',
                  'pi-bolt':     plan.key === 'growth',
                  'pi-star-fill':plan.key === 'premium',
                }"></i>
                {{ plan.name }}
              </span>
            </div>

            <div class="p-4 sm:p-5 space-y-5 flex-1">

              <!-- Prices -->
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Pricing (PHP)</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-xs text-slate-500 dark:text-slate-400">Monthly</label>
                    <div class="flex items-center gap-0 border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-white dark:bg-slate-800">
                      <span class="px-2.5 text-slate-400 text-sm select-none">₱</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        :value="editablePlans[idx].priceMonthly"
                        @input="onMonthlyInput(idx, +$event.target.value)"
                        class="flex-1 pr-2 py-2 text-sm bg-transparent outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-slate-500 dark:text-slate-400">Annual</label>
                    <div class="flex items-center gap-0 border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-white dark:bg-slate-800">
                      <span class="px-2.5 text-slate-400 text-sm select-none">₱</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        :value="editablePlans[idx].priceAnnual"
                        @input="editablePlans[idx].priceAnnual = +$event.target.value"
                        class="flex-1 pr-2 py-2 text-sm bg-transparent outline-none text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <p v-if="plan.priceMonthly && plan.priceAnnual" class="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  Annual saves {{ formatPHP(plan.priceMonthly * 12 - plan.priceAnnual) }}/yr vs monthly
                </p>
              </div>

              <!-- Limits -->
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Limits</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-xs text-slate-500 dark:text-slate-400">Max Patients</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      :value="editablePlans[idx].patientLimit"
                      @input="editablePlans[idx].patientLimit = +$event.target.value"
                      :placeholder="plan.key === 'premium' ? '0 = unlimited' : ''"
                      class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p v-if="plan.key === 'premium'" class="text-[11px] text-slate-400">0 = unlimited</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-slate-500 dark:text-slate-400">Max Staff</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      :value="editablePlans[idx].userLimit"
                      @input="editablePlans[idx].userLimit = +$event.target.value"
                      class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <!-- Features -->
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Features</p>
                <div class="space-y-2.5">
                  <div v-for="feat in FEATURE_KEYS" :key="feat.key" class="flex items-center justify-between">
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ feat.label }}</span>
                    <ToggleSwitch
                      :modelValue="editablePlans[idx].features[feat.key]"
                      @update:modelValue="editablePlans[idx].features[feat.key] = $event"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Live Preview -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 class="text-base font-semibold text-slate-800 dark:text-white">Live Preview</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">How plans appear to clinic owners on the billing page.</p>
          </div>
          <div class="p-4 sm:p-5 overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th class="text-left py-2 pr-4 text-slate-500 dark:text-slate-400 font-medium w-36">Feature</th>
                  <th v-for="plan in editablePlans" :key="plan.key" class="text-center py-2 px-4 font-bold text-slate-800 dark:text-white">
                    {{ plan.name }}
                    <div class="text-xs font-normal text-slate-500 dark:text-slate-400">₱{{ formatNum(plan.priceMonthly) }}/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-100 dark:border-slate-800">
                  <td class="py-2 pr-4 text-slate-600 dark:text-slate-400">Patients</td>
                  <td v-for="plan in editablePlans" :key="plan.key" class="text-center py-2 px-4 text-slate-700 dark:text-slate-300">
                    {{ plan.patientLimit ? formatNum(plan.patientLimit) : 'Unlimited' }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100 dark:border-slate-800">
                  <td class="py-2 pr-4 text-slate-600 dark:text-slate-400">Staff</td>
                  <td v-for="plan in editablePlans" :key="plan.key" class="text-center py-2 px-4 text-slate-700 dark:text-slate-300">
                    {{ plan.userLimit }}
                  </td>
                </tr>
                <tr v-for="feat in FEATURE_KEYS" :key="feat.key" class="border-t border-slate-100 dark:border-slate-800">
                  <td class="py-2 pr-4 text-slate-600 dark:text-slate-400">{{ feat.label }}</td>
                  <td v-for="plan in editablePlans" :key="plan.key" class="text-center py-2 px-4">
                    <i :class="plan.features[feat.key] ? 'pi pi-check text-emerald-500' : 'pi pi-times text-slate-300 dark:text-slate-600'"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '../lib/axios';
import Loading from '../components/Loading.vue';

const toast     = useToast();
const isLoading = ref(true);
const isSaving  = ref(false);

const FEATURE_KEYS = [
  { key: 'messaging',     label: 'Messaging'      },
  { key: 'appointments',  label: 'Appointments'   },
  { key: 'qrScan',        label: 'QR Scan'        },
  { key: 'mails',         label: 'Mails'          },
  { key: 'verifications', label: 'Verifications'  },
  { key: 'users',         label: 'Users'          },
  { key: 'analytics',     label: 'Analytics'      },
  { key: 'exportReports', label: 'Export Reports' },
  { key: 'smsReminders',  label: 'SMS Reminders'  },
];

const DEFAULTS = {
  plans: [
    { key: 'starter', name: 'Starter', patientLimit: 10000, userLimit: 3,  price: { monthly: 139900, annual: 1399000 }, features: { messaging: false, appointments: false, qrScan: false, mails: false, verifications: false, users: true,  analytics: false, exportReports: false, smsReminders: false } },
    { key: 'growth',  name: 'Growth',  patientLimit: 20000, userLimit: 10, price: { monthly: 289900, annual: 2899000 }, features: { messaging: true,  appointments: true,  qrScan: true,  mails: true,  verifications: false, users: true,  analytics: false, exportReports: false, smsReminders: false } },
    { key: 'premium', name: 'Premium', patientLimit: null,  userLimit: 20, price: { monthly: 539900, annual: 5399000 }, features: { messaging: true,  appointments: true,  qrScan: true,  mails: true,  verifications: false, users: true,  analytics: true,  exportReports: true,  smsReminders: false } },
  ],
  trialFeatures: { messaging: true, appointments: false, qrScan: false, mails: true, verifications: false, users: true, analytics: false, exportReports: false, smsReminders: false },
};

const editablePlans = ref([]);
const trialFeatures = reactive({ ...DEFAULTS.trialFeatures });

const onMonthlyInput = (idx, val) => {
  editablePlans.value[idx].priceMonthly = val;
  editablePlans.value[idx].priceAnnual  = Math.round(val * 10);
};

const centavosToPhp = (c) => (c ?? 0) / 100;
const phpToCentavos = (p) => Math.round((p ?? 0) * 100);
const formatNum     = (n) => (n ?? 0).toLocaleString('en-PH');
const formatPHP     = (n) => `₱${formatNum(Math.round(n))}`;

const hydratePlans = (rawPlans) => {
  editablePlans.value = rawPlans.map(p => ({
    key:          p.key,
    name:         p.name,
    priceMonthly: centavosToPhp(p.price.monthly),
    priceAnnual:  centavosToPhp(p.price.annual),
    patientLimit: p.patientLimit ?? 0,
    userLimit:    p.userLimit,
    features:     { ...p.features },
  }));
};

const hydrateTrialFeatures = (raw) => {
  Object.assign(trialFeatures, raw);
};

const buildPayload = () => ({
  plans: editablePlans.value.map(p => ({
    key:          p.key,
    name:         p.name,
    patientLimit: p.patientLimit || null,
    userLimit:    p.userLimit,
    price: {
      monthly: phpToCentavos(p.priceMonthly),
      annual:  phpToCentavos(p.priceAnnual),
    },
    features: { ...p.features },
  })),
  trialFeatures: { ...trialFeatures },
});

const fetchConfig = async () => {
  try {
    const res = await api.get('/plan-config');
    hydratePlans(res.data.data.plans);
    hydrateTrialFeatures(res.data.data.trialFeatures);
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plan config', life: 3000 });
  }
};

const saveChanges = async () => {
  isSaving.value = true;
  try {
    await api.put('/plan-config', buildPayload());
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Plan configuration updated successfully.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || 'Failed to save', life: 3500 });
  } finally {
    isSaving.value = false;
  }
};

const resetToDefaults = async () => {
  isSaving.value = true;
  try {
    await api.put('/plan-config', { plans: DEFAULTS.plans, trialFeatures: DEFAULTS.trialFeatures });
    hydratePlans(DEFAULTS.plans);
    hydrateTrialFeatures(DEFAULTS.trialFeatures);
    toast.add({ severity: 'info', summary: 'Reset', detail: 'Plan config restored to defaults.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || 'Reset failed', life: 3500 });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await fetchConfig();
  isLoading.value = false;
});
</script>
