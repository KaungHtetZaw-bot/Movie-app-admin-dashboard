import { defineStore } from 'pinia'
import http from '@/api/http'
import { ElMessage } from 'element-plus'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    plans: [],
    purchases: [],
    isLoading: false,
    baseUrl: 'http://127.0.0.1:8000/storage/purchases/'
  }),

  getters: {
    // This replaces your "mixUserAndPurchase" computed property in components
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
    pendingCount: (state) => state.purchases.filter(p => p.status === 'pending').length
  },

  actions: {
    // Fetch everything at once (Modern "Eager Loading")
    async fetchAllData() {
      this.isLoading = true
      try {
        const [uRes, pRes, plRes] = await Promise.all([
          http.get('/users'),
          http.get('/purchases'),
          http.get('/plans')
        ])
        this.users = uRes.data
        this.purchases = pRes.data
        this.plans = plRes.data
      } catch (error) {
        ElMessage.error("Data sync failed")
      } finally {
        this.isLoading = false
      }
    },

    // Centralized Image Helper
    getImage(path) {
      if (!path) return 'https://via.placeholder.com/150?text=No+Image'
      return `${this.baseUrl}${path}`
    },

    // Action to handle approvals directly from store
    async updatePurchaseStatus(id, status) {
      try {
        await http.patch(`/purchases/${id}`, { status })
        // Update local state immediately so UI feels fast
        const index = this.purchases.findIndex(p => p.id === id)
        if (index !== -1) this.purchases[index].status = status
        ElMessage.success(`Request ${status}`)
      } catch (error) {
        ElMessage.error("Update failed")
      }
    }
  }
})