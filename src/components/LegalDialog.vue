<template>
  <Dialog
    v-model:visible="modelVisible"
    modal
    :draggable="false"
    maximizable
    :style="{ width: 'min(820px, 96vw)' }"
  >
    <template #header>
      <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
        <span class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" :class="config.iconClass">
          <i :class="config.icon" class="text-sm"></i>
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900 text-sm leading-tight truncate">{{ config.title }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ config.subtitle }}</p>
        </div>
        <a
          :href="config.route"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
          title="Open in full page"
          @click.stop
        >
          <i class="pi pi-external-link text-[10px]"></i>
          <span class="hidden sm:inline">Full page</span>
        </a>
      </div>
    </template>

    <!-- Scrollable content area -->
    <div class="overflow-y-auto px-6 sm:px-8 py-6" style="max-height: calc(82vh - 130px);">
      <Suspense>
        <component :is="config.component" />
        <template #fallback>
          <div class="flex items-center justify-center py-20 text-slate-400">
            <i class="pi pi-spinner pi-spin text-2xl"></i>
          </div>
        </template>
      </Suspense>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs text-slate-400 hidden sm:block">
          Read the full policy at
          <a :href="config.route" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">myclinicaccess.com{{ config.route }}</a>
        </p>
        <Button label="Close" severity="secondary" outlined @click="modelVisible = false" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  policy:  { type: String,  default: 'terms' },
})
const emit = defineEmits(['update:visible'])

const modelVisible = computed({
  get:  () => props.visible,
  set: (val) => emit('update:visible', val),
})

const TermsContent   = defineAsyncComponent(() => import('./legal/TermsContent.vue'))
const PrivacyContent = defineAsyncComponent(() => import('./legal/PrivacyContent.vue'))
const RefundContent  = defineAsyncComponent(() => import('./legal/RefundContent.vue'))

const CONFIGS = {
  terms: {
    title:     'Terms & Conditions',
    subtitle:  'Version 2026-05-v1 — Effective May 2026',
    icon:      'pi pi-file-edit',
    iconClass: 'bg-purple-100 text-purple-600',
    route:     '/terms',
    component: TermsContent,
  },
  privacy: {
    title:     'Privacy Policy',
    subtitle:  'Version 2026-05-v1 — Effective May 2026',
    icon:      'pi pi-shield',
    iconClass: 'bg-blue-100 text-blue-600',
    route:     '/privacy',
    component: PrivacyContent,
  },
  refund: {
    title:     'Refund & Cancellation Policy',
    subtitle:  'Version 2026-05-v1 — Effective May 2026',
    icon:      'pi pi-credit-card',
    iconClass: 'bg-green-100 text-green-600',
    route:     '/refund-policy',
    component: RefundContent,
  },
}

const config = computed(() => CONFIGS[props.policy] ?? CONFIGS.terms)
</script>
