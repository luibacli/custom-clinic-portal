<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">

      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-shield"></i> Legal
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Version 2026-05-v1 &mdash; Effective May 2026 &mdash; Applies to all users of My Clinic Access.
        </p>
      </div>

      <PrivacyContent />

    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
import PrivacyContent from '../components/legal/PrivacyContent.vue'
</script>
