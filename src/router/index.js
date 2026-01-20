// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Dashboard from '@/views/Dashboard.vue'
import Users from '@/views/UserS.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: '/users',
        component: Users
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
