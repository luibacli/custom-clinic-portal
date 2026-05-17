<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">

      <!-- Page Header -->
      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-credit-card"></i> Legal
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Refund &amp; Cancellation Policy</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Version 2026-05-v1 &mdash; Effective May 2026 &mdash; Applies to all clinic subscriptions and SMS credit purchases.
        </p>
      </div>

      <!-- Notice Banner -->
      <div class="mb-8 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-5 flex items-start gap-3">
        <i class="pi pi-info-circle text-amber-600 dark:text-amber-400 text-lg mt-0.5 shrink-0"></i>
        <div>
          <p class="text-sm font-bold text-amber-800 dark:text-amber-300">Before You Subscribe</p>
          <p class="mt-1 text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            Please review this policy carefully before purchasing a subscription or SMS credits. By completing a payment,
            you confirm that you have read and agree to the terms below. All plans include a 30-day free trial &mdash;
            no credit card is required during the trial period.
          </p>
        </div>
      </div>

      <div class="space-y-6">

        <!-- Section 1: Free Trial -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
              <i class="pi pi-star"></i>
            </span>
            1. Free Trial
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <i class="pi pi-check-circle text-emerald-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">All new clinic accounts receive a <strong>30-day free trial</strong> with no credit card required.</p>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <i class="pi pi-check-circle text-emerald-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">No charges are made during the trial period. Access ends automatically at trial expiry if no subscription is activated.</p>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <i class="pi pi-check-circle text-emerald-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">Data entered during the trial is retained for 30 days after trial expiry, then permanently deleted.</p>
            </div>
          </div>
        </section>

        <!-- Section 2: Monthly Subscriptions -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <i class="pi pi-calendar"></i>
            </span>
            2. Monthly Subscriptions
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                <i class="pi pi-refresh text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Billing Cycle</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Monthly subscriptions are billed in advance on the same date each month. A renewal reminder email is sent
                  to the registered clinic email address at least 7 days before the billing date.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0">
                <i class="pi pi-times-circle text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Cancellation</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  You may cancel at any time from your Billing page. Cancellation takes effect at the end of the current
                  billing period. <strong>No refund is issued for the remaining days of the current period.</strong>
                  Access continues until the period ends.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
                <i class="pi pi-exclamation-triangle text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Failed Payments</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  If a payment fails, the subscription enters a <strong>7-day grace period</strong> during which access is maintained.
                  If payment is not settled within the grace period, the portal is suspended. Access is restored immediately upon successful payment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Annual Subscriptions -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">
              <i class="pi pi-calendar-plus"></i>
            </span>
            3. Annual Subscriptions
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
                <i class="pi pi-check text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Early Cancellation Refund</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Annual plans cancelled within <strong>14 days of payment</strong> are eligible for a prorated refund
                  for the unused months, less any transaction fees charged by the payment provider. Requests must be submitted
                  via the Contact page within the 14-day window.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
                <i class="pi pi-times text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">After 14 Days</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  No refund is available for annual plans cancelled after 14 days of the payment date. Access continues until the annual period ends.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4: SMS Credits -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">
              <i class="pi pi-comment"></i>
            </span>
            4. SMS Credits
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
              <i class="pi pi-times-circle text-red-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">
                <strong>SMS credits are non-refundable</strong> once purchased, regardless of whether they have been used.
              </p>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <i class="pi pi-info-circle text-amber-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">
                Credits that fail to send due to carrier errors are automatically refunded to your credit balance, not to the original payment method.
              </p>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <i class="pi pi-info-circle text-amber-500 mt-0.5 shrink-0"></i>
              <p class="text-slate-700 dark:text-slate-300">
                Unused SMS credits are <strong>not transferable</strong> to other clinic accounts and are forfeited upon account termination.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 5: Plan Changes -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm">
              <i class="pi pi-arrows-v"></i>
            </span>
            5. Plan Changes
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="pi pi-arrow-up text-emerald-500 mt-0.5 shrink-0"></i>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Upgrades</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1">Upgrades take effect immediately. The difference in price is prorated for the remaining billing period.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="pi pi-arrow-down text-amber-500 mt-0.5 shrink-0"></i>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Downgrades</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1">Downgrades take effect at the start of the next billing period. No refund is issued for the difference in the current period.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 6: How to Request -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm">
              <i class="pi pi-envelope"></i>
            </span>
            6. How to Request a Refund
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            If you believe you are eligible for a refund under this policy, submit a request through our
            <router-link to="/contact" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Contact page</router-link>
            within the applicable window. Include the following:
          </p>
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
              Your registered clinic name and email address
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
              The transaction reference or PayMongo payment ID
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
              The reason for the refund request
            </li>
          </ul>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Refund requests are reviewed within 5 business days. Approved refunds are returned to the original payment method within 7–14 business days,
            depending on your bank or card issuer.
          </p>
        </section>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
</script>
