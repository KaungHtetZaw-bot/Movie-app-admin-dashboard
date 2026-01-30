import { defineStore } from 'pinia'
import http from '@/api/http'
import { ElMessage } from 'element-plus'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isSidebarCollapsed: false,
    users: [],
    plans: [],
    purchases: [],
    isLoading: false,
    loadStates: {
      users: false,
      purchases: false,
      plans: false
    }
  }),

  getters: {
    mixedPurchases: (state) => {
      return state.purchases.map(purchase => {
        const user = state.users.find(u => u.id === purchase.user_id)
        const plan = state.plans.find(p => p.id === purchase.plan_id)
        return {
          ...purchase,
          user_name: user ? user.name : 'Unknown User',
          user_email: user ? user.email : 'N/A',
          plan_name: plan ? plan.name : 'Unknown Plan',
          amount: plan ? plan.amount : 0
        }
      })
    },
    totalRevenue: (state) => {
      return state.purchases
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => {
          const plan = state.plans.find(pl => pl.id === p.plan_id)
          return sum + (plan ? Number(plan.amount) : 0)
        }, 0)
    },
    pendingCount: (state) => state.purchases.filter(p => p.status === 'pending').length,
    successCount: (state) => state.purchases.filter(p => p.status === 'approved').length
  },

  actions: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },

    async fetchUsers() {
      this.loadStates.users = true;
      try {
        const res = await http.get('/users');
        this.users = res.data;
      } finally {
        this.loadStates.users = false;
      }
    },

    async fetchPurchases() {
      this.loadStates.purchases = true;
      try {
        const res = await http.get('/purchases');
        this.purchases = res.data;
      } finally {
        this.loadStates.purchases = false;
      }
    },

    async fetchPlans() {
      this.loadStates.plans = true;
      try {
        const res = await http.get('/plans');
        this.plans = res.data;
      } finally {
        this.loadStates.plans = false;
      }
    },
    async fetchAllData() {
      this.isLoading = true
      try {
       await Promise.all([
          this.fetchUsers(),
          this.fetchPurchases(),
          this.fetchPlans()
        ])
      } catch (error) {
        console.log(error)
        ElMessage.error("Data sync failed")
      } finally {
        this.isLoading = false
      }
    },
    async updatePurchaseStatus(id, status) {
      try {
        await http.patch(`/purchases/${id}`, { status })
        const index = this.purchases.findIndex(p => p.id === id)
        if (index !== -1) this.purchases[index].status = status
        ElMessage.success(`Request ${status}`)
      } catch (error) {
        ElMessage.error("Update failed")
      }
    }
  }
})