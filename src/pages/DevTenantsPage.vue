<template>
  <Toast />
  <div
    class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-4 lg:p-6 transition-colors duration-300"
  >
    <div
      v-if="isLoading"
      class="h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-400"
    >
      <Loading />
    </div>

    <template v-else>
      <div class="max-w-7xl mx-auto space-y-5">
        <!-- Header / Hero -->
        <section
          class="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
        >
          <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          <div class="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-sky-200/30 blur-2xl dark:bg-sky-500/10"></div>

          <div class="relative p-4 sm:p-6 lg:p-7">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div class="flex items-start gap-4 min-w-0">
                <div
                  class="relative h-16 w-16 sm:h-20 sm:w-20 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0 dark:border-slate-700 dark:bg-slate-900"
                >
                  <img
                    v-if="tenantLogoUrl"
                    :src="tenantLogoUrl"
                    alt="Tenant Logo"
                    class="h-full w-full object-cover"
                  />
                  <i v-else class="pi pi-building text-slate-400 dark:text-slate-500 text-2xl"></i>

                  <button
                    type="button"
                    class="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
                    @click="openTenantDialog"
                  >
                    <i class="pi pi-pencil text-xs text-slate-600 dark:text-slate-300"></i>
                  </button>
                </div>

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">
                      Tenant Profile
                    </p>
                    <Tag
                      :value="formatStatus(tenantData?.status)"
                      :severity="getStatusSeverity(tenantData?.status)"
                      class="capitalize"
                    />
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
                      :class="{
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                        'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300': tenantData?.subscription?.plan === 'growth',
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300': tenantData?.subscription?.plan === 'premium',
                      }"
                    >
                      <i class="pi text-[9px]"
                        :class="{
                          'pi-box': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                          'pi-bolt': tenantData?.subscription?.plan === 'growth',
                          'pi-star-fill': tenantData?.subscription?.plan === 'premium',
                        }"
                      ></i>
                      {{ tenantData?.subscription?.plan || 'starter' }}
                    </span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                      :class="{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300': tenantData?.subscription?.status === 'active',
                        'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300': tenantData?.subscription?.status === 'trial' || !tenantData?.subscription?.status,
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300': tenantData?.subscription?.status === 'past_due',
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300': tenantData?.subscription?.status === 'suspended' || tenantData?.subscription?.status === 'cancelled',
                      }"
                    >
                      {{ (tenantData?.subscription?.status || 'trial').replace('_', ' ') }}
                    </span>
                  </div>

                  <h1 class="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight truncate">
                    {{ tenantData?.name || 'Tenant Name' }}
                  </h1>

                  <div class="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div class="flex items-center gap-2 min-w-0">
                      <i class="pi pi-globe shrink-0"></i>
                      <span class="truncate">{{ tenantData?.domain || 'No domain' }}</span>
                    </div>

                    <div class="hidden sm:block text-slate-300 dark:text-slate-700">•</div>

                    <div class="flex items-center gap-2">
                      <i class="pi pi-calendar"></i>
                      <span>Created {{ formatDate(tenantData?.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                <Button
                  label="Back"
                  icon="pi pi-arrow-left"
                  severity="secondary"
                  outlined
                  class="rounded-2xl w-full sm:w-auto"
                  @click="goBack"
                />
                <Button
                  label="Edit Tenant"
                  icon="pi pi-pencil"
                  class="rounded-2xl w-full sm:w-auto"
                  @click="openTenantDialog"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Tenant Info Cards -->
        <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-500 dark:text-slate-400">Plan</p>
                <h2 class="text-xl font-bold mt-1 capitalize"
                  :class="{
                    'text-slate-700 dark:text-slate-200': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                    'text-blue-600 dark:text-blue-400': tenantData?.subscription?.plan === 'growth',
                    'text-amber-600 dark:text-amber-400': tenantData?.subscription?.plan === 'premium',
                  }"
                >{{ tenantData?.subscription?.plan || 'starter' }}</h2>
                <p class="text-xs capitalize mt-0.5"
                  :class="{
                    'text-emerald-600 dark:text-emerald-400': tenantData?.subscription?.status === 'active',
                    'text-blue-500 dark:text-blue-400': tenantData?.subscription?.status === 'trial' || !tenantData?.subscription?.status,
                    'text-amber-500': tenantData?.subscription?.status === 'past_due',
                    'text-red-500': tenantData?.subscription?.status === 'suspended' || tenantData?.subscription?.status === 'cancelled',
                  }"
                >{{ (tenantData?.subscription?.status || 'trial').replace('_', ' ') }}</p>
              </div>
              <div class="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                :class="{
                  'bg-slate-100 dark:bg-slate-800': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                  'bg-blue-100 dark:bg-blue-500/15': tenantData?.subscription?.plan === 'growth',
                  'bg-amber-100 dark:bg-amber-500/15': tenantData?.subscription?.plan === 'premium',
                }"
              >
                <i class="text-xl"
                  :class="{
                    'pi pi-box text-slate-500 dark:text-slate-400': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                    'pi pi-bolt text-blue-600 dark:text-blue-300': tenantData?.subscription?.plan === 'growth',
                    'pi pi-star-fill text-amber-600 dark:text-amber-300': tenantData?.subscription?.plan === 'premium',
                  }"
                ></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
                <h2 class="text-xl font-bold text-slate-800 dark:text-white mt-1">
                  {{ users.length }}
                </h2>
              </div>
              <div class="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center dark:bg-sky-500/15">
                <i class="pi pi-users text-sky-600 dark:text-sky-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-slate-500 dark:text-slate-400">Patients</p>
                <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {{ patientUsersCount }}
                </h2>
              </div>
              <div class="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center dark:bg-green-500/15">
                <i class="pi pi-user text-green-600 dark:text-green-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-slate-500 dark:text-slate-400">Admins</p>
                <h2 class="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {{ adminUsersCount }}
                </h2>
              </div>
              <div class="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center dark:bg-amber-500/15">
                <i class="pi pi-shield text-amber-600 dark:text-amber-300 text-xl"></i>
              </div>
            </div>
          </div>
        </section>

        <!-- Tenant Details -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div class="xl:col-span-2 rounded-[28px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Tenant Information</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Core details for this facility portal.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Tenant Name</p>
                <p class="mt-2 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 break-words">
                  {{ tenantData?.name || '—' }}
                </p>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Domain</p>
                <p class="mt-2 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 break-all">
                  {{ tenantData?.domain || '—' }}
                </p>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Status</p>
                <div class="mt-2">
                  <Tag
                    :value="formatStatus(tenantData?.status)"
                    :severity="getStatusSeverity(tenantData?.status)"
                    class="capitalize"
                  />
                </div>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Created At</p>
                <p class="mt-2 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
                  {{ formatDate(tenantData?.createdAt) }}
                </p>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Subscription Plan</p>
                <p class="mt-2 text-sm sm:text-base font-semibold capitalize"
                  :class="{
                    'text-slate-700 dark:text-slate-200': tenantData?.subscription?.plan === 'starter' || !tenantData?.subscription?.plan,
                    'text-blue-600 dark:text-blue-400': tenantData?.subscription?.plan === 'growth',
                    'text-amber-600 dark:text-amber-400': tenantData?.subscription?.plan === 'premium',
                  }"
                >{{ tenantData?.subscription?.plan || 'starter' }}</p>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-950 dark:border-slate-800">
                <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Trial / Period End</p>
                <p class="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {{ tenantData?.subscription?.trialEndsAt
                    ? formatDate(tenantData.subscription.trialEndsAt)
                    : (tenantData?.subscription?.currentPeriodEnd
                      ? formatDate(tenantData.subscription.currentPeriodEnd)
                      : '—') }}
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-[28px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
            <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Quick Actions</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage this tenant and its users.
            </p>

            <div class="mt-4 space-y-3">
              <Button
                label="Create User"
                icon="pi pi-user-plus"
                class="rounded-2xl w-full justify-center"
                @click="openCreateUserDialog"
              />
              <Button
                label="Edit Tenant"
                icon="pi pi-pencil"
                severity="secondary"
                outlined
                class="rounded-2xl w-full justify-center"
                @click="openTenantDialog"
              />
              <Button
                label="Refresh Users"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                class="rounded-2xl w-full justify-center"
                @click="handleRefreshUsers"
              />
              <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  label="Delete Tenant"
                  icon="pi pi-trash"
                  severity="danger"
                  outlined
                  class="rounded-2xl w-full justify-center"
                  @click="deleteTenantDialogVisible = true"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Toggles Section -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Feature Toggles</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enable or disable portal features for this tenant.
              </p>
            </div>
            <Button
              label="Save Features"
              icon="pi pi-check"
              :loading="isSavingFeatures"
              class="rounded-2xl w-full sm:w-auto shrink-0"
              @click="saveFeatures"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div
              v-for="feat in featureList"
              :key="feat.key"
              class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 transition-colors"
              :class="localFeatures[feat.key] ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20' : ''"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                  :class="localFeatures[feat.key]
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'"
                >
                  <i :class="['pi', feat.icon, 'text-sm']"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ feat.label }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ feat.description }}</p>
                </div>
              </div>
              <ToggleSwitch v-model="localFeatures[feat.key]" class="shrink-0" />
            </div>
          </div>
        </section>

        <!-- Subscription Management Section -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Subscription Management</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Control the plan, billing status, and trial period for this tenant.
              </p>
            </div>
            <Button
              label="Save Subscription"
              icon="pi pi-check"
              :loading="isSavingSubscription"
              class="rounded-2xl w-full sm:w-auto shrink-0"
              @click="saveSubscription"
            />
          </div>

          <!-- Status banner -->
          <div class="mb-5 flex flex-wrap gap-2">
            <div
              class="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold"
              :class="{
                'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300': localSubscription.status === 'active',
                'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-300': localSubscription.status === 'trial',
                'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300': localSubscription.status === 'past_due',
                'border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300': localSubscription.status === 'suspended' || localSubscription.status === 'cancelled',
              }"
            >
              <span class="h-2 w-2 rounded-full"
                :class="{
                  'bg-emerald-500': localSubscription.status === 'active',
                  'bg-blue-500': localSubscription.status === 'trial',
                  'bg-amber-500': localSubscription.status === 'past_due',
                  'bg-red-500': localSubscription.status === 'suspended' || localSubscription.status === 'cancelled',
                }"
              ></span>
              {{ localSubscription.plan?.toUpperCase() }} — {{ localSubscription.status?.replace('_', ' ') }}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Plan -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Plan</label>
              <Select
                v-model="localSubscription.plan"
                :options="planOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>

            <!-- Status -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Subscription Status</label>
              <Select
                v-model="localSubscription.status"
                :options="subStatusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>

            <!-- Trial Ends At -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Trial Ends At</label>
              <InputText
                v-model="localSubscription.trialEndsAt"
                type="date"
                class="w-full rounded-2xl"
              />
              <p class="text-xs text-slate-400">Only applies when status is <code class="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">trial</code>.</p>
            </div>

            <!-- Current Period End -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Current Period End</label>
              <InputText
                v-model="localSubscription.currentPeriodEnd"
                type="date"
                class="w-full rounded-2xl"
              />
              <p class="text-xs text-slate-400">Active subscription billing end date.</p>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              label="Activate (Growth)"
              icon="pi pi-arrow-up"
              size="small"
              severity="success"
              outlined
              class="rounded-xl"
              @click="quickActivate('growth')"
            />
            <Button
              label="Activate (Premium)"
              icon="pi pi-star"
              size="small"
              severity="success"
              outlined
              class="rounded-xl"
              @click="quickActivate('premium')"
            />
            <Button
              label="Reset to Trial (30d)"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              outlined
              class="rounded-xl"
              @click="quickResetTrial"
            />
            <Button
              label="Suspend"
              icon="pi pi-ban"
              size="small"
              severity="danger"
              outlined
              class="rounded-xl"
              @click="quickSuspend"
            />
          </div>
        </section>

        <!-- Clinic Branding Section -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Clinic Branding</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Customize the clinic's portal appearance and contact info.
              </p>
            </div>
            <Button
              label="Save Branding"
              icon="pi pi-check"
              :loading="isSavingBranding"
              class="rounded-2xl w-full sm:w-auto shrink-0"
              @click="saveBranding"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Primary Color -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Primary Color</label>
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 overflow-hidden cursor-pointer"
                  :style="{ background: localBranding.primaryColor }"
                  @click="colorInputRef?.click()"
                >
                  <input
                    ref="colorInputRef"
                    type="color"
                    v-model="localBranding.primaryColor"
                    class="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <InputText
                  v-model="localBranding.primaryColor"
                  placeholder="#2563eb"
                  class="w-40 rounded-2xl font-mono text-sm"
                  maxlength="7"
                />
                <span class="text-xs text-slate-400 dark:text-slate-500">Click the swatch to open the color picker</span>
              </div>
            </div>

            <!-- Welcome Message -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome Message</label>
              <Textarea
                v-model="localBranding.welcomeMessage"
                placeholder="Write a short welcome message shown on the login page and dashboard..."
                class="w-full rounded-2xl resize-none"
                rows="3"
                autoResize
              />
            </div>

            <!-- Address -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Clinic Address</label>
              <InputText
                v-model="localBranding.address"
                placeholder="123 Clinic Street, Manila"
                class="w-full rounded-2xl"
              />
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <InputText
                v-model="localBranding.phone"
                placeholder="+63 XXX XXX XXXX"
                class="w-full rounded-2xl"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Clinic Email</label>
              <InputText
                v-model="localBranding.email"
                placeholder="clinic@example.com"
                class="w-full rounded-2xl"
              />
            </div>
          </div>
        </section>

        <!-- Users Section -->
        <section class="rounded-[28px] bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
                  Tenant Users
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Manage users under this tenant.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),180px,auto] gap-2 w-full xl:max-w-[760px]">
                <IconField iconPosition="left" class="w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="search"
                    placeholder="Search name, email, role..."
                    class="w-full rounded-2xl"
                  />
                </IconField>

                <Select
                  v-model="selectedRole"
                  :options="roleOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Filter Role"
                  class="w-full"
                  showClear
                />

                <Button
                  label="Create User"
                  icon="pi pi-plus"
                  class="rounded-2xl w-full md:w-auto"
                  @click="openCreateUserDialog"
                />
              </div>
            </div>
          </div>

          <div class="p-2 sm:p-3">
            <DataTable
              :value="filteredUsers"
              paginator
              :rows="10"
              dataKey="_id"
              responsiveLayout="scroll"
              class="p-datatable-sm tenant-users-table"
              :rowHover="true"
              paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            >
              <template #empty>
                <div class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <i class="pi pi-users text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
                    No users found
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Try adjusting your filters or create a new user.
                  </p>
                </div>
              </template>

              <Column header="User" style="min-width: 280px">
                <template #body="{ data }">
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="h-11 w-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden dark:bg-slate-800 dark:border-slate-700"
                    >
                      <img
                        v-if="data?.photo?.url"
                        :src="data.photo.url"
                        alt="User Photo"
                        class="h-full w-full object-cover"
                      />
                      <i v-else class="pi pi-user text-slate-400 dark:text-slate-500"></i>
                    </div>

                    <div class="min-w-0">
                      <p class="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {{ fullName(data) }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {{ data.email || 'No email' }}
                      </p>
                    </div>
                  </div>
                </template>
              </Column>

              <Column field="role" header="Role" style="min-width: 140px">
                <template #body="{ data }">
                  <Tag
                    :value="formatRole(data.role)"
                    :severity="getRoleSeverity(data.role)"
                    class="capitalize"
                  />
                </template>
              </Column>

              <Column header="Created" style="min-width: 160px">
                <template #body="{ data }">
                  <span class="text-slate-600 dark:text-slate-400">
                    {{ formatDate(data.createdAt) }}
                  </span>
                </template>
              </Column>

              <Column header="Actions" style="min-width: 220px">
                <template #body="{ data }">
                  <div class="flex flex-wrap gap-2">
                    <Button
                      icon="pi pi-pencil"
                      label="Edit"
                      size="small"
                      outlined
                      class="rounded-xl"
                      @click="openEditUserDialog(data)"
                    />
                    <Button
                      icon="pi pi-trash"
                      label="Delete"
                      size="small"
                      severity="danger"
                      outlined
                      class="rounded-xl"
                      @click="deleteUser(data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </section>
      </div>
    </template>

    <!-- Delete Tenant Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteTenantDialogVisible"
      modal
      :draggable="false"
      header="Delete Tenant"
      :style="{ width: 'min(440px, 95vw)' }"
    >
      <div class="py-2 space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 dark:bg-red-500/15 dark:text-red-400">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div>
            <p class="font-semibold text-slate-800 dark:text-white">Permanently delete this tenant?</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You are about to delete <strong class="text-slate-700 dark:text-slate-200">{{ tenantData?.name }}</strong> and all associated data. This cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" outlined @click="deleteTenantDialogVisible = false" />
        <Button label="Delete Tenant" severity="danger" :loading="isDeletingTenant" @click="confirmDeleteTenant" />
      </template>
    </Dialog>

    <!-- User Dialog -->
    <Dialog
      v-model:visible="userDialogVisible"
      modal
      :header="isEditUserMode ? 'Edit User' : 'Create User'"
      :style="{ width: '95vw', maxWidth: '720px' }"
      class="rounded-3xl tenant-dialog"
    >
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
            <InputText
              v-model="userForm.firstName"
              placeholder="Enter first name"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Middle Name</label>
            <InputText
              v-model="userForm.middleName"
              placeholder="Enter middle name"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
            <InputText
              v-model="userForm.lastName"
              placeholder="Enter last name"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <InputText
              v-model="userForm.email"
              placeholder="Enter email"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">PIN</label>
            <InputText
              v-model="userForm.pin"
              placeholder="Enter PIN"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Birthday</label>
            <InputText
              v-model="userForm.birthday"
              type="date"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
            <InputText
              v-model="userForm.phone"
              placeholder="Enter phone number"
              class="w-full rounded-2xl"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <Select
              v-model="userForm.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select role"
              class="w-full"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <Password
              v-model="userForm.password"
              placeholder="Enter password"
              class="w-full"
              inputClass="w-full rounded-2xl"
              :feedback="false"
              toggleMask
            />
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
            @click="closeUserDialog"
          />
          <Button
            :label="isSubmittingUser ? 'Saving...' : isEditUserMode ? 'Update User' : 'Create User'"
            :icon="isEditUserMode ? 'pi pi-check' : 'pi pi-plus'"
            :loading="isSubmittingUser"
            class="rounded-2xl w-full sm:w-auto"
            @click="submitUser"
          />
        </div>
      </template>
    </Dialog>

    <!-- Tenant Dialog -->
    <Dialog
      v-model:visible="tenantDialogVisible"
      modal
      header="Edit Tenant"
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
              :options="tenantStore.statusOption"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
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

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Tenant Logo</label>

            <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  class="h-20 w-20 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0 dark:border-slate-700 dark:bg-slate-900"
                >
                  <img
                    v-if="tenantForm?.tenantLogo?.url"
                    :src="tenantForm.tenantLogo.url"
                    alt="Tenant Logo Preview"
                    class="h-full w-full object-cover"
                  />
                  <i v-else class="pi pi-building text-slate-400 dark:text-slate-500 text-2xl"></i>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="font-medium text-slate-700 dark:text-slate-200">Logo Preview</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Upload a logo image or paste a direct image URL above.
                  </p>

                  <div class="mt-3 flex flex-col sm:flex-row gap-2">
                    <input
                      ref="logoInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleLogoChange"
                    />

                    <Button
                      label="Upload Logo"
                      icon="pi pi-upload"
                      severity="secondary"
                      outlined
                      class="rounded-2xl w-full sm:w-auto"
                      :loading="logoUploading"
                      @click="logoInput?.click()"
                    />

                    <Button
                      v-if="tenantForm?.tenantLogo?.url"
                      label="Remove Preview"
                      icon="pi pi-times"
                      severity="danger"
                      outlined
                      class="rounded-2xl w-full sm:w-auto"
                      @click="removeLogoPreview"
                    />
                  </div>

                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    Accepted: JPG, PNG, WEBP • Max 2MB
                  </p>
                </div>
              </div>
            </div>
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
            @click="tenantDialogVisible = false"
          />
          <Button
            :label="isSubmittingTenant ? 'Saving...' : 'Save Tenant'"
            icon="pi pi-check"
            :loading="isSubmittingTenant"
            class="rounded-2xl w-full sm:w-auto"
            @click="submitTenant"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Loading from '../components/Loading.vue'
import { useTenantStore } from '../stores/tenantStore'
import { useAuthTenantStore } from '../stores/authTenantStore'
import api from '../lib/axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const tenantStore = useTenantStore()
const authTenantStore = useAuthTenantStore()

const { tenantForm } = storeToRefs(tenantStore)
const { userForm, roleOptions } = storeToRefs(authTenantStore)

const tenantData = ref(null)
const users = ref([])
const isLoading = ref(false)
const isSubmittingUser = ref(false)
const isSubmittingTenant = ref(false)
const logoUploading = ref(false)
const isSavingFeatures = ref(false)
const isSavingBranding = ref(false)
const isSavingSubscription = ref(false)
const deleteTenantDialogVisible = ref(false)
const isDeletingTenant = ref(false)
const colorInputRef    = ref(null)

const planOptions = [
  { label: 'Starter',  value: 'starter'  },
  { label: 'Growth',   value: 'growth'   },
  { label: 'Premium',  value: 'premium'  },
]

const subStatusOptions = [
  { label: 'Trial',     value: 'trial'     },
  { label: 'Active',    value: 'active'    },
  { label: 'Past Due',  value: 'past_due'  },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Cancelled', value: 'cancelled' },
]

const SUB_DEFAULTS = { plan: 'starter', status: 'trial', trialEndsAt: '', currentPeriodEnd: '' }
const localSubscription = reactive({ ...SUB_DEFAULTS })

const BRANDING_DEFAULTS = {
  primaryColor:   '#2563eb',
  address:        '',
  phone:          '',
  email:          '',
  welcomeMessage: '',
}
const localBranding = reactive({ ...BRANDING_DEFAULTS })

const userDialogVisible = ref(false)
const tenantDialogVisible = ref(false)
const isEditUserMode = ref(false)

const FEATURE_DEFAULTS = {
  messaging: true, appointments: true, qrScan: true,
  mails: true, users: true, analytics: false,
  exportReports: false, smsReminders: false,
}

const featureList = [
  { key: 'messaging',     label: 'Direct Messaging',  description: 'Patient & staff messaging',  icon: 'pi-comments' },
  { key: 'appointments',  label: 'Appointments',      description: 'Booking & queue management', icon: 'pi-calendar' },
  { key: 'qrScan',        label: 'QR Scan Check-in',  description: 'QR code patient check-in',   icon: 'pi-qrcode' },
  { key: 'mails',         label: 'Mails & Inbox',     description: 'Email links and inbox',      icon: 'pi-envelope' },
  { key: 'users',         label: 'User Management',   description: 'Manage clinic staff',        icon: 'pi-users' },
  { key: 'analytics',     label: 'Analytics',         description: 'Dashboard reports',          icon: 'pi-chart-bar' },
  { key: 'exportReports', label: 'Export Reports',    description: 'Download data as XLSX/PDF',  icon: 'pi-file-export' },
  { key: 'smsReminders',  label: 'SMS Reminders',     description: 'Automated SMS notifications',icon: 'pi-mobile' },
]

const localFeatures = reactive({ ...FEATURE_DEFAULTS })

const search = ref('')
const selectedRole = ref(null)
const logoInput = ref(null)

const tenantId = computed(() => route.params.id)

const tenantLogoUrl = computed(() => {
  return tenantData.value?.tenantLogo?.url || ''
})

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const keyword = search.value.trim().toLowerCase()

    const matchesSearch =
      !keyword ||
      fullName(user).toLowerCase().includes(keyword) ||
      user?.email?.toLowerCase().includes(keyword) ||
      user?.username?.toLowerCase().includes(keyword) ||
      user?.role?.toLowerCase().includes(keyword)

    const matchesRole =
      !selectedRole.value || user?.role === selectedRole.value

    return matchesSearch && matchesRole
  })
})

const patientUsersCount = computed(() =>
  users.value.filter((user) => user.role === 'patient').length
)

const adminUsersCount = computed(() =>
  users.value.filter((user) => user.role === 'admin' || user.role === 'superadmin').length
)

const fullName = (user) => {
  const first = user?.firstName || ''
  const middle = user?.middleName || ''
  const last = user?.lastName || ''
  return `${first} ${middle} ${last}`.replace(/\s+/g, ' ').trim() || 'Unnamed User'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusSeverity = (status) => {
  if (status === 'active') return 'success'
  if (status === 'inactive') return 'warn'
  return 'secondary'
}

const formatRole = (role) => {
  if (!role) return 'Unknown'
  return role.charAt(0).toUpperCase() + role.slice(1)
}


const getRoleSeverity = (role) => {
  if (role === 'admin') return 'success'
  if (role === 'superadmin') return 'warn'
  if (role === 'patient') return 'info'
  return 'secondary'
}

const goBack = () => {
  router.back()
}

const resetUserFormFields = () => {
  userForm.value.tenantId = tenantId.value
  userForm.value.email = ''
  userForm.value.pin = ''
  userForm.value.firstName = ''
  userForm.value.middleName = ''
  userForm.value.lastName = ''
  userForm.value.birthday = ''
  userForm.value.phone = ''
  userForm.value.password = ''
  userForm.value.role = ''
  userForm.value.id = null
}

const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

const syncLocalSubscription = (tenant) => {
  const s = tenant?.subscription || {}
  localSubscription.plan             = s.plan   || 'starter'
  localSubscription.status           = s.status || 'trial'
  localSubscription.trialEndsAt      = toDateInput(s.trialEndsAt)
  localSubscription.currentPeriodEnd = toDateInput(s.currentPeriodEnd)
}

const syncLocalFeatures = (tenant) => {
  const f = tenant?.features || {}
  for (const key of Object.keys(FEATURE_DEFAULTS)) {
    localFeatures[key] = f[key] !== undefined ? f[key] : FEATURE_DEFAULTS[key]
  }
}

const syncLocalBranding = (tenant) => {
  const b = tenant?.branding || {}
  for (const key of Object.keys(BRANDING_DEFAULTS)) {
    localBranding[key] = b[key] !== undefined ? b[key] : BRANDING_DEFAULTS[key]
  }
}

const fetchPageData = async () => {
  isLoading.value = true
  try {
    const tenantRes = await tenantStore.fetchTenant(tenantId.value)
    tenantData.value = tenantRes?.data || tenantRes || null
    syncLocalFeatures(tenantData.value)
    syncLocalBranding(tenantData.value)
    syncLocalSubscription(tenantData.value)

    const usersRes = await authTenantStore.fetchTenantUsers(tenantId.value)
    users.value = usersRes?.data || []
  } catch (error) {
    console.error('Failed to fetch tenant details page:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load tenant details.',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const saveBranding = async () => {
  isSavingBranding.value = true
  const res = await tenantStore.updateBranding(tenantId.value, { ...localBranding })
  isSavingBranding.value = false

  if (!res?.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: res?.message || 'Failed to save branding.', life: 3000 })
    return
  }

  if (tenantData.value) tenantData.value.branding = res.data
  toast.add({ severity: 'success', summary: 'Saved', detail: 'Clinic branding updated.', life: 2500 })
}

const saveFeatures = async () => {
  isSavingFeatures.value = true
  const res = await tenantStore.updateFeatures(tenantId.value, { ...localFeatures })
  isSavingFeatures.value = false

  if (!res?.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: res?.message || 'Failed to save features.', life: 3000 })
    return
  }

  if (tenantData.value) tenantData.value.features = res.data
  toast.add({ severity: 'success', summary: 'Saved', detail: 'Feature toggles updated.', life: 2500 })
}

const saveSubscription = async () => {
  isSavingSubscription.value = true
  try {
    const payload = {
      plan:   localSubscription.plan,
      status: localSubscription.status,
    }
    if (localSubscription.trialEndsAt)      payload.trialEndsAt      = localSubscription.trialEndsAt
    if (localSubscription.currentPeriodEnd) payload.currentPeriodEnd = localSubscription.currentPeriodEnd

    const { data } = await api.patch(`tenants/${tenantId.value}/subscription`, payload)
    if (!data?.success) throw new Error(data?.message || 'Failed to save subscription.')

    if (tenantData.value) tenantData.value.subscription = data.data
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Subscription updated.', life: 2500 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || err.message, life: 3000 })
  } finally {
    isSavingSubscription.value = false
  }
}

const quickActivate = (plan) => {
  localSubscription.plan   = plan
  localSubscription.status = 'active'
  const end = new Date()
  end.setFullYear(end.getFullYear() + 1)
  localSubscription.currentPeriodEnd = toDateInput(end)
  localSubscription.trialEndsAt      = ''
  saveSubscription()
}

const quickResetTrial = () => {
  localSubscription.plan   = 'starter'
  localSubscription.status = 'trial'
  const trial = new Date()
  trial.setDate(trial.getDate() + 30)
  localSubscription.trialEndsAt      = toDateInput(trial)
  localSubscription.currentPeriodEnd = ''
  saveSubscription()
}

const quickSuspend = () => {
  localSubscription.status = 'suspended'
  saveSubscription()
}

const openCreateUserDialog = () => {
  isEditUserMode.value = false
  resetUserFormFields()
  userDialogVisible.value = true
}

const openEditUserDialog = (user) => {
  isEditUserMode.value = true
  userForm.value.id = user._id
  userForm.value.tenantId = tenantId.value
  userForm.value.email = user.email || ''
  userForm.value.pin = user.pin || ''
  userForm.value.firstName = user.firstName || ''
  userForm.value.middleName = user.middleName || ''
  userForm.value.lastName = user.lastName || ''
  userForm.value.birthday = user.birthday || ''
  userForm.value.phone = user.phone || ''
  userForm.value.password = ''
  userForm.value.role = user.role || ''
  userDialogVisible.value = true
}

const closeUserDialog = () => {
  userDialogVisible.value = false
  isEditUserMode.value = false
  resetUserFormFields()
}

const submitUser = async () => {
  isSubmittingUser.value = true
  try {
    userForm.value.tenantId = tenantId.value

    let res
    if (isEditUserMode.value && userForm.value.id) {
      res = await authTenantStore.updateUser(userForm.value.id)
    } else {
      res = await authTenantStore.addUser()
    }

    if (!res?.success) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: res?.message || 'Failed to save user.',
        life: 3000
      })
      return
    }

    toast.add({
      severity: 'success',
      summary: isEditUserMode.value ? 'Updated' : 'Created',
      detail: res?.message || `User ${isEditUserMode.value ? 'updated' : 'created'} successfully.`,
      life: 3000
    })

    closeUserDialog()
    await fetchPageData()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.response?.data?.message || error?.message || 'Failed to save user.',
      life: 3000
    })
  } finally {
    isSubmittingUser.value = false
  }
}

const deleteUser = async (user) => {
  const res = await authTenantStore.removeUserTenant(user._id)

  if (!res?.success) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: res?.message || 'Failed to delete user.',
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Deleted',
    detail: 'User deleted successfully.',
    life: 2500
  })

  await fetchPageData()
}

const syncTenantFormLogoFromData = () => {
  tenantForm.value.tenantLogo = {
    url: tenantData.value?.tenantLogo?.url || '',
    publicId: tenantData.value?.tenantLogo?.publicId || ''
  }
}

const openTenantDialog = () => {
  tenantForm.value.id = tenantData.value?._id || tenantId.value
  tenantForm.value.name = tenantData.value?.name || ''
  tenantForm.value.domain = tenantData.value?.domain || ''
  tenantForm.value.status = tenantData.value?.status || ''
  syncTenantFormLogoFromData()
  tenantDialogVisible.value = true
}

const removeLogoPreview = () => {
  tenantForm.value.tenantLogo = {
    url: '',
    publicId: ''
  }
}

const handleLogoChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file || !tenantId.value) return

  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid file',
      detail: 'Please select an image file only.',
      life: 3000
    })
    event.target.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: 'File too large',
      detail: 'Please upload an image below 2MB.',
      life: 3000
    })
    event.target.value = ''
    return
  }

  logoUploading.value = true

  try {
    const data = await tenantStore.uploadLogo(tenantId.value, file)

    if (data?.tenantLogo) {
      tenantForm.value.tenantLogo = {
        url: data.tenantLogo.url || '',
        publicId: data.tenantLogo.publicId || ''
      }
    }

    await fetchPageData()
    syncTenantFormLogoFromData()

    toast.add({
      severity: 'success',
      summary: 'Logo uploaded',
      detail: data?.message || 'Tenant logo uploaded successfully.',
      life: 3000
    })
  } catch (error) {
    console.error('Failed to upload logo:', error)
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: error?.response?.data?.message || 'Failed to upload logo.',
      life: 3000
    })
  } finally {
    logoUploading.value = false
    event.target.value = ''
  }
}

const submitTenant = async () => {
  isSubmittingTenant.value = true
  try {
    const payload = {
      name: tenantForm.value.name,
      domain: tenantForm.value.domain,
      status: tenantForm.value.status,
      tenantLogo: tenantForm.value.tenantLogo
    }

    const res = await tenantStore.updateTenant(tenantId.value, payload)

    if (!res?.success) {
      toast.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: res?.message || 'Failed to update tenant.',
        life: 3000
      })
      return
    }

    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: res?.message || 'Tenant updated successfully.',
      life: 3000
    })

    tenantDialogVisible.value = false
    await fetchPageData()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.response?.data?.message || error?.message || 'Failed to update tenant.',
      life: 3000
    })
  } finally {
    isSubmittingTenant.value = false
  }
}

const handleRefreshUsers = async () => {
  await fetchPageData()
  toast.add({
    severity: 'success',
    summary: 'Refreshed',
    detail: 'Tenant users refreshed.',
    life: 2000
  })
}

const confirmDeleteTenant = async () => {
  isDeletingTenant.value = true
  const result = await tenantStore.deleteTenant(tenantId.value)
  isDeletingTenant.value = false

  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: result.message || 'Failed to delete tenant.', life: 3000 })
    return
  }

  deleteTenantDialogVisible.value = false
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Tenant deleted successfully.', life: 2500 })
  router.push('/dev')
}

onMounted(async () => {
  await fetchPageData()
})
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
:deep(.p-select),
:deep(.p-password),
:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-button) {
  white-space: nowrap;
}

:deep(.tenant-users-table .p-datatable-table) {
  min-width: 1100px;
}

:deep(.tenant-users-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  border-color: rgba(226, 232, 240, 0.8);
  vertical-align: middle;
}

:deep(.tenant-users-table .p-datatable-tbody > tr > td) {
  background: transparent;
  color: #0f172a;
  border-color: rgba(226, 232, 240, 0.65);
  vertical-align: middle;
}

:deep(.tenant-users-table .p-datatable-tbody > tr:hover) {
  background: rgba(248, 250, 252, 0.8);
}

:deep(.tenant-users-table .p-paginator) {
  border: 0;
  background: transparent;
  padding-top: 1rem;
  padding-bottom: 0.25rem;
}

:deep(.tenant-users-table .p-paginator .p-paginator-page),
:deep(.tenant-users-table .p-paginator .p-paginator-prev),
:deep(.tenant-users-table .p-paginator .p-paginator-next) {
  color: #475569;
}

:deep(.tenant-users-table .p-paginator .p-paginator-page.p-highlight) {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border-radius: 9999px;
}

.dark :deep(.tenant-dialog .p-dialog),
.dark :deep(.tenant-dialog .p-dialog-header),
.dark :deep(.tenant-dialog .p-dialog-content),
.dark :deep(.tenant-dialog .p-dialog-footer) {
  background: #0f172a;
  color: #e2e8f0;
}

.dark :deep(.tenant-users-table .p-datatable-thead > tr > th) {
  background: #0f172a;
  color: #cbd5e1;
  border-color: rgba(51, 65, 85, 0.9);
}

.dark :deep(.tenant-users-table .p-datatable-tbody > tr > td) {
  color: #e2e8f0;
  border-color: rgba(51, 65, 85, 0.65);
}

.dark :deep(.tenant-users-table .p-datatable-tbody > tr:hover) {
  background: rgba(30, 41, 59, 0.6);
}

.dark :deep(.tenant-users-table .p-paginator .p-paginator-page),
.dark :deep(.tenant-users-table .p-paginator .p-paginator-prev),
.dark :deep(.tenant-users-table .p-paginator .p-paginator-next) {
  color: #cbd5e1;
}

.dark :deep(.tenant-users-table .p-paginator .p-paginator-page.p-highlight) {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

@media (max-width: 640px) {
  :deep(.tenant-dialog .p-dialog) {
    margin: 0 0.5rem;
  }

  :deep(.tenant-users-table .p-datatable-wrapper) {
    border-radius: 1rem;
  }
}
</style>