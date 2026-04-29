<template>
  <Transition name="checklist-fade">
    <div
      v-if="visible && !allDone"
      class="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-500/5 dark:to-cyan-500/5 p-5 shadow-sm"
    >
      <div class="flex items-start justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
            <i class="pi pi-list-check text-blue-500 text-sm"></i>
          </div>
          <div>
            <p class="text-sm font-bold text-slate-800 dark:text-white">Setup Checklist</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ doneCount }}/{{ steps.length }} complete</p>
          </div>
        </div>
        <button
          @click="visible = false"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          aria-label="Dismiss checklist"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <div class="h-1.5 w-full rounded-full bg-blue-100 dark:bg-blue-500/20 overflow-hidden mb-4">
        <div
          class="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <ul class="space-y-2">
        <li
          v-for="step in steps"
          :key="step.key"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
          :class="step.done
            ? 'bg-emerald-50/80 dark:bg-emerald-500/10'
            : 'bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 cursor-pointer'"
          @click="!step.done && $router.push(step.route)"
        >
          <div class="shrink-0 h-5 w-5 rounded-full flex items-center justify-center"
            :class="step.done ? 'bg-emerald-500' : 'border-2 border-slate-200 dark:border-white/20'">
            <i v-if="step.done" class="pi pi-check text-white text-[9px]"></i>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold"
              :class="step.done ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-70' : 'text-slate-800 dark:text-slate-100'">
              {{ step.label }}
            </p>
            <p v-if="!step.done" class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{{ step.description }}</p>
          </div>
          <i v-if="!step.done" class="pi pi-chevron-right text-slate-300 dark:text-white/20 text-xs shrink-0"></i>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTenantStore } from '../stores/tenantStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  patientCount:    { type: Number, default: 0 },
  staffCount:      { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
})

const tenantStore = useTenantStore()
const { tenant } = storeToRefs(tenantStore)

const visible = ref(true)

const steps = computed(() => [
  {
    key: 'verify',
    label: 'Verify your email',
    description: 'Check your inbox for the verification link we sent on signup.',
    done: props.isEmailVerified,
    route: '/profile',
  },
  {
    key: 'logo',
    label: 'Upload clinic logo',
    description: 'Add your clinic logo for a professional, branded experience.',
    done: !!tenant.value?.tenantLogo?.url,
    route: '/profile',
  },
  {
    key: 'branding',
    label: 'Set clinic branding',
    description: 'Configure your brand color, address, and contact details.',
    done: !!(tenant.value?.branding?.phone || tenant.value?.branding?.address || tenant.value?.branding?.email),
    route: '/profile',
  },
  {
    key: 'staff',
    label: 'Add your first staff member',
    description: 'Invite an admin to help manage patients and appointments.',
    done: props.staffCount > 1,
    route: '/users',
  },
  {
    key: 'patient',
    label: 'Register your first patient',
    description: 'Add a patient account so they can access the portal.',
    done: props.patientCount > 0,
    route: '/users',
  },
])

const doneCount = computed(() => steps.value.filter(s => s.done).length)
const allDone   = computed(() => doneCount.value === steps.value.length)
const progress  = computed(() => Math.round((doneCount.value / steps.value.length) * 100))
</script>

<style scoped>
.checklist-fade-enter-active,
.checklist-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.checklist-fade-enter-from,
.checklist-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
