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

          <!-- Notification Bell -->
          <div class="relative" ref="bellRef">
            <button
              @click="toggleNotifPanel"
              class="relative flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <i class="pi pi-bell text-slate-600 dark:text-slate-300 text-base"></i>
              <span
                v-if="notifStore.totalBadge > 0"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-sm"
              >{{ notifStore.totalBadge > 99 ? '99+' : notifStore.totalBadge }}</span>
            </button>

            <!-- Notification Dropdown -->
            <Transition name="notif-drop">
              <div
                v-show="showNotifPanel"
                class="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl z-[200] overflow-hidden"
              >
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
                    <span
                      v-if="notifStore.totalBadge > 0"
                      class="rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5"
                    >{{ notifStore.totalBadge }}</span>
                  </div>
                  <button @click="showNotifPanel = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <!-- Counts Row -->
                <div class="flex gap-0 divide-x divide-slate-100 dark:divide-white/10 border-b border-slate-100 dark:border-white/10">
                  <div class="flex-1 px-3 py-2.5 text-center">
                    <p class="text-lg font-bold text-sky-600 dark:text-sky-400">{{ notifStore.messageUnread }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Messages</p>
                  </div>
                  <div class="flex-1 px-3 py-2.5 text-center">
                    <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ notifStore.emailUnread }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Emails</p>
                  </div>
                  <div class="flex-1 px-3 py-2.5 text-center">
                    <p class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ notifStore.apptUpdateCount }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Appt Updates</p>
                  </div>
                </div>

                <!-- Recent items -->
                <div class="max-h-64 overflow-y-auto">
                  <div v-if="notifStore.recentItems.length === 0" class="py-8 text-center">
                    <i class="pi pi-check-circle text-emerald-400 text-2xl mb-2 block"></i>
                    <p class="text-sm text-slate-400">You're all caught up!</p>
                  </div>

                  <button
                    v-for="item in notifStore.recentItems"
                    :key="item.id"
                    @click="navigateTo(item.route)"
                    class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0"
                  >
                    <div
                      class="shrink-0 h-8 w-8 rounded-xl flex items-center justify-center mt-0.5"
                      :class="{
                        'bg-sky-50 dark:bg-sky-500/10': item.type === 'message',
                        'bg-indigo-50 dark:bg-indigo-500/10': item.type === 'email',
                        'bg-amber-50 dark:bg-amber-500/10': item.type === 'appointment',
                      }"
                    >
                      <i
                        class="text-sm"
                        :class="{
                          'pi pi-comments text-sky-500': item.type === 'message',
                          'pi pi-envelope text-indigo-500': item.type === 'email',
                          'pi pi-calendar text-amber-500': item.type === 'appointment',
                        }"
                      ></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{{ item.title }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{{ item.body }}</p>
                    </div>
                  </button>
                </div>

                <!-- Footer links -->
                <div class="flex divide-x divide-slate-100 dark:divide-white/10 border-t border-slate-100 dark:border-white/10">
                  <button @click="navigateTo('/messages')" class="flex-1 py-2.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors">
                    <i class="pi pi-comments mr-1 text-[10px]"></i> Messages
                  </button>
                  <button @click="navigateTo('/inbox')" class="flex-1 py-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                    <i class="pi pi-envelope mr-1 text-[10px]"></i> Emails
                  </button>
                  <button v-if="props.isAdmin || props.isSuperAdmin" @click="navigateTo('/scan')" class="flex-1 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                    <i class="pi pi-qrcode mr-1 text-[10px]"></i> Scan QR
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Dark mode toggle -->
          <i class="pi pi-moon"></i>
          <ToggleSwitch @click="toggleDark" />

          <!-- Avatar menu -->
          <Menu ref="profileMenuRef" :model="profileMenuItems" popup />
          <Avatar icon="pi pi-user" shape="circle" size="normal" @click="onAvatarClick" />
          <p class="hidden sm:block">{{ props.firstName }} {{ props.lastName }}</p>
        </div>
      </template>
    </Menubar>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useNotificationStore } from '../stores/notificationStore'
import CareBoardSVG from './CareBoardSVG.vue'

const authTenantStore = useAuthTenantStore()
const notifStore = useNotificationStore()

const { logout } = authTenantStore
const { isPatient, isAdmin } = storeToRefs(authTenantStore)

const router = useRouter()
const toast = useToast()

const bellRef = ref(null)
const showNotifPanel = ref(false)
const profileMenuRef = ref()

const items = computed(() => {
  const adminItems = [
    { label: 'Home',         icon: 'pi pi-home',      command: () => router.push('/tenant-home') },
    { label: 'Appointments', icon: 'pi pi-calendar',  command: () => router.push('/appointments') },
    { label: 'Scan QR',      icon: 'pi pi-qrcode',    command: () => router.push('/scan') },
    { label: 'Messages',     icon: 'pi pi-comments',  command: () => router.push('/messages') },
    { label: 'Emails',       icon: 'pi pi-envelope',  command: () => router.push('/inbox') },
    { label: 'Mails',        icon: 'pi pi-send',      command: () => router.push('/mails') },
    { label: 'Profile',      icon: 'pi pi-user',      command: () => router.push('/profile') },
  ]
  const superAdminItems = [
    { label: 'Home',         icon: 'pi pi-home',      command: () => router.push('/tenant-home') },
    { label: 'Appointments', icon: 'pi pi-calendar',  command: () => router.push('/appointments') },
    { label: 'Scan QR',      icon: 'pi pi-qrcode',    command: () => router.push('/scan') },
    { label: 'Messages',     icon: 'pi pi-comments',  command: () => router.push('/messages') },
    { label: 'Emails',       icon: 'pi pi-envelope',  command: () => router.push('/inbox') },
    { label: 'Mails',        icon: 'pi pi-send',      command: () => router.push('/mails') },
    { label: 'Users',        icon: 'pi pi-users',     command: () => router.push('/users') },
    { label: 'Profile',      icon: 'pi pi-user',      command: () => router.push('/profile') },
  ]
  const patientItems = [
    { label: 'My ID',     icon: 'pi pi-id-card',  command: () => router.push('/patient') },
    { label: 'Messages',  icon: 'pi pi-comments', command: () => router.push('/messages') },
    { label: 'Emails',    icon: 'pi pi-envelope', command: () => router.push('/inbox') },
    { label: 'Profile',   icon: 'pi pi-user',     command: () => router.push('/profile') },
  ]
  const devItems = [
    { label: 'Home',    icon: 'pi pi-home',   command: () => router.push('/dev') },
    { label: 'Users',   icon: 'pi pi-users',  command: () => router.push('/manage-users') },
    { label: 'Profile', icon: 'pi pi-user',   command: () => router.push('/profile') },
  ]

  if (props.isPatient)    return patientItems
  if (props.isAdmin)      return adminItems
  if (props.isSuperAdmin) return superAdminItems
  if (props.isDev)        return devItems
  return []
})

const profileMenuItems = [
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => { logout(); router.push('/signin') }
  }
]

const toggleNotifPanel = () => { showNotifPanel.value = !showNotifPanel.value }

const navigateTo = (route) => {
  showNotifPanel.value = false
  router.push(route)
}

const onAvatarClick = (event) => { profileMenuRef.value.toggle(event) }

const toggleDark = () => { document.documentElement.classList.toggle('my-app-dark') }

// Click-outside to close notification panel
const handleClickOutside = (e) => {
  if (bellRef.value && !bellRef.value.contains(e.target)) {
    showNotifPanel.value = false
  }
}

// Start global notification polling
let notifInterval = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  notifStore.poll()
  notifInterval = setInterval(() => notifStore.poll(), 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  if (notifInterval) clearInterval(notifInterval)
})

const props = defineProps({
  firstName:    { type: String },
  lastName:     { type: String },
  isPatient:    { type: Boolean },
  isAdmin:      { type: Boolean },
  isSuperAdmin: { type: Boolean },
  isDev:        { type: Boolean },
  tenantLogoUrl:{ type: String },
})
</script>

<style scoped>
.notif-drop-enter-active,
.notif-drop-leave-active {
  transition: all 0.15s ease;
}
.notif-drop-enter-from,
.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
