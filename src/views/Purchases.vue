<template>
  <div class="purchase-wrapper">
    <div class="page-header">
      <div class="title-section">
        <h1>Purchase Requests</h1>
        <p>Verify and approve user subscription payments</p>
      </div>
      <div class="header-stats">
        <el-tag type="warning" effect="dark" round>
          {{ adminStore.pendingCount }} Pending Tasks
        </el-tag>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="modern-tabs">
      <el-tab-pane label="All Requests" name="all" />
      <el-tab-pane label="Pending" name="pending" />
      <el-tab-pane label="Approved" name="approved" />
      <el-tab-pane label="Rejected" name="rejected" />
    </el-tabs>

    <el-card class="table-card" shadow="never">
      <el-table :data="filteredPurchases" v-loading="adminStore.isLoading" stripe style="width: 100%">
        <el-table-column label="Customer" min-width="200">
          <template #default="scope">
            <div class="user-cell">
              <el-avatar :size="32" :src="`https://ui-avatars.com/api/?name=${scope.row.user_name}`" />
              <div class="ml-10">
                <div class="name">{{ scope.row.user_name }}</div>
                <div class="sub-text">ID: #{{ scope.row.user_id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Plan Requested" width="150">
          <template #default="scope">
            <el-tag effect="light" type="success">{{ scope.row.plan_name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Payment Proof" width="130">
          <template #default="scope">
            <el-image 
              v-if="scope.row.photo"
              class="receipt-preview"
              :src="adminStore.getImage(scope.row.photo)" 
              :preview-src-list="[adminStore.getImage(scope.row.photo)]"
              fit="cover"
              preview-teleported
            >
              <template #error>
                <div class="image-error"><el-icon><Picture /></el-icon></div>
              </template>
            </el-image>
            <span v-else class="no-photo">No Receipt</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" effect="dark">
              {{ scope.row.status.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="right" min-width="180">
          <template #default="scope">
            <div v-if="scope.row.status === 'pending'" class="action-group">
              <el-button 
                type="success" 
                size="small" 
                :icon="Check" 
                @click="adminStore.updatePurchaseStatus(scope.row.id, 'approved')"
              >Approve</el-button>
              <el-button 
                type="danger" 
                size="small" 
                :icon="Close" 
                @click="adminStore.updatePurchaseStatus(scope.row.id, 'rejected')"
              >Reject</el-button>
            </div>
            <div v-else class="processed-by">
              <el-icon class="mr-4"><UserFilled /></el-icon>
              Processed
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { Check, Close, Picture, UserFilled } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'
import { computed, onMounted, ref } from 'vue'

const adminStore = useAdminStore()
const activeTab = ref('pending')

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
.purchase-wrapper {
  padding: 30px;
  background-color: #f8fafc;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    h1 { margin: 0; font-size: 24px; color: #1e293b; }
    p { margin: 5px 0 0; color: #64748b; }
  }

  .modern-tabs {
    margin-bottom: 20px;
    :deep(.el-tabs__nav-wrap::after) { display: none; }
  }

  .table-card { border-radius: 12px; border: none; }

  .user-cell {
    display: flex; align-items: center;
    .name { font-weight: 600; color: #334155; }
    .sub-text { font-size: 11px; color: #94a3b8; }
  }

  .receipt-preview {
    width: 60px; height: 40px; border-radius: 6px;
    cursor: pointer; border: 1px solid #e2e8f0;
    &:hover { border-color: #409eff; }
  }

  .image-error {
    width: 60px; height: 40px; background: #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    color: #cbd5e1; border-radius: 6px;
  }

  .processed-by { color: #94a3b8; font-size: 13px; display: flex; align-items: center; }
  .ml-10 { margin-left: 10px; }
  .mr-4 { margin-right: 4px; }
}
</style>