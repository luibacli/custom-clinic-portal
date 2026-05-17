<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">

      <!-- Page Header -->
      <div class="mb-10">
        <span class="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <i class="pi pi-shield"></i> Legal
        </span>
        <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Version 2026-05-v1 &mdash; Effective May 2026 &mdash; Applies to all users of My Clinic Access.</p>
      </div>

      <!-- Scope Notice -->
      <div class="mb-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-5 flex items-start gap-3">
        <i class="pi pi-info-circle text-blue-600 dark:text-blue-400 text-lg mt-0.5 shrink-0"></i>
        <div>
          <p class="text-sm font-bold text-blue-800 dark:text-blue-300">Platform Scope</p>
          <p class="mt-1 text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
            My Clinic Access is a clinic workflow and patient registration platform — not an electronic medical records (EMR) system.
            It is not designed to store formal diagnoses, prescriptions, lab results, or clinical notes. However, free-text fields
            such as appointment notes and patient messages may contain information entered by clinic staff. My Clinic Access does not
            control or screen this content. Clinics are responsible for what their staff enter into these fields.
          </p>
        </div>
      </div>

      <div class="space-y-6">

        <!-- Section 1: Data Collected -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <i class="pi pi-database"></i>
            </span>
            1. What Information We Collect
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            My Clinic Access collects only the data required to operate patient registration and clinic communication workflows:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-user text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Identity Information</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Full name, birthdate, PhilHealth PIN</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-phone text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Contact Information</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Email address, phone number</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-calendar text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Appointment Records</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Dates, service type, status, notes entered by clinic staff</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-comments text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Messages</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Clinic-to-patient messages sent through the platform</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-image text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Profile Photo</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Optional, uploaded by patient or clinic staff</p>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <i class="pi pi-lock text-blue-500 text-xl mb-2"></i>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">Authentication Data</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Hashed passwords, login timestamps, IP addresses (for security logs)</p>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm">
            <p class="font-semibold text-amber-800 dark:text-amber-300 mb-1">Note on PhilHealth Email Relay</p>
            <p class="text-amber-700 dark:text-amber-400 leading-relaxed">
              For clinics that enable the PhilHealth YAKAP registration feature, the platform receives emails sent to clinic-provided email addresses
              on behalf of patients and stores them temporarily to assist with activation. PhilHealth activation codes are retained for 7 days then automatically deleted.
              Patients must provide explicit written consent for this feature at point of registration.
            </p>
          </div>
        </section>

        <!-- Section 2: How We Use Data -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">
              <i class="pi pi-eye"></i>
            </span>
            2. How We Use Your Information
          </h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <i class="pi pi-arrow-right text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span><strong class="text-slate-800 dark:text-white">Patient Registration &mdash;</strong> To create and manage patient accounts within the clinic system.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <i class="pi pi-arrow-right text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span><strong class="text-slate-800 dark:text-white">Communication &mdash;</strong> To allow the clinic to send messages, appointment notifications, and SMS reminders to registered patients.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <i class="pi pi-arrow-right text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span><strong class="text-slate-800 dark:text-white">Workflow Support &mdash;</strong> To support clinic operations including scheduling, identity management, and queue management.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <i class="pi pi-arrow-right text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span><strong class="text-slate-800 dark:text-white">Security &mdash;</strong> To detect unauthorized access, prevent abuse, and maintain audit logs of authentication events.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <i class="pi pi-arrow-right text-blue-500 mt-0.5 shrink-0 text-xs"></i>
              <span><strong class="text-slate-800 dark:text-white">Legal Compliance &mdash;</strong> To fulfill obligations under RA 10173 (PDPA) including responding to data subject rights requests.</span>
            </li>
          </ul>
        </section>

        <!-- Section 3: Data Ownership -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
              <i class="pi pi-building"></i>
            </span>
            3. Data Ownership &amp; Control
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            All patient data stored within the My Clinic Access platform is owned and controlled by the clinic that created the account.
            The clinic acts as the <strong>data controller</strong> under RA 10173. My Clinic Access acts as the <strong>data processor</strong>,
            processing data only on the clinic's documented instructions. The clinic is responsible for:
          </p>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              Obtaining valid patient consent before registration and before each distinct use of personal data
            </li>
            <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              Managing and securing patient accounts and staff access within their instance
            </li>
            <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              Ensuring compliance with RA 10173 and all applicable data protection regulations
            </li>
            <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              Controlling what information clinic staff enter into free-text fields such as appointment notes and messages
            </li>
          </ul>
        </section>

        <!-- Section 4: Data Subject Rights -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <i class="pi pi-user-edit"></i>
            </span>
            4. Patient Data Rights (PDPA / RA 10173)
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Patients have the following rights under Philippine law, which are supported by built-in platform features:
          </p>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="pi pi-download text-blue-500 mt-0.5 shrink-0"></i>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Right to Access &amp; Portability</p>
                <p class="text-slate-600 dark:text-slate-400 mt-0.5">Patients may request a full export of their data in JSON format via their clinic's portal.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="pi pi-trash text-red-500 mt-0.5 shrink-0"></i>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Right to Erasure</p>
                <p class="text-slate-600 dark:text-slate-400 mt-0.5">Patients may request anonymization of their personal data. This replaces identifying fields with anonymized placeholders while preserving referential integrity for audit purposes.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="pi pi-bell-slash text-amber-500 mt-0.5 shrink-0"></i>
              <div>
                <p class="font-semibold text-slate-800 dark:text-white">Right to Opt Out of Communications</p>
                <p class="text-slate-600 dark:text-slate-400 mt-0.5">Patients may opt out of SMS communications through their profile settings at any time.</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-4">
            To exercise these rights, contact your clinic administrator directly. For system-level concerns, use our
            <router-link to="/contact" class="text-blue-600 dark:text-blue-400 hover:underline">Contact page</router-link>.
          </p>
        </section>

        <!-- Section 5: Security -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm">
              <i class="pi pi-lock"></i>
            </span>
            5. Data Security
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            My Clinic Access applies industry-standard security practices including encrypted authentication (bcrypt password hashing),
            secure API communication (HTTPS/TLS), JWT-based session management, role-based access controls, and rate limiting on
            authentication endpoints. Clinics are advised to follow their own internal security protocols for user account management and staff access.
            In the event of a personal data breach, affected clinics will be notified within 72 hours of discovery, consistent with PDPA obligations.
          </p>
        </section>

        <!-- Section 6: Sub-Processors -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm">
              <i class="pi pi-share-alt"></i>
            </span>
            6. Third-Party Sub-Processors
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            My Clinic Access uses the following third-party services to operate the platform. Data is shared with these providers
            only to the extent necessary to deliver the service:
          </p>
          <div class="space-y-2 text-sm">
            <div class="grid grid-cols-3 gap-2 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 pb-1">
              <span>Provider</span><span>Purpose</span><span>Country</span>
            </div>
            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span class="font-medium">MongoDB Atlas</span><span>Database storage</span><span>US (AWS)</span>
            </div>
            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span class="font-medium">Cloudinary</span><span>Photo &amp; logo storage</span><span>US</span>
            </div>
            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span class="font-medium">Resend</span><span>Transactional email delivery</span><span>US</span>
            </div>
            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span class="font-medium">PayMongo</span><span>Payment processing</span><span>Philippines</span>
            </div>
            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span class="font-medium">Semaphore</span><span>SMS delivery</span><span>Philippines</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Data shared with US-based providers is subject to contractual safeguards. My Clinic Access maintains Data Processing Agreements
            with these providers to ensure adequate protection of personal data in accordance with RA 10173 requirements on cross-border transfers.
          </p>
        </section>

        <!-- Section 7: Contact -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm">
              <i class="pi pi-envelope"></i>
            </span>
            7. Questions &amp; Data Protection Officer
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            For privacy-related inquiries specific to your patient account, contact your clinic administrator directly.
            For system-level concerns or to submit a data subject rights request to My Clinic Access, visit our
            <router-link to="/contact" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Contact page</router-link>.
            My Clinic Access has designated a Data Protection Officer in compliance with RA 10173.
          </p>
        </section>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
</script>
