<template>
  <div class="flex flex-col min-h-screen
           bg-gradient-to-br from-white via-blue-50 to-blue-200
           dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
           dark:text-gray-200">
    <DevNavBar />

    <main class="flex-1 p-4">
      <slot />
      <router-view />
    </main>
  </div>

  <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
    <div
      class="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
      <p>My Clinic Access — Internal Tools</p>
      <p>© 2026 My Clinic Access. All rights reserved.</p>
      <div class="flex gap-4 mt-2 sm:mt-0">
        <a href="#" class="hover:text-primary">Privacy Policy</a>
        <a href="#" class="hover:text-primary">Terms</a>
        <a href="#" class="hover:text-primary">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import DevNavBar from '../components/DevNavBar.vue';
</script>
