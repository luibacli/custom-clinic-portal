<template>
  <div class="flex flex-col min-h-screen
           bg-gradient-to-br from-white via-blue-50 to-blue-200
           dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
           dark:text-gray-200">
    <TenantNavBar :first-name="firstName" :last-name="lastName" :is-admin="isAdmin" :is-super-admin="isSuperAdmin" :is-patient="isPatient" :is-dev="isDev" :tenant-logo-url="tenantLogoUrl"/>

    <main class="flex-1 p-4">
      <slot />
      <router-view />
    </main>
  </div>

  <AppFooter />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthTenantStore } from "../stores/authTenantStore";
import { useTenantStore } from "../stores/tenantStore";
import TenantNavBar from "../components/TenantNavBar.vue";
import AppFooter from "../components/AppFooter.vue";
import { storeToRefs } from "pinia";

const authTenantStore = useAuthTenantStore();
const tenantStore = useTenantStore();

const { fetchUserTenant } = authTenantStore;
const { isAdmin, isPatient, isSuperAdmin, isDev} = storeToRefs(authTenantStore)
const {tenant } = storeToRefs(tenantStore);

const firstName = ref("");
const lastName = ref("");

const tenantLogoUrl = computed(() => {
  return (
    tenant.value?.tenantLogo?.url ||
    ''
  )
})

onMounted(async () => {
  try {
    const result = await fetchUserTenant();
    firstName.value = result.data?.firstName || '';
    lastName.value  = result.data?.lastName  || '';
  } catch (error) {
    console.error({ error: error.message });
  }
})
</script>
