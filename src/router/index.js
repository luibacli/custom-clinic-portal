import { createRouter, createWebHistory } from 'vue-router';
import isTokenExpired from '../lib/token';
import { useAuthTenantStore } from '../stores/authTenantStore';

// Tenant pages — lazy loaded
const TenantLoginPage      = () => import('../pages/TenantLoginPage.vue');
const TenantHomePage       = () => import('../pages/TenantHomePage.vue');
const TenantMailsPage      = () => import('../pages/TenantMailsPage.vue');
const TenantUsersPage      = () => import('../pages/TenantUsersPage.vue');
const TenantPatientPage    = () => import('../pages/TenantPatientPage.vue');
const TenantInboxPage      = () => import('../pages/TenantInboxPage.vue');
const TenantProfilePage    = () => import('../pages/TenantProfilePage.vue');
const TenantChangePassPage = () => import('../pages/TenantChangePassPage.vue');
const TenantResetPassPage  = () => import('../pages/TenantResetPassPage.vue');
const TenantVerifyEmailPage = () => import('../pages/TenantVerifyEmailPage.vue');
const MobileNotSupported   = () => import('../pages/MobileNotSupported.vue');

// Dev pages (accessed by users with role="dev" via tenant auth)
const DevHomePage    = () => import('../pages/DevHomePage.vue');
const DevTenantsPage = () => import('../pages/DevTenantsPage.vue');
const DevUsersPage   = () => import('../pages/DevUsersPage.vue');

// Layout
const TenantLayout = () => import('../layouts/TenantLayout.vue');

const routes = [
  // Smart root entry — always redirects to tenant routes
  {
    path: '/',
    name: 'Root',
    beforeEnter: (to, from, next) => {
      const tenantToken = localStorage.getItem('tenantToken');
      const tenantRole  = localStorage.getItem('tenantRole');

      if (!tenantToken) return next('/signin');
      if (tenantRole === 'patient') return next('/patient');
      if (tenantRole === 'dev')     return next('/dev');
      return next('/tenant-home');
    }
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
        meta: { roles: ['admin', 'superadmin'] }
      },
      {
        path: '/users',
        name: 'TenantUsers',
        component: TenantUsersPage,
        meta: { roles: ['superadmin'] }
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
        component: TenantInboxPage,
        meta: { roles: ['patient', 'admin', 'superadmin'] }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: TenantProfilePage,
        meta: { roles: ['patient', 'admin', 'superadmin', 'dev'] }
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

  {
    path: '/mobile',
    name: 'Mobile',
    component: MobileNotSupported
  },
  {
    path: '/change-pass',
    name: 'TenantChangePass',
    component: TenantChangePassPage,
    meta: { roles: ['patient', 'admin', 'superadmin'] }
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
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

  // Expire token check
  if (tenantToken && isTokenExpired(tenantToken)) {
    authTenantStore.logout();
    return next('/signin');
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

  next();
});

export default router;
