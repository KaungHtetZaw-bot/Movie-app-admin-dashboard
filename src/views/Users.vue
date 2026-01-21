<template>
  <div class="purchase-wrapper">
    <div class="page-header">
      <div class="title-section">
        <h1>Purchase Requests</h1>
        <p>Review and manage subscription approvals</p>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table :data="mixUserAndPurchase" v-loading="state.isLoading" stripe>
        <el-table-column label="User" min-width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="32" :src="`https://ui-avatars.com/api/?name=${scope.row.user_name}`" />
              <div class="ml-10">
                <div class="name">{{ scope.row.user_name }}</div>
                <div class="email">{{ scope.row.user_email || 'No email' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="VIP Plan" width="150">
          <template #default="scope">
            <el-tag effect="dark" type="warning" round>{{ scope.row.plan_name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Receipt" width="120">
          <template #default="scope">
            <el-image 
              v-if="scope.row.photo"
              class="receipt-preview"
              :src="getImageUrl(scope.row.photo)" 
              :preview-src-list="[getImageUrl(scope.row.photo)]"
              fit="cover"
              preview-teleported
            />
            <span v-else class="no-photo">No photo</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Date" prop="created_at" width="180">
          <template #default="scope">
             {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="right" width="200">
          <template #default="scope">
            <div v-if="scope.row.status === 'pending'">
              <el-button size="small" type="success" @click="handleAction(scope.row.id, 'approved')">Approve</el-button>
              <el-button size="small" type="danger" @click="handleAction(scope.row.id, 'rejected')">Reject</el-button>
            </div>
            <span v-else class="processed-text">Processed</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import http from '@/api/http';
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

  const state = ref({
    users:[],
    purchasesRequest:[],
    recentRequests:[],
    usersWithPurchaesRequest:[],
    isLoading:false
  })

  onMounted(async()=>{
    state.value.isLoading = true;
    await Promise.all([fetchUsers(), fetchPurchases(), fetchPlan()]);
    state.value.isLoading = false;
  })

  const getImageUrl = (path) => {
    return `http://127.0.0.1:8000/storage/purchases/${path}`;
  }

  const getStatusType = (status) => {
    if (status === 'pending') return 'warning';
    if (status === 'approved') return 'success';
    return 'danger';
  }

  const formatDate = (date) => new Date(date).toLocaleString();

  const handleAction = async (id, status) => {
    try {
      await ElMessageBox.confirm(`Are you sure you want to ${status} this request?`);
      // Assuming you have an update route in Laravel: Patch /purchases/{id}
      await http.patch(`/purchases/${id}`, { status });
      ElMessage.success(`Request ${status}`);
      fetchPurchases(); // Refresh list
    } catch (error) {
      if (error !== 'cancel') ElMessage.error("Action failed");
    }
  }

  const fetchUsers = async()=>{
    try {
      const res = await http.get('/users')
      state.value.users = res?.data
    } catch (error) {
      ElMessage.error(error.message||"something was wrong!")
    }
  }

  const fetchPurchases = async()=>{
    try {
      const res = await http.get('/purchases')
      state.value.purchasesRequest = res?.data
    } catch (error) {
      ElMessage.error(error.message || 'fail purchase list fetch')
    }
  }

  const fetchPlan = async()=>{
    try {
      const res = await http.get('/plans')
      state.value.plans =res?.data
    } catch (error) {
      ElMessage.error(error.message || "fail plan list fetch")
    }
  }

  const mixUserAndPurchase = computed(() => {
    if (!state.value.purchasesRequest.length) return []
    return state.value.purchasesRequest.map(purchase => {
      const user = state.value.users.find(u => u.id === purchase.user_id)
      const plan = state.value.plans.find(p => p.id === purchase.plan_id)
      return {
        ...purchase,
        user_name: user ? user.name : "Unknown",
        user_email: user ? user.email : "",
        plan_name: plan ? plan.name : "Unknown Plan"
      }
    })
  })

</script>

<style lang="scss" scoped>
.purchase-wrapper {
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;

  .page-header {
    margin-bottom: 24px;
    h1 { font-size: 24px; color: #1e293b; margin: 0; }
    p { color: #64748b; margin-top: 4px; }
  }

  .table-card { border-radius: 12px; border: none; }

  .user-info {
    display: flex;
    align-items: center;
    .name { font-weight: 600; color: #334155; font-size: 14px; }
    .email { font-size: 12px; color: #94a3b8; }
  }

  .receipt-preview {
    width: 60px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #e2e8f0;
  }

  .processed-text { color: #94a3b8; font-size: 13px; font-style: italic; }
  .ml-10 { margin-left: 10px; }
}
</style>