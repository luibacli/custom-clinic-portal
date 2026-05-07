import { createRouter, createWebHistory } from 'vue-router';
import isTokenExpired from '../lib/token';
import { useAuthTenantStore } from '../stores/authTenantStore';

// Landing / marketing pages — no auth required
const LandingHomePage  = () => import('../pages/LandingHomePage.vue');
const AboutPage        = () => import('../pages/AboutPage.vue');
const MissionPage      = () => import('../pages/MissionPage.vue');
const FeaturesPage     = () => import('../pages/FeaturesPage.vue');
const HowItWorksPage   = () => import('../pages/HowItWorksPage.vue');
const FaqPage          = () => import('../pages/FaqPage.vue');
const BookDemoPage     = () => import('../pages/BookDemoPage.vue');
const PricingPage      = () => import('../pages/PricingPage.vue');

// Legal / informational pages — no auth required
const PrivacyPolicyPage = () => import('../pages/PrivacyPolicyPage.vue');
const TermsPage         = () => import('../pages/TermsPage.vue');
const ContactPage       = () => import('../pages/ContactPage.vue');

// Tenant pages — lazy loaded
const TenantLoginPage      = () => import('../pages/TenantLoginPage.vue');
const TenantHomePage       = () => import('../pages/TenantHomePage.vue');
const TenantMailsPage      = () => import('../pages/TenantMailsPage.vue');
const TenantUsersPage      = () => import('../pages/TenantUsersPage.vue');
const TenantPatientPage    = () => import('../pages/TenantPatientPage.vue');
const TenantMailPage       = () => import('../pages/TenantMailPage.vue');
const TenantProfilePage    = () => import('../pages/TenantProfilePage.vue');
const TenantChangePassPage = () => import('../pages/TenantChangePassPage.vue');
const TenantResetPassPage  = () => import('../pages/TenantResetPassPage.vue');
const TenantVerifyEmailPage = () => import('../pages/TenantVerifyEmailPage.vue');

const SetupWizardPage           = () => import('../pages/SetupWizardPage.vue');
const TenantAppointmentsPage    = () => import('../pages/TenantAppointmentsPage.vue');
const TenantMessagesPage        = () => import('../pages/TenantMessagesPage.vue');
const TenantQRScanPage          = () => import('../pages/TenantQRScanPage.vue');
const TenantPatientManagePage   = () => import('../pages/TenantPatientManagePage.vue');

// Dev pages (accessed by users with role="dev" via tenant auth)
const DevHomePage    = () => import('../pages/DevHomePage.vue');
const DevTenantsPage = () => import('../pages/DevTenantsPage.vue');
const DevUsersPage   = () => import('../pages/DevUsersPage.vue');

// Layout
const TenantLayout = () => import('../layouts/TenantLayout.vue');

const routes = [
  // Root — landing page for unauthenticated visitors, dashboard redirect for authenticated users
  {
    path: '/',
    name: 'LandingHome',
    component: LandingHomePage,
    beforeEnter: (to, from, next) => {
      const tenantToken = localStorage.getItem('tenantToken');
      const tenantRole  = localStorage.getItem('tenantRole');
      const host        = window.location.hostname;
      const isClinicPortal = host !== 'myclinicaccess.com'
        && host !== 'www.myclinicaccess.com'
        && !['localhost', '127.0.0.1'].includes(host);

      // Unauthenticated visitor on a clinic subdomain → go to login, not marketing
      if (isClinicPortal && (!tenantToken || isTokenExpired(tenantToken))) {
        return next('/signin');
      }

      if (!tenantToken || isTokenExpired(tenantToken)) return next();
      if (tenantRole === 'patient') return next('/patient');
      if (tenantRole === 'dev')     return next('/dev');
      return next('/tenant-home');
    }
  },

  // Marketing / landing pages
  { path: '/about',        name: 'About',       component: AboutPage      },
  { path: '/mission',      name: 'Mission',     component: MissionPage    },
  { path: '/features',     name: 'Features',    component: FeaturesPage   },
  { path: '/how-it-works', name: 'HowItWorks',  component: HowItWorksPage },
  { path: '/faq',          name: 'Faq',         component: FaqPage        },
  { path: '/book-demo',    name: 'BookDemo',    component: BookDemoPage   },
  { path: '/pricing',      name: 'Pricing',     component: PricingPage    },

  // Clinic self-service signup
  {
    path: '/get-started',
    name: 'ClinicSignup',
    component: () => import('../pages/ClinicSignupPage.vue'),
  },

  // Tenant login
  {
    path: '/signin',
    name: 'Signin',
    component: TenantLoginPage,
  },

  // Tenant protected routes — all share TenantLayout
  {
    path: '/tenant-home',
    component: TenantLayout,
    meta: { requiresTenantAuth: true },
    children: [
      {
        path: '',
        name: 'TenantHome',
        component: TenantHomePage,
        meta: { roles: ['admin', 'superadmin'] }
      },
      {
        path: '/mails',
        name: 'TenantMails',
        component: TenantMailsPage,
        meta: { roles: ['admin', 'superadmin'], feature: 'verifications'  },
      },
      {
        path: '/users',
        name: 'TenantUsers',
        component: TenantUsersPage,
        meta: { roles: ['superadmin'], feature: 'users'},
      },
      {
        path: '/patient',
        name: 'TenantPatients',
        component: TenantPatientPage,
        meta: { roles: ['patient'] }
      },
      {
        path: '/inbox',
        name: 'Inbox',
        component: TenantMailPage,
        meta: { roles: ['patient', 'admin', 'superadmin'], feature: 'mails' },
      },
      {
        path: '/patients',
        name: 'Patients',
        component: TenantPatientManagePage,
        meta: { roles: ['admin', 'superadmin'] },
      },
      {
        path: '/appointments',
        name: 'Appointments',
        component: TenantAppointmentsPage,
        meta: { roles: ['admin', 'superadmin'], feature: 'appointments' },
      },
      {
        path: '/messages',
        name: 'Messages',
        component: TenantMessagesPage,
        meta: { roles: ['patient', 'admin', 'superadmin'], feature: 'messaging' }
      },
      {
        path: '/scan',
        name: 'QRScan',
        component: TenantQRScanPage,
        meta: { roles: ['admin', 'superadmin'], feature: 'qrScan' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: TenantProfilePage,
        meta: { roles: ['patient', 'admin', 'superadmin', 'dev'] }
      },
      {
        path: '/setup',
        name: 'SetupWizard',
        component: SetupWizardPage,
        meta: { roles: ['admin', 'superadmin'] }
      },
      {
        path: '/billing',
        name: 'Billing',
        component: () => import('../pages/BillingPage.vue'),
        meta: { roles: ['superadmin'] }
      },
      {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('../pages/AnalyticsPage.vue'),
        meta: { roles: ['admin', 'superadmin'], feature: 'analytics'}
      },

      // Dev pages — accessible to users with role="dev" authenticated via tenant login
      {
        path: '/dev',
        name: 'DevHomePage',
        component: DevHomePage,
        meta: { roles: ['dev'] }
      },
      {
        path: '/tenant/:id',
        name: 'DevTenantsPage',
        component: DevTenantsPage,
        meta: { roles: ['dev'] }
      },
      {
        path: '/manage-users',
        name: 'DevUsers',
        component: DevUsersPage,
        meta: { roles: ['dev'] }
      },
    ]
  },

  // Public legal & informational pages
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage
  },

  {
    path: '/change-pass',
    name: 'TenantChangePass',
    component: TenantChangePassPage,
    meta: { requiresTenantAuth: true, roles: ['patient', 'admin', 'superadmin'] }
  },
  {
    path: '/reset-password',
    name: 'TenantResetPass',
    component: TenantResetPassPage
  },
  {
    path: '/verify-email',
    name: 'TenantVerifyEmail',
    component: TenantVerifyEmailPage
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to, from, next) => {
  const authTenantStore = useAuthTenantStore();
  const tenantToken = localStorage.getItem('tenantToken');
  const tenantRole  = localStorage.getItem('tenantRole');

  // Redirect to login if protected route accessed without token
  if (to.meta.requiresTenantAuth && !tenantToken) {
    return next('/signin');
  }

  // Redirect away from login if already authenticated
  if (to.name === 'Signin' && tenantToken) {
    if (tenantRole === 'patient') return next('/patient');
    if (tenantRole === 'dev')     return next('/dev');
    return next('/tenant-home');
  }

  // Expire token check — only force redirect on protected routes
  if (tenantToken && isTokenExpired(tenantToken)) {
    authTenantStore.logout();
    if (to.meta.requiresTenantAuth || (to.meta.roles && to.meta.roles.length)) {
      return next('/signin');
    }
  }
  // Re-hydrate tenant on refresh — skip for dev role (no tenant scope)
  if (tenantToken && !authTenantStore.tenant && tenantRole !== 'dev') {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      await authTenantStore.fetchTenant(tenantId);
    }
  }
  // Auto-redirect unconfigured clinics to setup wizard
  if (
    to.name === 'TenantHome' &&
    (tenantRole === 'admin' || tenantRole === 'superadmin') &&
    authTenantStore.tenant &&
    !authTenantStore.tenant.branding?.primaryColor &&
    !authTenantStore.tenant.tenantLogo?.url
  ) {
    return next('/setup')
  }

  // Role-based access control
  const allowedRoles = to.meta.roles || [];
  if (allowedRoles.length && !allowedRoles.includes(tenantRole)) {
    return next(
      tenantRole === 'patient'
        ? '/patient'
        : (tenantRole === 'admin' || tenantRole === 'superadmin')
          ? '/tenant-home'
          : '/dev'
    );
  }

  // feature access control
  const featureKey = to.meta.feature

  if (featureKey) {
    const features =
      authTenantStore.tenant?.features ||
      {}

    const enabled = features[featureKey] === true

    if (!enabled) {
      return next('/tenant-home')
    }
  }

    next();
  });

export default router;
