<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Timer, CircleCheck, Money, Download, Top } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'

const router = useRouter()
const adminStore = useAdminStore()

// Helper for formatting large numbers
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return new Intl.NumberFormat().format(num)
}

// Helper for human-readable dates (missing in previous snippet)
const formatDate = (dateString) => {
  if (!dateString) return 'Recent'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const metricCards = computed(() => [
  { title: 'Total Users', value: adminStore.users.length, icon: User, color: '#6366f1', route: '/users' },
  { title: 'Pending Tasks', value: adminStore.pendingCount, icon: Timer, color: '#f59e0b', route: '/purchases' },
  { title: 'Successful', value: adminStore.successCount, icon: CircleCheck, color: '#10b981', route: '/purchases' },
  { title: 'Gross Revenue', value: adminStore.totalRevenue, icon: Money, color: '#0f172a', isCurrency: true, route: '/dashboard' },
])

onMounted(async () => {
  await adminStore.fetchAllData()
})
</script>

<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <div class="header-content">
        <span class="system-badge">System Live</span>
        <h1>Analytics Overview</h1>
        <p>Insights and system activity for the movie platform.</p>
      </div>
      <div class="header-actions">
        <el-button class="premium-btn" @click="adminStore.fetchAllData()">
          <el-icon class="mr-8"><Download /></el-icon> Generate Report
        </el-button>
      </div>
    </header>

    <el-row :gutter="28" class="stats-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in metricCards" :key="card.title">
        <div class="glass-card" @click="router.push(card.route)">
          <div class="card-glow" :style="{ background: card.color }"></div>
          <div class="card-content">
            <div class="card-top">
              <span class="mini-icon" :style="{ color: card.color }">
                <el-icon><component :is="card.icon" /></el-icon>
              </span>
              <span class="card-label" style="margin-left: 10px;">{{ card.title }}</span>
            </div>
            <div class="card-bottom">
              <h2 class="card-value">
                <template v-if="card.isCurrency"><small>Ks</small></template>
                {{ formatNumber(card.value) }}
              </h2>
              <div class="card-trend positive">
                <el-icon><Top /></el-icon> 12% growth
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="table-section">
      <div class="section-title">
        <div class="title-left">
          <h3>Recent Subscriptions</h3>
          <span class="live-indicator">
            <span class="ping"></span> Real-time
          </span>
        </div>
        <el-button link class="view-all-link" @click="router.push('/purchases')">
          View All Activity <el-icon class="ml-4"><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <el-card class="frameless-card" shadow="never">
        <el-table :data="adminStore.mixedPurchases.slice(0, 5)" class="premium-table">
          <el-table-column label="Subscriber" min-width="220">
            <template #default="scope">
              <div class="user-info">
                <el-avatar :size="34" :src="`https://ui-avatars.com/api/?name=${scope.row.user_name}&background=f1f5f9&color=64748b&bold=true`" />
                <div class="user-text">
                  <span class="name">{{ scope.row.user_name }}</span>
                  <span class="id">UID: #{{ scope.row.user_id }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Plan Type" min-width="150">
            <template #default="scope">
              <span class="plan-pill" :class="scope.row.plan_name?.toLowerCase()">
                {{ scope.row.plan_name }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="140">
            <template #default="scope">
              <div class="status-indicator" :class="scope.row.status?.toLowerCase()">
                <span class="dot"></span>
                <span class="status-label">{{ scope.row.status }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Activity Time" align="right" min-width="160">
            <template #default="scope">
              <span class="timestamp">{{ formatDate(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

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

.system-badge {
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: inline-block;
}

.glass-card {
  position: relative;
  overflow: hidden; // Clips the inner glow
  background: #ffffff;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .card-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    filter: blur(40px);
    opacity: 0.05;
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #cbd5e1;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
    .card-glow { opacity: 0.15; transform: scale(2); }
  }
}

.title-left {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: $text-muted;
    font-weight: 600;
    
    .ping {
      width: 8px; height: 8px; border-radius: 50%; background: #10b981;
      animation: indicator-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes indicator-ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}

.view-all-link {
  font-weight: 700;
  color: #6366f1;
  &:hover { color: #4338ca; }
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

$slate-900: #0f172a;
$slate-500: #64748b;
$slate-100: #f1f5f9;

.frameless-card {
  border: none !important;
  background: transparent !important;
  
  :deep(.el-card__body) {
    padding: 0; // Let the table breathe
  }
}

:deep(.premium-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: transparent;
  background: transparent !important;

  // Header Styling
  .el-table__header th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: $slate-500;
    font-weight: 700;
    border-bottom: 1px solid $slate-100;
  }

  // Row Styling
  .el-table__row {
    transition: all 0.2s ease;
    &:hover {
      background-color: #f8fafc !important;
      td { background-color: transparent !important; }
    }
  }

  // User Info Cell
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .user-text {
      display: flex;
      flex-direction: column;
      .name { font-weight: 700; color: $slate-900; font-size: 14px; }
      .id { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; }
    }
  }

  // Plan Pill
  .plan-pill {
    font-size: 12px;
    font-weight: 700;
    color: $slate-500;
    background: #f8fafc;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  // Status Indicator
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: capitalize;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #cbd5e1;
    }

    &.pending { color: #f59e0b; .dot { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; } }
    &.approved, &.success { color: #10b981; .dot { background: #10b981; box-shadow: 0 0 8px #10b981; } }
    &.rejected, &.failed { color: #ef4444; .dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; } }
  }

  .timestamp {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }
}
</style>