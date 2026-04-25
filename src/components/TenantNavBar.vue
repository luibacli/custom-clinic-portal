<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
            <div
              class="shrink-0 rounded-2xl bg-slate-50 p-2 shadow-sm border border-slate-200 h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="props.tenantLogoUrl"
                :src="props.tenantLogoUrl"
                alt="Tenant Logo"
                class="h-full w-full object-cover rounded-xl"
              />
              <CareBoardSVG v-else class="h-9 w-9 sm:h-10 sm:w-10" />
            </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2" style="position: relative;">

          <!-- Avatar Menu -->
          <Menu ref="profileMenuRef" :model="profileMenuItems" popup />
          <i class="pi pi-moon"></i>
          <ToggleSwitch @click="toggleDark" />
          <Avatar icon="pi pi-user" shape="circle" size="normal" @click="onAvatarClick" />
          <p>{{  props.firstName}} {{ props.lastName }}</p>
        </div>
      </template>
    </Menubar>

    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthTenantStore } from "../stores/authTenantStore";
import CareBoardSVG from "./CareBoardSVG.vue";

const authTenantStore = useAuthTenantStore();

const { logout } = authTenantStore;
const { isPatient, isAdmin } = storeToRefs(authTenantStore);

const router = useRouter();
const toast = useToast();

const items = computed(() => {
  const adminItems = [
    { label: 'Home',         icon: 'pi pi-home',     command: () => router.push("/tenant-home") },
    { label: 'Appointments', icon: 'pi pi-calendar',  command: () => router.push('/appointments') },
    { label: 'Mails',        icon: 'pi pi-envelope',  command: () => router.push('/mails') },
    { label: 'Inbox',        icon: 'pi pi-inbox',     command: () => router.push('/inbox') },
    { label: 'Profile',      icon: 'pi pi-user',      command: () => router.push("/profile") },
  ];
  const superAdminItems = [
    { label: 'Home',         icon: 'pi pi-home',     command: () => router.push("/tenant-home") },
    { label: 'Appointments', icon: 'pi pi-calendar',  command: () => router.push('/appointments') },
    { label: 'Mails',        icon: 'pi pi-envelope',  command: () => router.push('/mails') },
    { label: 'Inbox',        icon: 'pi pi-inbox',     command: () => router.push("/inbox") },
    { label: 'Users',        icon: 'pi pi-users',     command: () => router.push("/users") },
    { label: 'Profile',      icon: 'pi pi-user',      command: () => router.push("/profile") },
  ];
    const patientItems = [
    { label: 'MY ID', icon: 'pi pi-id-card', command: () => router.push("/patient") },
    { label: 'Inbox', icon: 'pi pi-inbox', command: () => router.push("/inbox") },
    { label: 'Profile', icon: 'pi pi-user', command: () => router.push("/profile")}
  ];
      const devItems = [
    { label: 'Home', icon: 'pi pi-home', command: () => router.push("/dev") },
    { label: 'Users', icon: 'pi pi-users', command: () => router.push("/manage-users") },
    { label: 'Profile', icon: 'pi pi-user', command: () => router.push("/profile")}
  ];

  if (props.isPatient === true) {
    return patientItems
  }
  if (props.isAdmin === true) {
    return adminItems
  }
  if (props.isSuperAdmin === true) {
    return superAdminItems
  }
  if (props.isDev === true) {
    return devItems
  }
});

const profileMenuRef = ref();

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
  document.documentElement.classList.toggle('my-app-dark')
}

const props = defineProps({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  isPatient: {
    type: Boolean,
  },
  isAdmin: {
    type: Boolean,
  },
  isSuperAdmin: {
    type: Boolean
  },
  isDev: {
    type: Boolean
  },
  tenantLogoUrl: {
    type: String
  }
})
</script>

<style scoped>
.font-bold {
  font-weight: bold;
}
</style>
