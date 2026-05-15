<template>
  <footer class="bg-slate-900 text-slate-300">
    <div class="max-w-7xl mx-auto px-6 py-12">

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        <!-- Col 1: Brand + Description -->
        <div class="sm:col-span-2 lg:col-span-1 space-y-4">
          <router-link to="/" class="flex items-center gap-2.5 group">
             <Avatar image="/myclinicaccess_logo.png" size="large"/>
            <div class="leading-tight">
              <span class="text-white font-bold text-sm block">My Clinic Access</span>
              <span class="text-[10px] text-blue-400 uppercase tracking-widest font-semibold block">myclinicaccess.com</span>
            </div>
          </router-link>
          <p class="text-sm text-slate-400 leading-relaxed">
            All-in-one access platform for clinics, patients, and healthcare teams — built for Filipino healthcare workflows.
          </p>
          <router-link
            to="/book-demo"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 rounded-xl shadow hover:from-blue-700 hover:to-cyan-600 transition-all"
          >
            <i class="pi pi-calendar text-xs"></i>
            Book a Free Demo
          </router-link>
        </div>

        <!-- Col 2: Product Pages -->
        <div class="space-y-4">
          <h3 class="text-white font-semibold text-xs uppercase tracking-widest">Product</h3>
          <ul class="space-y-2">
            <li v-for="link in productLinks" :key="link.to">
              <router-link
                :to="link.to"
                class="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <i :class="link.icon" class="text-xs w-3 text-center"></i>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Legal & Info -->
        <div class="space-y-4">
          <h3 class="text-white font-semibold text-xs uppercase tracking-widest">Legal &amp; Info</h3>
          <ul class="space-y-2">
            <li v-for="link in legalLinks" :key="link.to">
              <router-link
                :to="link.to"
                class="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <i :class="link.icon" class="text-xs w-3 text-center"></i>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 4: Data Notice -->
        <div class="space-y-4">
          <h3 class="text-white font-semibold text-xs uppercase tracking-widest">Data Notice</h3>
          <div class="space-y-3 text-sm text-slate-400">
            <div class="flex items-start gap-2">
              <i class="pi pi-shield text-emerald-400 mt-0.5 shrink-0 text-xs"></i>
              <p>Does <strong class="text-slate-200">not</strong> store patient health records (PHR / EMR).</p>
            </div>
            <div class="flex items-start gap-2">
              <i class="pi pi-user text-blue-400 mt-0.5 shrink-0 text-xs"></i>
              <p>Only basic profile: name, birthdate, contact number.</p>
            </div>
            <div class="flex items-start gap-2">
              <i class="pi pi-building text-purple-400 mt-0.5 shrink-0 text-xs"></i>
              <p>All data is owned and managed by the clinic.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-700/60 mt-10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
        <p>&copy; {{ currentYear }} My Clinic Access. All rights reserved.</p>
        <p>Crafted for Filipino healthcare.</p>
      </div>

    </div>
  </footer>
</template>

<script setup>

const currentYear = new Date().getFullYear()

const productLinks = [
  { to: '/',            label: 'Home',          icon: 'pi pi-home' },
  { to: '/about',       label: 'About Us',       icon: 'pi pi-info-circle' },
  { to: '/mission',     label: 'Mission & Vision', icon: 'pi pi-star' },
  { to: '/features',    label: 'Features',       icon: 'pi pi-th-large' },
  { to: '/pricing',     label: 'Pricing',        icon: 'pi pi-tag' },
  { to: '/how-it-works',label: 'How It Works',   icon: 'pi pi-list' },
  { to: '/faq',         label: 'FAQ',            icon: 'pi pi-question-circle' },
  { to: '/book-demo',   label: 'Book a Demo',    icon: 'pi pi-calendar' },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy',    icon: 'pi pi-shield' },
  { to: '/terms',   label: 'Terms & Conditions', icon: 'pi pi-file' },
  { to: '/contact', label: 'Contact Us',         icon: 'pi pi-envelope' },
  { to: '/signin',  label: 'Clinic Sign In',     icon: 'pi pi-sign-in' },
]
</script>
