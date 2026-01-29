<template>
  <div class="purchase-wrapper">
    <header class="page-header">
      <div class="header-left">
        <span class="category-tag">Transaction Queue</span>
        <h1>Payment Verification</h1>
        <p>Review and audit manual subscription proofs.</p>
      </div>
      <div class="header-stats">
        <div class="alert-pill" :class="{ 'has-pending': adminStore.pendingCount > 0 }">
          <span class="pulse-dot"></span>
          {{ adminStore.pendingCount }} Actions Required
        </div>
      </div>
    </header>

    <div class="filter-bar">
      <el-tabs v-model="activeTab" class="premium-tabs">
        <el-tab-pane label="All Activity" name="all" />
        <el-tab-pane label="Pending" name="pending" />
        <el-tab-pane label="Successful" name="approved" />
        <el-tab-pane label="Declined" name="rejected" />
      </el-tabs>
    </div>

    <div class="table-container">
      <el-table :data="filteredPurchases" v-loading="adminStore.isLoading" class="premium-table">
        <el-table-column label="Subscriber" min-width="240">
          <template #default="scope">
            <div class="user-profile">
              <el-avatar 
                :size="38" 
                :src="`https://ui-avatars.com/api/?name=${scope.row.user_name}&background=f1f5f9&color=64748b&bold=true`" 
              />
              <div class="user-meta">
                <span class="user-name">{{ scope.row.user_name }}</span>
                <span class="user-id">ID #{{ scope.row.user_id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Selected Plan" width="180">
          <template #default="scope">
            <div class="plan-cell">
              <span class="plan-label">{{ scope.row.plan_name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Proof of Payment" width="160">
          <template #default="scope">
            <div class="receipt-container">
              <el-image 
                v-if="scope.row.photo"
                class="receipt-thumb"
                :src="getImageUrl(scope.row.photo)" 
                :preview-src-list="[getImageUrl(scope.row.photo)]"
                fit="cover"
                preview-teleported
              >
                <template #error>
                  <div class="image-placeholder"><el-icon><Picture /></el-icon></div>
                </template>
              </el-image>
              <span v-else class="no-receipt">MISSING</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="140">
          <template #default="scope">
            <div class="status-indicator" :class="scope.row.status">
              <span class="status-dot"></span>
              {{ scope.row.status }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Decision" align="right" min-width="200">
          <template #default="scope">
            <div v-if="scope.row.status === 'pending'" class="decision-group">
              <el-button 
                class="approve-btn"
                @click="adminStore.updatePurchaseStatus(scope.row.id, 'approved')"
              >
                <el-icon><Check /></el-icon>
              </el-button>
              <el-button 
                class="reject-btn"
                @click="adminStore.updatePurchaseStatus(scope.row.id, 'rejected')"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div v-else class="audit-info">
              <el-icon><CircleCheckFilled /></el-icon> Audited
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { Check, Close, Picture } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'
import { computed, onMounted, ref } from 'vue'
import { getImageUrl } from '@/utils/helpers'

const adminStore = useAdminStore()
const activeTab = ref('all')

const filteredPurchases = computed(() => {
  if (activeTab.value === 'all') return adminStore.mixedPurchases
  return adminStore.mixedPurchases.filter(p => p.status === activeTab.value)
})

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

onMounted(() => {
  adminStore.fetchAllData()
})
</script>
<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.purchase-wrapper {
  padding: 0;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;

    .category-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #f59e0b;
      margin-bottom: 8px;
      display: block;
    }

    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 0; }
    p { color: $text-muted; font-size: 15px; margin-top: 4px; }
  }

  .alert-pill {
    background: white;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    color: $text-main;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1;
    }
    
    &.has-pending {
      border-color: #fef3c7;
      color: #92400e;
      .pulse-dot {
        background: #f59e0b;
        animation: pulse 2s infinite;
      }
    }
  }

  /* PREMIUM TABS */
  :deep(.premium-tabs) {
    .el-tabs__header { margin-bottom: 24px; border: none; }
    .el-tabs__nav-wrap::after { display: none; }
    .el-tabs__item {
      font-weight: 700;
      color: $text-muted;
      font-size: 14px;
      transition: all 0.3s $ease;
      &.is-active { color: $text-main; }
    }
    .el-tabs__active-bar { background-color: $text-main; height: 3px; border-radius: 3px; }
  }

  .table-container {
    background: white;
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    overflow: hidden;
  }

  :deep(.premium-table) {
    .el-table__header th {
      background: #fcfcfd;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      padding: 18px 0;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 14px;
      .user-meta {
        display: flex; flex-direction: column;
        .user-name { font-weight: 700; color: $text-main; font-size: 15px; }
        .user-id { font-size: 11px; color: #94a3b8; font-family: monospace; }
      }
    }

    .plan-label {
      font-weight: 700;
      color: $text-main;
      font-size: 14px;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
    }

    /* RECEIPT STYLE */
    .receipt-thumb {
      width: 50px; height: 36px;
      border-radius: 8px;
      border: 2px solid #f1f5f9;
      cursor: zoom-in;
      transition: all 0.3s $ease;
      &:hover { border-color: #3b82f6; transform: scale(1.1); }
    }
    .image-placeholder {
      width: 50px; height: 36px; background: #f8fafc;
      display: flex; align-items: center; justify-content: center;
      border-radius: 8px; color: #cbd5e1;
    }

    /* STATUS STYLE */
    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
      
      &.pending { color: #f59e0b; .status-dot { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; } }
      &.approved { color: #10b981; .status-dot { background: #10b981; box-shadow: 0 0 8px #10b981; } }
      &.rejected { color: #ef4444; .status-dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; } }
    }

    /* DECISION BUTTONS */
    .decision-group {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      .approve-btn, .reject-btn {
        width: 38px; height: 38px; border-radius: 12px; border: none;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s $ease;
        .el-icon { font-size: 16px; font-weight: 800; }
      }
      .approve-btn { background: #f0fdf4; color: #16a34a; &:hover { background: #16a34a; color: white; } }
      .reject-btn { background: #fef2f2; color: #dc2626; &:hover { background: #dc2626; color: white; } }
    }
    
    .audit-info {
      font-size: 13px; font-weight: 600; color: #cbd5e1;
      display: flex; align-items: center; gap: 6px;
      justify-content: flex-end;
    }
  }
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}
</style>