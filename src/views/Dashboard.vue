<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Analytics Overview</h1>
        <p>Insights and system activity for the movie platform.</p>
      </div>
      <div class="header-actions">
        <el-button class="premium-btn">
          <el-icon class="mr-8"><Download /></el-icon> Generate Report
        </el-button>
      </div>
    </header>

    <el-row :gutter="28" class="stats-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in metricCards" :key="card.title">
        <div class="glass-card" @click="router.push(card.route)">
          <div class="card-top">
            <span class="card-label">{{ card.title }}</span>
            <div class="mini-icon" :style="{ color: card.color }">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
          </div>
          <div class="card-bottom">
            <h2 class="card-value">
              <template v-if="card.isCurrency"><small>Ks</small></template>
              {{ formatNumber(card.value) }}
            </h2>
            <div class="card-trend positive">
              <el-icon><Top /></el-icon> 12% vs last month
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="table-section">
      <div class="section-title">
        <h3>Recent Subscriptions</h3>
        <el-button link @click="router.push('/purchases')">View All Activity</el-button>
      </div>
      
      <el-card class="frameless-card">
        <el-table :data="recentRequests" style="width: 100%" class="premium-table">
          <el-table-column label="Subscriber" min-width="200">
            <template #default="scope">
              <div class="user-info">
                <el-avatar :size="32" :src="`https://ui-avatars.com/api/?name=${scope.row.userName}&background=f1f5f9&color=64748b`" />
                <div class="user-text">
                  <span class="name">{{ scope.row.userName }}</span>
                  <span class="id">ID: #{{ scope.row.id }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Plan Type">
            <template #default="scope">
              <span class="plan-pill" :class="scope.row.vipPlan.toLowerCase()">
                {{ scope.row.vipPlan }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Status">
            <template #default="scope">
              <div class="status-indicator" :class="scope.row.status">
                <span class="dot"></span>
                {{ scope.row.status }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="Time" align="right" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Timer, CircleCheck, Money, Download, Top } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'

const router = useRouter()
const adminStore = useAdminStore()

const formatNumber = (num) => new Intl.NumberFormat().format(num)

const metricCards = computed(() => [
  { title: 'Total Users', value: adminStore.users.length, icon: User, color: '#0f172a', route: '/users' },
  { title: 'Pending Tasks', value: adminStore.pendingCount, icon: Timer, color: '#f59e0b', route: '/purchases' },
  { title: 'Successful', value: adminStore.successCount, icon: CircleCheck, color: '#10b981', route: '/purchases' },
  { title: 'Gross Revenue', value: adminStore.totalRevenue, icon: Money, color: '#0f172a', isCurrency: true, route: '/dashboard' },
])

const recentRequests = [
  { id: 101, userName: "John Doe", vipPlan: "Gold", status: "pending", createdAt: "2 hours ago" },
  { id: 102, userName: "Jane Smith", vipPlan: "Silver", status: "completed", createdAt: "5 hours ago" },
  { id: 103, userName: "Mike Ross", vipPlan: "Gold", status: "completed", createdAt: "Yesterday" },
]
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$ease-premium: cubic-bezier(0.25, 1, 0.5, 1);

.dashboard-wrapper {
  padding: 0; // Padding handled by Layout index
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  
  h1 { font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 0; }
  p { color: $text-muted; margin-top: 4px; font-size: 16px; }
}

.premium-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  color: $text-main;
  padding: 20px 24px;
  transition: all 0.3s $ease-premium;
  &:hover { background: #f8fafc; border-color: $text-main; color: $text-main; }
}

.glass-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all 0.5s $ease-premium;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
    border-color: rgba(0,0,0,0.1);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .card-label { font-size: 14px; font-weight: 600; color: $text-muted; text-transform: uppercase; letter-spacing: 0.5px; }
    .mini-icon { font-size: 20px; opacity: 0.8; }
  }

  .card-value {
    font-size: 28px;
    font-weight: 800;
    color: $text-main;
    margin: 0;
    small { font-size: 14px; color: $text-muted; font-weight: 400; }
  }

  .card-trend {
    font-size: 12px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    &.positive { color: #10b981; font-weight: 600; }
  }
}

.table-section {
  margin-top: 48px;
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h3 { font-size: 20px; font-weight: 700; color: $text-main; margin: 0; }
  }
}

.frameless-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}

// User Cell Styling
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  .user-text {
    display: flex;
    flex-direction: column;
    .name { font-weight: 600; color: $text-main; font-size: 14px; }
    .id { font-size: 11px; color: $text-muted; }
  }
}

// Status Indicators
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  .dot { width: 6px; height: 6px; border-radius: 50%; }
  
  &.pending { color: #f59e0b; .dot { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; } }
  &.completed { color: #10b981; .dot { background: #10b981; box-shadow: 0 0 8px #10b981; } }
}

.plan-pill {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
  &.gold { background: #fef3c7; color: #92400e; }
}

.mr-8 { margin-right: 8px; }
</style>