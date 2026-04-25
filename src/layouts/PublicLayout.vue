<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 dark:text-slate-100">

    <!-- Minimal Public Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <router-link to="/signin" class="flex items-center gap-2 group">
          <CareBoardSVG class="h-7 w-7 text-blue-600" />
          <span class="font-bold text-slate-800 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
            Custom Clinic Portal PH
          </span>
        </router-link>

        <router-link
          to="/signin"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs"></i>
          Back to Login
        </router-link>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import CareBoardSVG from '../components/CareBoardSVG.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
