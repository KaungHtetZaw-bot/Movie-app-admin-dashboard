<template>
  <div class="dashboard-container">
    <div class="page-title">
      <h2>System Overview</h2>
      <p>Real-time analytics for your movie platform</p>
    </div>

    <el-row :gutter="20" class="mb-24">
      <el-col :xs="12" :sm="12" :md="6" v-for="card in metricCards" :key="card.title">
        <el-card shadow="hover" class="metric-card">
          <div class="card-body">
            <div class="icon-box" :style="{ backgroundColor: card.color + '20', color: card.color }">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ card.title }}</span>
              <div class="stat-value">
                <span v-if="card.isCurrency">$</span>{{ card.value }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="modern-table-card" shadow="never">
          <template #header>
            <div class="table-header">
              <div class="header-text">
                <span class="title">Recent Purchase Requests</span>
                <span class="subtitle">Latest 5 subscription attempts</span>
              </div>
              <el-button type="primary" link @click="router.push('/purchases')">View All</el-button>
            </div>
          </template>

          <el-table :data="recentRequests" style="width: 100%" stripe>
            <el-table-column label="User">
              <template #default="scope">
                <div class="user-cell">
                  <el-avatar :size="30" src="https://ui-avatars.com/api/?name=User" />
                  <span class="ml-10">{{ scope.row.userName }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="vipPlan" label="Plan">
              <template #default="scope">
                <el-tag :type="scope.row.vipPlan === 'Gold' ? 'warning' : 'info'" effect="light">
                  {{ scope.row.vipPlan }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="Status">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" dot>
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="createdAt" label="Date" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Timer, CircleCheck, Money } from '@element-plus/icons-vue'

const router = useRouter()
const metrics = ref({
  totalUsers: 254,
  pendingPurchases: 12,
  completedPurchases: 189,
  vipRevenue: 3450,
})

const recentRequests = ref([
  { id: 101, userName: "John Doe", vipPlan: "Gold", status: "pending", createdAt: "2026-01-19" },
  { id: 102, userName: "Jane Smith", vipPlan: "Silver", status: "completed", createdAt: "2026-01-18" },
  { id: 103, userName: "Mike Ross", vipPlan: "Gold", status: "completed", createdAt: "2026-01-17" },
])

const metricCards = computed(() => [
  { title: 'Total Users', value: metrics.value.totalUsers, icon: User, color: '#409EFF' },
  { title: 'Pending', value: metrics.value.pendingPurchases, icon: Timer, color: '#E6A23C' },
  { title: 'Completed', value: metrics.value.completedPurchases, icon: CircleCheck, color: '#67C23A' },
  { title: 'Revenue', value: metrics.value.vipRevenue, icon: Money, color: '#F56C6C', isCurrency: true },
])

const getStatusType = (status) => {
  const map = { pending: 'warning', completed: 'success', rejected: 'danger' }
  return map[status] || 'info'
}
</script>
<style scoped>
.dashboard-container { padding: 24px; }

.page-title { margin-bottom: 24px; }
.page-title h2 { margin: 0; font-size: 24px; color: #1a1a1a; }
.page-title p { margin: 4px 0 0; color: #909399; font-size: 14px; }

.mb-24 { margin-bottom: 24px; }

.metric-card {
  border-radius: 12px;
  border: none;
  transition: transform 0.2s;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 13px; color: #909399; margin-bottom: 4px; }
.stat-value { font-size: 20px; font-weight: 700; color: #303133; }

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-text .title { display: block; font-weight: 700; font-size: 16px; }
.header-text .subtitle { font-size: 12px; color: #909399; }

.user-cell { display: flex; align-items: center; }
.ml-10 { margin-left: 10px; }
.modern-table-card { border-radius: 12px; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
</style>