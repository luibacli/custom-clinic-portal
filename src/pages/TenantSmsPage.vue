<template>
  <Toast />

  <div class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 space-y-5">

    <!-- Header -->
    <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shrink-0">
            <i class="pi pi-megaphone text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">SMS Broadcast</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Send a text message to all your patients at once.</p>
          </div>
        </div>

        <!-- Credit balance + buy button -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-3 rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-sm px-5 py-3">
            <div class="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-wallet text-blue-500 text-sm"></i>
            </div>
            <div>
              <p class="text-xs text-slate-400 dark:text-slate-500 leading-none">SMS Credits</p>
              <p class="text-xl font-bold text-slate-800 dark:text-white leading-tight mt-0.5">
                <span v-if="statsLoading" class="inline-block h-5 w-14 rounded bg-slate-200 dark:bg-white/10 animate-pulse align-middle"></span>
                <span v-else>{{ smsStore.credits.toLocaleString() }}</span>
              </p>
            </div>
          </div>
          <Button
            label="Buy Credits"
            icon="pi pi-plus-circle"
            class="rounded-2xl font-semibold whitespace-nowrap"
            @click="openShop"
          />
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <i class="pi pi-users text-base"></i>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Eligible Recipients</p>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              <span v-if="statsLoading" class="inline-block h-6 w-12 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></span>
              <span v-else>{{ smsStore.recipients.toLocaleString() }}</span>
            </h2>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Active patients with a phone number</p>
      </div>

      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <i class="pi pi-send text-base"></i>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Total Broadcasts</p>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              <span v-if="smsStore.loading && !smsStore.total" class="inline-block h-6 w-12 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></span>
              <span v-else>{{ smsStore.total.toLocaleString() }}</span>
            </h2>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">SMS campaigns sent to patients</p>
      </div>

      <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg p-5">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
            <i class="pi pi-mobile text-base"></i>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.15em] text-slate-400">Sender Name</p>
            <h2 class="text-base font-bold text-slate-800 dark:text-white mt-0.5 truncate max-w-[140px]">MClinicAccess</h2>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Platform sender · one-way broadcast</p>
      </div>
    </div>

    <!-- Main Panel -->
    <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

      <!-- Panel header + tabs -->
      <div class="px-5 md:px-6 py-4 border-b border-slate-100/80 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-800 dark:text-white">Broadcast Center</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Compose a message or review past broadcasts.</p>
        </div>
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1 w-fit shrink-0">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            :class="activeTab === tab.key
              ? 'bg-white dark:bg-white/15 shadow text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ── COMPOSE TAB ── -->
      <div v-if="activeTab === 'compose'" class="p-5 md:p-6 space-y-5">

        <!-- Recipients bar -->
        <div class="flex items-center gap-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/5 px-4 py-3.5">
          <div class="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <i class="pi pi-users text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-white">
              {{ smsStore.recipients.toLocaleString() }} eligible patient{{ smsStore.recipients !== 1 ? 's' : '' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active · verified · has phone number · not opted out</p>
          </div>
          <Tag v-if="smsStore.recipients === 0" value="No recipients" severity="warn" rounded />
        </div>

        <!-- Message area -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Your Message
          </label>
          <textarea
            v-model="message"
            :maxlength="maxMessageLength"
            rows="5"
            placeholder="Type your message here…"
            class="w-full resize-none rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition leading-relaxed"
          />
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-200"
                :class="charBarColor"
                :style="{ width: `${Math.min((charsUsed / maxMessageLength) * 100, 100)}%` }"
              />
            </div>
            <p class="text-xs text-slate-400 shrink-0">
              <span :class="charsUsed >= maxMessageLength ? 'text-red-500 font-semibold' : ''">{{ charsUsed }}</span>
              / {{ maxMessageLength }} chars
            </p>
          </div>
        </div>

        <!-- Live preview -->
        <Transition name="preview-fade">
          <div v-if="message.trim()" class="space-y-2">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Message Preview</p>
            <div class="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 px-4 py-4">
              <div class="flex items-end gap-2">
                <div class="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center shrink-0">
                  <i class="pi pi-mobile text-xs"></i>
                </div>
                <div class="max-w-xs rounded-2xl rounded-bl-md bg-slate-200 dark:bg-white/15 px-3.5 py-2.5">
                  <p class="text-xs text-slate-800 dark:text-white leading-relaxed break-words">
                    <span class="font-bold text-blue-600 dark:text-blue-400">[{{ clinicName }}]</span>
                    {{ ' ' + message.trim() }}
                  </p>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 mt-3 text-right">
                {{ finalMessage.length }} / 160 characters total
                <span v-if="finalMessage.length > 160" class="text-red-500 font-medium ml-1">· Exceeds limit</span>
              </p>
            </div>
          </div>
        </Transition>

        <!-- Cost row -->
        <div
          v-if="smsStore.recipients > 0 && message.trim()"
          class="rounded-2xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
          :class="hasEnoughCredits
            ? 'border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/5'
            : 'border-red-200 dark:border-red-500/30 bg-red-50/60 dark:bg-red-500/5'"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
              :class="hasEnoughCredits ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' : 'bg-red-100 dark:bg-red-500/10 text-red-500'"
            >
              <i :class="hasEnoughCredits ? 'pi pi-credit-card' : 'pi pi-exclamation-circle'" class="text-sm"></i>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">
                {{ smsStore.recipients.toLocaleString() }} credits required
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <template v-if="hasEnoughCredits">
                  {{ (smsStore.credits - smsStore.recipients).toLocaleString() }} credits remaining after send
                </template>
                <template v-else>
                  You need {{ (smsStore.recipients - smsStore.credits).toLocaleString() }} more credits —
                  <button class="text-blue-600 dark:text-blue-400 font-semibold hover:underline" @click="openShop">Buy now</button>
                </template>
              </p>
            </div>
          </div>
          <Tag
            :value="hasEnoughCredits ? 'Ready to send' : 'Insufficient credits'"
            :severity="hasEnoughCredits ? 'success' : 'danger'"
            rounded
            class="shrink-0"
          />
        </div>

        <!-- Send button -->
        <Button
          :disabled="!canSend"
          :loading="smsStore.sending"
          label="Send to All Patients"
          icon="pi pi-send"
          class="w-full rounded-2xl font-semibold"
          :class="!canSend ? 'opacity-50' : ''"
          @click="openConfirm"
        />

        <!-- No recipients hint -->
        <div
          v-if="smsStore.recipients === 0 && !statsLoading"
          class="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/5 px-4 py-3.5"
        >
          <i class="pi pi-info-circle text-amber-500 text-sm mt-0.5 shrink-0"></i>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            No eligible recipients found. Patients must be <span class="font-semibold">active</span>, <span class="font-semibold">email-verified</span>, and have a <span class="font-semibold">phone number</span> registered on their profile.
          </p>
        </div>
      </div>

      <!-- ── HISTORY TAB ── -->
      <div v-else class="overflow-hidden">
        <div v-if="smsStore.loading && !smsStore.blasts.length" class="p-5 md:p-6 space-y-3">
          <div v-for="n in 4" :key="n" class="h-16 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
        </div>

        <div v-else-if="!smsStore.blasts.length" class="flex flex-col items-center justify-center py-20 text-center px-4">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-500/15 text-blue-500 dark:text-blue-300 flex items-center justify-center mb-4">
            <i class="pi pi-megaphone text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-white">No broadcasts yet</h3>
          <p class="mt-1 text-sm text-slate-400 max-w-xs">Your sent SMS broadcasts will appear here once you send your first message.</p>
          <button class="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline" @click="activeTab = 'compose'">
            Compose a message →
          </button>
        </div>

        <ul v-else class="divide-y divide-slate-100/80 dark:divide-white/5">
          <li
            v-for="blast in smsStore.blasts"
            :key="blast._id"
            class="flex items-start gap-4 px-5 md:px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
          >
            <div class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" :class="blastIconBg(blast.status)">
              <i class="text-sm" :class="blastIcon(blast.status)"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">{{ blast.message }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span class="text-xs text-slate-400">{{ formatDate(blast.createdAt) }}</span>
                <span class="text-slate-300 dark:text-white/20 text-xs">·</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  <i class="pi pi-users text-[10px] mr-0.5"></i>{{ blast.recipientCount.toLocaleString() }} patients
                </span>
                <span v-if="blast.failedCount > 0" class="text-xs text-amber-500">
                  <i class="pi pi-exclamation-circle text-[10px] mr-0.5"></i>{{ blast.failedCount }} failed
                </span>
              </div>
            </div>
            <Tag :value="statusLabel(blast.status)" :severity="statusSeverity(blast.status)" rounded class="shrink-0 mt-0.5" />
          </li>
        </ul>

        <div v-if="smsStore.pages > 1" class="flex items-center justify-between px-5 md:px-6 py-3.5 border-t border-slate-100/80 dark:border-white/5">
          <button
            :disabled="smsStore.page <= 1"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="changePage(smsStore.page - 1)"
          ><i class="pi pi-chevron-left text-[10px]"></i> Previous</button>
          <span class="text-xs text-slate-400">Page {{ smsStore.page }} of {{ smsStore.pages }}</span>
          <button
            :disabled="smsStore.page >= smsStore.pages"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="changePage(smsStore.page + 1)"
          >Next <i class="pi pi-chevron-right text-[10px]"></i></button>
        </div>
      </div>
    </div>

    <!-- PDPA note -->
    <div class="rounded-3xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-5">
      <div class="flex items-start gap-3">
        <div class="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
          <i class="pi pi-shield text-sm"></i>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-800 dark:text-white">PDPA Notice (RA 10173)</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            SMS is sent only to patients who have a registered phone number. Patients may opt out at any time. Messages are sent from the platform sender name <span class="font-medium text-slate-700 dark:text-slate-300">MClinicAccess</span> — one-way broadcast only.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       CREDIT SHOP DIALOG
  ════════════════════════════════════════════════════════════ -->
  <Dialog
    v-model:visible="shopVisible"
    modal
    :draggable="false"
    :closable="!shopLoading"
    :style="{ width: 'min(860px, 95vw)' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
          <i class="pi pi-wallet text-sm"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">Buy SMS Credits</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Credits never expire · used only when you send</p>
        </div>
      </div>
    </template>

    <div class="pt-2 space-y-5">
      <!-- Current balance -->
      <div class="flex items-center gap-2 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 px-4 py-3">
        <i class="pi pi-wallet text-blue-500 text-sm"></i>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Current balance: <span class="font-bold text-slate-900 dark:text-white">{{ smsStore.credits.toLocaleString() }} credits</span>
        </p>
      </div>

      <!-- Package cards -->
      <div v-if="smsStore.packages.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="pkg in smsStore.packages"
          :key="pkg.key"
          class="relative rounded-2xl border p-5 flex flex-col gap-3 transition-all cursor-pointer group"
          :class="selectedPackage === pkg.key
            ? 'border-blue-400 dark:border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4)] bg-blue-50/60 dark:bg-blue-500/5'
            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-md'"
          @click="selectedPackage = pkg.key"
        >
          <!-- Best value badge -->
          <div v-if="pkg.tag" class="absolute -top-3 left-4">
            <span class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-bold px-3 py-1 shadow">
              <i class="pi pi-star-fill text-[9px]"></i> {{ pkg.tag }}
            </span>
          </div>

          <!-- Selected indicator -->
          <div v-if="selectedPackage === pkg.key" class="absolute top-3 right-3">
            <div class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
              <i class="pi pi-check text-white text-[10px]"></i>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">{{ pkg.credits >= 1000 ? (pkg.credits / 1000).toFixed(0) + 'K' : pkg.credits }} SMS</p>
            <p class="mt-1 text-3xl font-black text-slate-900 dark:text-white">₱{{ pkg.amount.toLocaleString() }}</p>
            <p class="text-xs text-slate-400 mt-0.5">₱{{ pkg.perSms }} per SMS</p>
          </div>

          <!-- Progress bar visual (relative cost indicator) -->
          <div class="h-1 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
              :style="{ width: `${Math.round((1 - (parseFloat(pkg.perSms) - 0.60) / 0.45) * 100)}%` }"
            />
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ pkg.credits.toLocaleString() }} messages</p>
        </div>
      </div>

      <!-- Loading packages skeleton -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="h-36 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
      </div>

      <!-- Inline note -->
      <div class="flex items-start gap-2 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/5 px-4 py-3">
        <i class="pi pi-info-circle text-amber-500 text-sm mt-0.5 shrink-0"></i>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Credits are added to your balance immediately after payment is confirmed. Failed sends are automatically refunded.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 pt-1">
        <button
          :disabled="shopLoading"
          class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50"
          @click="shopVisible = false"
        >Cancel</button>
        <Button
          :disabled="!selectedPackage || shopLoading"
          :loading="shopLoading"
          label="Proceed to Payment"
          icon="pi pi-arrow-right"
          icon-pos="right"
          class="flex-1 rounded-xl font-semibold"
          @click="handleCheckout"
        />
      </div>
    </template>
  </Dialog>

  <!-- ═══════════════════════════════════════════════════════
       PAYMENT PROCESSING DIALOG
  ════════════════════════════════════════════════════════════ -->
  <Dialog
    v-model:visible="paymentModal.visible"
    :closable="paymentModal.state === 'success'"
    modal
    :draggable="false"
    :pt="{
      root: { class: 'rounded-2xl shadow-2xl border-0 overflow-hidden w-full max-w-sm mx-4' },
      header: { class: 'hidden' },
      content: { class: 'p-0' },
    }"
  >
    <!-- Processing state -->
    <div v-if="paymentModal.state === 'processing'" class="flex flex-col items-center text-center px-8 py-10 gap-5 bg-white dark:bg-slate-900">
      <div class="relative h-16 w-16">
        <div class="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-500/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="pi pi-wallet text-blue-500 text-xl"></i>
        </div>
      </div>
      <div>
        <p class="text-base font-bold text-slate-900 dark:text-white">Waiting for Payment</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Complete your payment in the checkout tab. This page updates automatically.</p>
      </div>
      <div class="w-full rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-3 text-left">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Adding to your balance</p>
        <p class="text-sm font-bold text-slate-900 dark:text-white">{{ paymentModal.credits.toLocaleString() }} SMS Credits — ₱{{ paymentModal.amount.toLocaleString() }}</p>
      </div>
      <a
        v-if="paymentModal.checkoutUrl"
        :href="paymentModal.checkoutUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors"
      >
        <i class="pi pi-external-link mr-1 text-[10px]"></i>Reopen payment tab
      </a>
      <p class="text-[11px] text-slate-400">Checking for confirmation every few seconds…</p>
    </div>

    <!-- Success state -->
    <div v-else-if="paymentModal.state === 'success'" class="flex flex-col items-center text-center px-8 py-10 gap-5 bg-white dark:bg-slate-900">
      <div class="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
        <i class="pi pi-check text-emerald-500 text-2xl"></i>
      </div>
      <div>
        <p class="text-base font-bold text-slate-900 dark:text-white">Credits Added!</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ paymentModal.credits.toLocaleString() }} SMS credits</span> have been added to your balance.
        </p>
      </div>
      <div class="w-full rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">New balance</p>
        <p class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{ smsStore.credits.toLocaleString() }} credits</p>
      </div>
      <p class="text-[11px] text-slate-400">Closing in {{ countdown }}s…</p>
      <button
        class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
        @click="closePaymentModal"
      >Done</button>
    </div>
  </Dialog>

  <!-- ═══════════════════════════════════════════════════════
       BLAST CONFIRM DIALOG
  ════════════════════════════════════════════════════════════ -->
  <Dialog
    v-model:visible="confirmVisible"
    modal
    :draggable="false"
    :closable="!smsStore.sending"
    :style="{ width: 'min(420px, 95vw)' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center">
          <i class="pi pi-send text-sm"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">Confirm Broadcast</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Review before sending</p>
        </div>
      </div>
    </template>

    <div class="space-y-4 pt-1">
      <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-400 mb-3">Message preview</p>
        <div class="flex items-end gap-2">
          <div class="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center shrink-0">
            <i class="pi pi-mobile text-xs"></i>
          </div>
          <div class="max-w-xs rounded-2xl rounded-bl-md bg-slate-200 dark:bg-white/15 px-3.5 py-2.5">
            <p class="text-xs text-slate-800 dark:text-white leading-relaxed break-words">
              <span class="font-bold text-blue-600 dark:text-blue-400">[{{ clinicName }}]</span>
              {{ ' ' + message.trim() }}
            </p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-3.5 text-center">
          <p class="text-2xl font-bold text-slate-800 dark:text-white">{{ smsStore.recipients.toLocaleString() }}</p>
          <p class="text-[11px] text-slate-400 mt-1">Recipients</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-3.5 text-center">
          <p class="text-2xl font-bold text-slate-800 dark:text-white">{{ smsStore.recipients.toLocaleString() }}</p>
          <p class="text-[11px] text-slate-400 mt-1">Credits used</p>
        </div>
      </div>
      <div class="flex items-start gap-2 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/5 px-4 py-3">
        <i class="pi pi-info-circle text-amber-500 text-xs mt-0.5 shrink-0"></i>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Credits are deducted when the blast is confirmed. Failed sends are automatically refunded.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 pt-1">
        <button
          :disabled="smsStore.sending"
          class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50"
          @click="confirmVisible = false"
        >Cancel</button>
        <Button
          :loading="smsStore.sending"
          label="Confirm Send"
          icon="pi pi-send"
          class="flex-1 rounded-xl font-semibold"
          @click="confirmSend"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast   from 'primevue/toast'
import Dialog  from 'primevue/dialog'
import Button  from 'primevue/button'
import Tag     from 'primevue/tag'
import { useSmsStore }    from '../stores/smsStore'
import { useTenantStore } from '../stores/tenantStore'
import { storeToRefs }    from 'pinia'

const smsStore    = useSmsStore()
const tenantStore = useTenantStore()
const toast       = useToast()

const { tenant } = storeToRefs(tenantStore)
const clinicName  = computed(() => tenant.value?.name || 'Your Clinic')

// ── Message ──────────────────────────────────────────────
const SMS_MAX_TOTAL    = 160
const prefixLength     = computed(() => `[${clinicName.value}] `.length)
const maxMessageLength = computed(() => SMS_MAX_TOTAL - prefixLength.value)

const tabs       = [{ key: 'compose', label: 'Compose' }, { key: 'history', label: 'History' }]
const activeTab  = ref('compose')
const message    = ref('')
const statsLoading = ref(true)

const charsUsed    = computed(() => message.value.length)
const finalMessage = computed(() => `[${clinicName.value}] ${message.value.trim()}`)
const hasEnoughCredits = computed(() => smsStore.credits >= smsStore.recipients)

const canSend = computed(() =>
  message.value.trim().length > 0 &&
  charsUsed.value <= maxMessageLength.value &&
  finalMessage.value.length <= 160 &&
  smsStore.recipients > 0 &&
  hasEnoughCredits.value &&
  !smsStore.sending
)

const charBarColor = computed(() => {
  const pct = charsUsed.value / maxMessageLength.value
  if (pct >= 1)   return 'bg-red-500'
  if (pct >= 0.9) return 'bg-amber-500'
  return 'bg-blue-500'
})

// ── Blast confirm ─────────────────────────────────────────
const confirmVisible = ref(false)
const openConfirm    = () => { confirmVisible.value = true }

const confirmSend = async () => {
  const result = await smsStore.sendBlast(message.value.trim())
  confirmVisible.value = false
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Broadcast sent', detail: result.message, life: 4000 })
    message.value = ''
    await smsStore.fetchStats()
    await smsStore.fetchBlasts()
    activeTab.value = 'history'
  } else {
    toast.add({ severity: 'error', summary: 'Failed to send', detail: result.message, life: 5000 })
  }
}

// ── Credit shop ───────────────────────────────────────────
const shopVisible      = ref(false)
const shopLoading      = ref(false)
const selectedPackage  = ref(null)

const openShop = async () => {
  selectedPackage.value = null
  shopVisible.value = true
  if (!smsStore.packages.length) await smsStore.fetchPackages()
}

const handleCheckout = async () => {
  if (!selectedPackage.value) return
  shopLoading.value = true

  const result = await smsStore.createCheckout(selectedPackage.value)
  shopLoading.value = false

  if (!result.success) {
    toast.add({ severity: 'error', summary: 'Checkout error', detail: result.message, life: 5000 })
    return
  }

  shopVisible.value = false
  window.open(result.checkoutUrl, '_blank', 'noopener,noreferrer')

  paymentModal.credits    = result.credits
  paymentModal.amount     = result.amount
  paymentModal.checkoutUrl = result.checkoutUrl
  paymentModal.state      = 'processing'
  paymentModal.visible    = true
  startPolling()
}

// ── Payment processing modal ──────────────────────────────
const paymentModal = reactive({
  visible:     false,
  state:       'processing',
  credits:     0,
  amount:      0,
  checkoutUrl: '',
})

const countdown     = ref(3)
const pollTimer     = ref(null)
const countdownTimer = ref(null)

const startPolling = () => {
  const creditsBefore = smsStore.credits
  pollTimer.value = setInterval(async () => {
    await smsStore.fetchStats()
    if (smsStore.credits > creditsBefore) {
      clearInterval(pollTimer.value)
      pollTimer.value = null
      paymentModal.state = 'success'
      countdown.value = 3
      countdownTimer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) closePaymentModal()
      }, 1000)
    }
  }, 4000)
}

const closePaymentModal = () => {
  clearInterval(pollTimer.value)
  clearInterval(countdownTimer.value)
  pollTimer.value = null
  countdownTimer.value = null
  paymentModal.visible = false
  paymentModal.state   = 'processing'
}

onUnmounted(() => {
  clearInterval(pollTimer.value)
  clearInterval(countdownTimer.value)
})

// ── History ───────────────────────────────────────────────
const switchTab  = async (key) => {
  activeTab.value = key
  if (key === 'history') await smsStore.fetchBlasts(1)
}
const changePage = async (p) => { await smsStore.fetchBlasts(p) }

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

const statusLabel    = (s) => ({ queued: 'Queued', sending: 'Sending', completed: 'Sent', failed: 'Failed' }[s] ?? s)
const statusSeverity = (s) => ({ queued: 'secondary', sending: 'info', completed: 'success', failed: 'danger' }[s] ?? 'secondary')

const blastIcon = (s) => ({
  queued:    'pi pi-clock text-slate-400',
  sending:   'pi pi-spin pi-spinner text-blue-500',
  completed: 'pi pi-check text-emerald-500',
  failed:    'pi pi-times text-red-500',
}[s] ?? 'pi pi-circle text-slate-400')

const blastIconBg = (s) => ({
  queued:    'bg-slate-100 dark:bg-white/10',
  sending:   'bg-blue-50 dark:bg-blue-500/10',
  completed: 'bg-emerald-50 dark:bg-emerald-500/10',
  failed:    'bg-red-50 dark:bg-red-500/10',
}[s] ?? 'bg-slate-100 dark:bg-white/10')

// ── Init ──────────────────────────────────────────────────
onMounted(async () => {
  await smsStore.fetchStats()
  statsLoading.value = false
  await Promise.all([
    smsStore.fetchBlasts(1),
    smsStore.fetchPackages(),
  ])
})
</script>

<style scoped>
.preview-fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.preview-fade-leave-active {
  transition: opacity 0.15s ease;
}
.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
