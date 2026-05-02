<template>
  <Toast />

  <!-- Mobile backdrop -->
  <Transition name="backdrop-fade">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-[90] bg-black/40 lg:hidden"
      @click="mobileOpen = false"
    />
  </Transition>

  <!-- Mobile top bar -->
  <div class="fixed top-0 left-0 right-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center gap-3 px-4 lg:hidden">
    <button
      class="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      @click="mobileOpen = !mobileOpen"
    >
      <i class="pi pi-bars text-slate-600 dark:text-slate-300 text-base"></i>
    </button>

    <div class="h-8 w-8 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
      <img v-if="props.tenantLogoUrl" :src="props.tenantLogoUrl" alt="Logo" class="h-full w-full object-cover" />
       <Avatar v-else image="/myclinicaccess_logo.svg"/>
        
    </div>

    <span class="text-sm font-semibold text-slate-800 dark:text-white truncate flex-1">{{ clinicName }}</span>

    <button
      ref="mobileBellRef"
      class="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      @click="toggleNotifPanel"
    >
      <i class="pi pi-bell text-slate-600 dark:text-slate-300 text-base"></i>
      <span
        v-if="notifStore.totalBadge > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none"
      >{{ notifStore.totalBadge > 99 ? '99+' : notifStore.totalBadge }}</span>
    </button>
  </div>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full z-[95] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transition-[width,transform] duration-300 ease-in-out overflow-hidden"
    :class="[
      collapsed ? 'w-16' : 'w-64',
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
  >
    <!-- Header: expanded state -->
    <div v-if="!collapsed" class="flex items-center gap-3 px-3 py-3.5 shrink-0 border-b border-slate-100 dark:border-white/10">
      <div class="h-9 w-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
        <img v-if="props.tenantLogoUrl" :src="props.tenantLogoUrl" alt="Logo" class="h-full w-full object-cover" />
        <Avatar v-else image="/myclinicaccess_logo.svg" shape="circle"/>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-bold text-slate-800 dark:text-white truncate leading-tight">{{ clinicName }}</p>
        <p class="text-[10px] text-slate-400 truncate">My Clinic Access</p>
      </div>
      <button
        class="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
        title="Collapse sidebar"
        @click="toggle"
      >
        <i class="pi pi-angle-left text-slate-500 text-xs"></i>
      </button>
    </div>

    <!-- Header: collapsed state — logo + expand button stacked -->
    <div v-else class="flex flex-col items-center px-2 py-3 gap-2 shrink-0 border-b border-slate-100 dark:border-white/10">
      <div class="h-9 w-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 dark:border-white/10">
        <img v-if="props.tenantLogoUrl" :src="props.tenantLogoUrl" alt="Logo" class="h-full w-full object-cover" />
         <Avatar v-else image="/myclinicaccess_logo.svg"/>
         <!-- <i class="pi pi-bars" style="color: green;"></i> -->
      </div>
      <button
        class="hidden lg:flex w-full h-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        title="Expand sidebar"
        @click="toggle"
      >
        <i class="pi pi-angle-right text-slate-400 text-xs"></i>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 space-y-0.5">

      <!-- Patient nav -->
      <template v-if="isPatient">
        <NavItem icon="pi-id-card" label="My ID" to="/patient" :collapsed="collapsed" />
        <template v-if="featureMessaging || featureMails">
          <NavDivider :collapsed="collapsed" label="Communications" />
          <NavItem v-if="featureMessaging" icon="pi-comments" label="Messages" to="/messages" :collapsed="collapsed" :badge="notifStore.messageUnread" />
          <NavItem v-if="featureMails" icon="pi-envelope" label="Emails" to="/inbox" :collapsed="collapsed" :badge="notifStore.emailUnread" />
        </template>
        <NavDivider :collapsed="collapsed" label="Account" />
        <NavItem icon="pi-user" label="Profile" to="/profile" :collapsed="collapsed" exact />
      </template>

      <!-- Admin nav -->
      <template v-else-if="isAdmin && !isSuperAdmin">
        <NavItem icon="pi-home" label="Home" to="/tenant-home" :collapsed="collapsed" exact />
        <NavDivider :collapsed="collapsed" label="Patient Care" />
        <NavItem v-if="featureAppointments" icon="pi-calendar" label="Appointments" to="/appointments" :collapsed="collapsed" />
        <NavItem v-if="featureQrScan" icon="pi-qrcode" label="Scan QR" to="/scan" :collapsed="collapsed" />
        <NavItem v-if="featureMessaging" icon="pi-comments" label="Messages" to="/messages" :collapsed="collapsed" :badge="notifStore.messageUnread" />
        <NavDivider :collapsed="collapsed" label="Communications" />
        <NavItem v-if="featureMails" icon="pi-envelope" label="Emails" to="/inbox" :collapsed="collapsed" :badge="notifStore.emailUnread" />
        <NavItem v-if="featureVerification" icon="pi-check-square" label="Verification Center" to="/mails" :collapsed="collapsed" />
        <NavDivider :collapsed="collapsed" label="Insights" />
        <NavItem icon="pi-chart-bar" label="Analytics" to="/analytics" :collapsed="collapsed" />
        <NavDivider :collapsed="collapsed" label="Account" />
        <NavItem icon="pi-user" label="Profile" to="/profile" :collapsed="collapsed" exact />
      </template>

      <!-- Superadmin nav -->
      <template v-else-if="isSuperAdmin">
        <NavItem icon="pi-home" label="Home" to="/tenant-home" :collapsed="collapsed" exact />
        <NavDivider :collapsed="collapsed" label="Patient Care" />
        <NavItem v-if="featureAppointments" icon="pi-calendar" label="Appointments" to="/appointments" :collapsed="collapsed" />
        <NavItem v-if="featureQrScan" icon="pi-qrcode" label="Scan QR" to="/scan" :collapsed="collapsed" />
        <NavItem v-if="featureMessaging" icon="pi-comments" label="Messages" to="/messages" :collapsed="collapsed" :badge="notifStore.messageUnread" />
        <NavDivider :collapsed="collapsed" label="Communications" />
        <NavItem v-if="featureMails" icon="pi-envelope" label="Emails" to="/inbox" :collapsed="collapsed" :badge="notifStore.emailUnread" />
        <NavItem v-if="featureVerification" icon="pi-check-square" label="Verification Center" to="/mails" :collapsed="collapsed" />
        <NavDivider :collapsed="collapsed" label="Management" />
        <NavItem v-if="featureUsers" icon="pi-users" label="Users" to="/users" :collapsed="collapsed" />
        <NavItem icon="pi-chart-bar" label="Analytics" to="/analytics" :collapsed="collapsed" />
        <NavItem icon="pi-credit-card" label="Billing" to="/billing" :collapsed="collapsed" />
        <NavDivider :collapsed="collapsed" label="Account" />
        <NavItem icon="pi-user" label="Profile" to="/profile" :collapsed="collapsed" exact />
      </template>

      <!-- Dev nav -->
      <template v-else-if="isDev">
        <NavItem icon="pi-home" label="Home" to="/dev" :collapsed="collapsed" exact />
        <NavDivider :collapsed="collapsed" label="Management" />
        <NavItem icon="pi-users" label="Users" to="/manage-users" :collapsed="collapsed" />
        <NavDivider :collapsed="collapsed" label="Account" />
        <NavItem icon="pi-user" label="Profile" to="/profile" :collapsed="collapsed" exact />
      </template>

    </nav>

    <!-- Bottom section -->
    <div class="shrink-0 border-t border-slate-100 dark:border-white/10 px-2 py-2 space-y-0.5">

      <!-- Notification bell -->
      <button
        ref="sidebarBellRef"
        class="relative w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        :class="collapsed ? 'justify-center' : ''"
        :title="collapsed ? 'Notifications' : undefined"
        @click="toggleNotifPanel"
      >
        <div class="relative shrink-0">
          <i class="pi pi-bell text-base"></i>
          <span
            v-if="notifStore.totalBadge > 0"
            class="absolute -top-1 -right-1 h-[14px] w-[14px] rounded-full bg-red-500"
            :class="collapsed ? '' : 'min-w-[18px] px-0.5 text-[9px] text-white font-bold flex items-center justify-center'"
          >
            <template v-if="!collapsed">{{ notifStore.totalBadge > 99 ? '99+' : notifStore.totalBadge }}</template>
          </span>
        </div>
        <Transition name="label-fade">
          <span v-if="!collapsed" class="text-sm font-medium">Notifications</span>
        </Transition>
        <Transition name="label-fade">
          <span
            v-if="!collapsed && notifStore.totalBadge > 0"
            class="ml-auto text-[10px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full"
          >{{ notifStore.totalBadge }}</span>
        </Transition>
      </button>

      <!-- Dark mode toggle -->
      <div
        class="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300"
        :class="collapsed ? 'justify-center' : ''"
      >
        <i class="pi pi-moon text-base shrink-0"></i>
        <Transition name="label-fade">
          <span v-if="!collapsed" class="text-sm font-medium flex-1">Dark Mode</span>
        </Transition>
        <Transition name="label-fade">
          <ToggleSwitch v-if="!collapsed" @click="toggleDark" class="shrink-0" />
        </Transition>
      </div>

      <!-- User info -->
      <div
        class="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl"
        :class="collapsed ? 'justify-center' : ''"
      >
        <div class="h-7 w-7 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0">
          <i class="pi pi-user text-slate-500 dark:text-slate-400 text-xs"></i>
        </div>
        <Transition name="label-fade">
          <div v-if="!collapsed" class="min-w-0">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate leading-tight">{{ props.firstName }} {{ props.lastName }}</p>
            <p class="text-[10px] text-slate-400 capitalize">{{ roleLabel }}</p>
          </div>
        </Transition>
      </div>

      <!-- Logout -->
      <button
        class="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        :class="collapsed ? 'justify-center' : ''"
        :title="collapsed ? 'Logout' : undefined"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out text-base shrink-0"></i>
        <Transition name="label-fade">
          <span v-if="!collapsed" class="text-sm font-medium">Logout</span>
        </Transition>
      </button>

    </div>
  </aside>

  <!-- Notification panel (teleported to body) -->
  <Teleport to="body">
    <Transition name="notif-drop">
      <div
        v-show="showNotifPanel"
        ref="notifPanelRef"
        class="fixed z-[200] w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
        :style="notifPanelStyle"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
            <span
              v-if="notifStore.totalBadge > 0"
              class="rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5"
            >{{ notifStore.totalBadge }}</span>
          </div>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" @click="showNotifPanel = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

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

        <div class="max-h-64 overflow-y-auto">
          <div v-if="notifStore.recentItems.length === 0" class="py-8 text-center">
            <i class="pi pi-check-circle text-emerald-400 text-2xl mb-2 block"></i>
            <p class="text-sm text-slate-400">You're all caught up!</p>
          </div>
          <button
            v-for="item in notifStore.recentItems"
            :key="item.id"
            class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0"
            @click="navigateTo(item.route)"
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

        <div class="flex divide-x divide-slate-100 dark:divide-white/10 border-t border-slate-100 dark:border-white/10">
          <button class="flex-1 py-2.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors" @click="navigateTo('/messages')">
            <i class="pi pi-comments mr-1 text-[10px]"></i> Messages
          </button>
          <button class="flex-1 py-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" @click="navigateTo('/inbox')">
            <i class="pi pi-envelope mr-1 text-[10px]"></i> Emails
          </button>
          <button v-if="isAdmin || isSuperAdmin" class="flex-1 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" @click="navigateTo('/scan')">
            <i class="pi pi-qrcode mr-1 text-[10px]"></i> Scan QR
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import ToggleSwitch from 'primevue/toggleswitch'
import Toast from 'primevue/toast'
import { useAuthTenantStore } from '../stores/authTenantStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useTenantStore } from '../stores/tenantStore'
import { useFeature } from '../composables/useFeature'
import { useSidebarState } from '../composables/useSidebarState'

const props = defineProps({
  firstName:     { type: String, default: '' },
  lastName:      { type: String, default: '' },
  tenantLogoUrl: { type: String, default: '' },
})

const authTenantStore = useAuthTenantStore()
const notifStore      = useNotificationStore()
const tenantStore     = useTenantStore()
const router          = useRouter()
const route           = useRoute()

const { isPatient, isAdmin, isSuperAdmin, isDev } = storeToRefs(authTenantStore)
const { tenant } = storeToRefs(tenantStore)
const { collapsed, toggle } = useSidebarState()
const { isEnabled } = useFeature()

const featureMessaging    = isEnabled('messaging')
const featureAppointments = isEnabled('appointments')
const featureQrScan       = isEnabled('qrScan')
const featureMails        = isEnabled('mails')
const featureVerification   = isEnabled('verifications')
const featureUsers        = isEnabled('users')

const mobileOpen      = ref(false)
const showNotifPanel  = ref(false)
const sidebarBellRef  = ref(null)
const mobileBellRef   = ref(null)
const notifPanelRef   = ref(null)
const isMobile        = ref(window.innerWidth < 1024)

const clinicName = computed(() => tenant.value?.name || tenant.value?.domain || 'Clinic Portal')

const roleLabel = computed(() => {
  if (isSuperAdmin.value) return 'Super Admin'
  if (isAdmin.value)      return 'Admin'
  if (isPatient.value)    return 'Patient'
  if (isDev.value)        return 'Developer'
  return ''
})

const notifPanelStyle = computed(() => {
  if (isMobile.value) {
    return { top: '56px', right: '16px', bottom: 'auto', left: 'auto' }
  }
  const left = collapsed.value ? '76px' : '268px'
  return { bottom: '16px', left, top: 'auto', right: 'auto' }
})

const toggleNotifPanel = () => { showNotifPanel.value = !showNotifPanel.value }

const navigateTo = (path) => {
  showNotifPanel.value = false
  mobileOpen.value = false
  router.push(path)
}

const handleLogout = () => {
  authTenantStore.logout()
  router.push('/signin')
}

const toggleDark = () => { document.documentElement.classList.toggle('my-app-dark') }

const handleClickOutside = (e) => {
  const inBell   = sidebarBellRef.value?.contains(e.target)
  const inMobile = mobileBellRef.value?.contains(e.target)
  const inPanel  = notifPanelRef.value?.contains(e.target)
  if (!inBell && !inMobile && !inPanel) showNotifPanel.value = false
}

const handleResize = () => { isMobile.value = window.innerWidth < 1024 }

let notifInterval = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  window.addEventListener('resize', handleResize)
  notifStore.poll()
  notifInterval = setInterval(() => notifStore.poll(), 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  window.removeEventListener('resize', handleResize)
  if (notifInterval) clearInterval(notifInterval)
})
</script>

<!-- NavItem and NavDivider as inline components -->
<script>
import { defineComponent, h, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const NavItem = defineComponent({
  name: 'NavItem',
  props: {
    icon:      { type: String, required: true },
    label:     { type: String, required: true },
    to:        { type: String, required: true },
    collapsed: { type: Boolean, default: false },
    badge:     { type: Number, default: 0 },
    exact:     { type: Boolean, default: false },
  },
  setup(props) {
    const route  = useRoute()
    const router = useRouter()
    const isActive = computed(() =>
      props.exact ? route.path === props.to : route.path.startsWith(props.to)
    )
    return { isActive, navigate: () => router.push(props.to) }
  },
  render() {
    const active = this.isActive
    const base = 'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors text-sm font-medium'
    const cls = active
      ? `${base} bg-[var(--brand)] text-white shadow-sm`
      : `${base} text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10`

    return h('button', {
      class: [cls, this.collapsed ? 'justify-center' : ''],
      title: this.collapsed ? this.label : undefined,
      onClick: this.navigate,
    }, [
      h('div', { class: 'relative shrink-0' }, [
        h('i', { class: `pi ${this.icon} text-base` }),
        this.badge > 0
          ? h('span', {
              class: this.collapsed
                ? 'absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500'
                : 'absolute -top-1 -right-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none',
            }, this.collapsed ? [] : [this.badge > 99 ? '99+' : String(this.badge)])
          : null,
      ]),
      !this.collapsed
        ? h('span', { class: 'truncate' }, this.label)
        : null,
      !this.collapsed && this.badge > 0
        ? h('span', {
            class: 'ml-auto text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full',
          }, this.badge > 99 ? '99+' : String(this.badge))
        : null,
    ])
  },
})

export const NavDivider = defineComponent({
  name: 'NavDivider',
  props: {
    label:     { type: String, required: true },
    collapsed: { type: Boolean, default: false },
  },
  render() {
    if (this.collapsed) {
      return h('div', { class: 'my-1.5 mx-2 border-t border-slate-100 dark:border-white/10' })
    }
    return h('div', { class: 'pt-3 pb-1 px-2.5' }, [
      h('span', { class: 'text-[10px] font-semibold uppercase tracking-widest text-slate-400' }, this.label),
    ])
  },
})
</script>

<style scoped>
.label-fade-enter-active {
  transition: opacity 0.15s ease 0.1s;
}
.label-fade-leave-active {
  transition: opacity 0.08s ease;
}
.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
}

.notif-drop-enter-active,
.notif-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.notif-drop-enter-from,
.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}
</style>
