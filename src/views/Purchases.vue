<template>
  <div class="purchase-wrapper">
    <div class="page-header">
      <div class="title-section">
        <h1>Purchase Requests</h1>
        <p>Verify and approve user subscription payments</p>
      </div>
      <div class="header-stats">
        <el-tag type="warning" effect="dark" round>
          {{ pendingRequests.length }} Pending Tasks
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
      <el-table :data="filteredPurchases" v-loading="loading" stripe style="width: 100%">
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
              :src="getImageUrl(scope.row.photo)" 
              :preview-src-list="[getImageUrl(scope.row.photo)]"
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
                @click="handleStatusChange(scope.row.id, 'approved')"
              >Approve</el-button>
              <el-button 
                type="danger" 
                size="small" 
                :icon="Close" 
                @click="handleStatusChange(scope.row.id, 'rejected')"
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
import { ref, onMounted, computed } from 'vue'
import { Check, Close, Picture, UserFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/api/http'

const loading = ref(false)
const activeTab = ref('pending') // Default to showing pending work

// Raw data from API
const users = ref([])
const purchases = ref([])
const plans = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const [uRes, pRes, plRes] = await Promise.all([
      http.get('/users'),
      http.get('/purchases'),
      http.get('/plans')
    ])
    users.value = uRes.data
    purchases.value = pRes.data
    plans.value = plRes.data
  } catch (error) {
    ElMessage.error("Failed to sync dashboard data")
  } finally {
    loading.value = false
  }
}

// The "Mix" logic to join IDs with Names
const mixedData = computed(() => {
  return purchases.value.map(purchase => {
    const user = users.value.find(u => u.id === purchase.user_id)
    const plan = plans.value.find(p => p.id === purchase.plan_id)
    return {
      ...purchase,
      user_name: user ? user.name : 'Unknown User',
      plan_name: plan ? plan.name : 'Unknown Plan'
    }
  })
})

// Filter data based on active tab
const filteredPurchases = computed(() => {
  if (activeTab.value === 'all') return mixedData.value
  return mixedData.value.filter(p => p.status === activeTab.value)
})

const pendingRequests = computed(() => {
  return purchases.value.filter(p => p.status === 'pending')
})

const getImageUrl = (path) => `http://127.0.0.1:8000/storage/purchases/${path}`

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const handleStatusChange = (id, newStatus) => {
  ElMessageBox.confirm(
    `Are you sure you want to set this request to ${newStatus}?`,
    'Confirm Action',
    { type: newStatus === 'approved' ? 'success' : 'error' }
  ).then(async () => {
    try {
      await http.patch(`/purchases/${id}`, { status: newStatus })
      ElMessage.success(`Request ${newStatus}`)
      fetchData() // Refresh
    } catch (error) {
      ElMessage.error("Operation failed")
    }
  })
}

onMounted(fetchData)
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