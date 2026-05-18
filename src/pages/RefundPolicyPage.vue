<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">

      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-credit-card"></i> Legal
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Refund &amp; Cancellation Policy</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Version 2026-05-v1 &mdash; Effective May 2026 &mdash; Applies to all clinic subscriptions and SMS credit purchases.
        </p>
      </div>

      <RefundContent />

    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
import RefundContent from '../components/legal/RefundContent.vue'
</script>
