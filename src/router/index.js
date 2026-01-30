// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import nprogress from 'nprogress'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Overview' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: 'User Management' }
      },
      {
        path: 'plans',
        name: 'Plans',
        component: () => import('@/views/Plans.vue'),
        meta: { title: 'Subscription Plans' }
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('@/views/Payments.vue'),
        meta: { title: 'Payment Accounts' }
      },
      {
        path: 'purchases',
        name: 'purchases',
        component: () => import('@/views/Purchases.vue'),
        meta: { title: 'Purchases' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: 'Profile' }
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/Setting.vue'),
        meta: { title: 'Setting' }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach(() => {
  nprogress.done();
});
router.beforeEach((to, from, next) => {
  nprogress.start();
  const token = localStorage.getItem('token');
  const roleId = parseInt(localStorage.getItem('role_id'));

  document.title = to.meta.title ? `${to.meta.title} | Movie Admin` : 'Movie Admin';

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.path.startsWith('/') && to.path !== '/login' && to.path !== '/register') {
      if(roleId === 1) {
          localStorage.removeItem('token');
          return next('/login');
      }
  }

  if (to.meta.guestOnly && token) {
    return next('/dashboard');
  }

  next();
});

export default router