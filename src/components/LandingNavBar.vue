<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 shrink-0 group">
           <Avatar image="/myclinicaccess_logo.svg" size="large"/>
          <div class="leading-tight">
            <span class="font-bold text-slate-800 text-sm block">My Clinic Access</span>
            <span class="text-[10px] font-semibold text-blue-600 uppercase tracking-widest block">myclinicaccess.com</span>
          </div>
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-0.5">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            :class="isActive(link.to)
              ? 'text-blue-600 bg-blue-50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- Desktop CTAs -->
        <div class="hidden md:flex items-center gap-2">
          <router-link
            to="/signin"
            class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            Sign In
          </router-link>
          <router-link
            to="/get-started"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 active:scale-95 transition-all duration-150"
          >
            <i class="pi pi-star text-xs"></i>
            Get Started Free
          </router-link>
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <i :class="mobileOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="md:hidden border-t border-slate-100 bg-white shadow-lg">
        <div class="px-4 py-3 space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="isActive(link.to)
              ? 'text-blue-600 bg-blue-50'
              : 'text-slate-700 hover:bg-slate-50'"
          >
            <i :class="link.icon" class="text-xs w-4 text-center"></i>
            {{ link.label }}
          </router-link>
        </div>
        <div class="px-4 pb-4 pt-2 border-t border-slate-100 space-y-2">
          <router-link
            to="/signin"
            class="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Sign In to Your Portal
          </router-link>
          <router-link
            to="/get-started"
            class="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md"
          >
            Get Started Free
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const mobileOpen = ref(false)

const navLinks = [
  { to: '/',            label: 'Home',         icon: 'pi pi-home' },
  { to: '/features',    label: 'Features',      icon: 'pi pi-th-large' },
  { to: '/pricing',     label: 'Pricing',       icon: 'pi pi-tag' },
  { to: '/how-it-works',label: 'How It Works',  icon: 'pi pi-list' },
  { to: '/faq',         label: 'FAQ',           icon: 'pi pi-question-circle' },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>
