<template>
  <div class="card">
    <Menubar :model="devItems">
      <template #start>
        <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#3DB8A6" />
              <stop offset="100%" stop-color="#3C7DD9" />
            </linearGradient>
          </defs>
          <path
            d="M100 180L45 120C15 90 15 45 50 30C75 20 95 45 100 60C105 45 125 20 150 30C185 45 185 90 155 120L100 180Z"
            fill="url(#grad)" />
          <path d="M55 110H80L90 85L105 135L115 110H145" stroke="white" stroke-width="8" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </template>

      <template #end>
        <div class="flex items-center gap-2" style="position: relative;">
          <Menu ref="profileMenuRef" :model="profileMenuItems" popup />
          <i class="pi pi-moon"></i>
          <ToggleSwitch @click="toggleDark" />
          <Avatar icon="pi pi-user" shape="circle" size="normal" @click="onAvatarClick" style="cursor: pointer;" />
          <p v-if="displayName" class="text-sm font-medium">{{ displayName }}</p>
        </div>
      </template>
    </Menubar>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthTenantStore } from "../stores/authTenantStore";

const router = useRouter();
const authTenantStore = useAuthTenantStore();
const { logout } = authTenantStore;

const profileMenuRef = ref();
const firstName = ref('');
const lastName  = ref('');

const displayName = computed(() => {
  const parts = [firstName.value, lastName.value].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
});

const devItems = [
  { label: 'Dashboard',   icon: 'pi pi-home',        command: () => router.push('/dev') },
  { label: 'Users',       icon: 'pi pi-users',        command: () => router.push('/manage-users') },
  { label: 'Transactions',icon: 'pi pi-credit-card',  command: () => router.push('/transactions') },
  { label: 'Contacts',    icon: 'pi pi-inbox',        command: () => router.push('/contacts') },
];

const profileMenuItems = [
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      logout();
      router.push('/signin');
    }
  }
];

function onAvatarClick(event) {
  profileMenuRef.value.toggle(event);
}

const toggleDark = () => {
  document.documentElement.classList.toggle('my-app-dark');
};

onMounted(async () => {
  const result = await authTenantStore.fetchUserTenant();
  if (result?.success && result.data) {
    firstName.value = result.data.firstName || '';
    lastName.value  = result.data.lastName  || '';
  }
});
</script>

<style scoped>
.font-bold {
  font-weight: bold;
}
</style>
