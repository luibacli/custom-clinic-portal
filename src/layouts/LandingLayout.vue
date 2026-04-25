<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900">
    <LandingNavBar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import LandingNavBar from '../components/LandingNavBar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
