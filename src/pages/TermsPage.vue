<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">

      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-file-edit"></i> Legal
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Terms &amp; Conditions</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Version 2026-05-v1 &mdash; Effective May 2026 &mdash; By using My Clinic Access, you agree to these terms.
        </p>
      </div>

      <TermsContent />

    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
import TermsContent from '../components/legal/TermsContent.vue'
</script>
