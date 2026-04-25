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

  <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
    <div
      class="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
      <p>Developed by Truly Yours Luigie C. Bacli</p>
      <p>© 2026 CareBoard. All rights reserved.</p>
      <div class="flex gap-4 mt-2 sm:mt-0">
        <a href="#" class="hover:text-primary">Privacy Policy</a>
        <a href="#" class="hover:text-primary">Terms</a>
        <a href="#" class="hover:text-primary">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthTenantStore } from "../stores/authTenantStore";
import { useTenantStore } from "../stores/tenantStore";
import TenantNavBar from "../components/TenantNavBar.vue";
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
