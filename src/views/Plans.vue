<template>
  <div class="plans-wrapper">
    <div class="page-header">
      <div class="title-section">
        <h1>Subscription Plans</h1>
        <p>Manage pricing, durations, and access levels</p>
      </div>
      <el-button type="primary" size="large" :icon="Plus" @click="openDialog()" class="add-btn">
        Create New Plan
      </el-button>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table :data="plans" v-loading="loading" style="width: 100%" class="modern-table">
        <el-table-column label="Plan Name" min-width="180">
          <template #default="scope">
            <div class="plan-info">
              <div class="plan-icon">
                <el-icon><GoldMedal /></el-icon>
              </div>
              <span class="plan-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Pricing" min-width="150">
          <template #default="scope">
            <div class="price-text">
              <span class="amount">{{ formatNumber(scope.row.amount) }}</span>
              <span class="currency">Ks</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Duration" min-width="150">
          <template #default="scope">
            <el-tag :type="getDurationTag(scope.row.month)" effect="light" round>
              <el-icon class="mr-4"><Calendar /></el-icon>
              {{ scope.row.month }} {{ scope.row.month > 1 ? 'Months' : 'Month' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="150" align="right">
          <template #default="scope">
            <el-button-group>
              <el-tooltip content="Edit Plan" placement="top">
                <el-button :icon="Edit" @click="openDialog(scope.row)" />
              </el-tooltip>
              <el-tooltip content="Delete Plan" placement="top">
                <el-button :icon="Delete" type="danger" @click="handleDelete(scope.row.id)" />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog 
      v-model="dialogVisible" 
      :title="editMode ? 'Update Plan Details' : 'Create New Plan'" 
      width="440px"
      class="modern-dialog"
      align-center
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="Internal Name">
          <el-input v-model="form.name" placeholder="e.g. Monthly Premium" />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Price (MMK)">
              <el-input-number v-model="form.amount" :min="0" :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Months">
              <el-input-number v-model="form.month" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting" class="px-24">
          {{ editMode ? 'Update Plan' : 'Create Plan' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Plus, Edit, Delete, GoldMedal, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/api/http'

// ... same state and methods as before ...
const plans = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editMode = ref(false)

const form = reactive({ id: null, name: '', amount: 0, month: 1 })

const fetchPlans = async () => {
  loading.value = true
  try {
    const res = await http.get('/plans')
    plans.value = res.data.data || res.data // handle both data wrapper scenarios
  } finally {
    loading.value = false
  }
}

// Helper for currency formatting
const formatNumber = (val) => new Intl.NumberFormat().format(val)

// Color-coding durations
const getDurationTag = (months) => {
  if (months >= 12) return 'success' // Annual
  if (months >= 6) return 'warning'  // Semi-annual
  return 'info' // Monthly
}

const openDialog = (data = null) => {
  if (data) {
    editMode.value = true
    Object.assign(form, data)
  } else {
    editMode.value = false
    Object.assign(form, { id: null, name: '', amount: 0, month: 1 })
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await http.patch(`/plans/${form.id}`, form)
      ElMessage.success('Plan updated successfully')
    } else {
      await http.post('/plans', form)
      ElMessage.success('New plan created')
    }
    dialogVisible.value = false
    fetchPlans()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Action failed')
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('Are you sure you want to remove this plan? Users will no longer be able to subscribe to it.', 'Delete Plan', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'error'
  }).then(async () => {
    await http.delete(`/plans/${id}`)
    ElMessage.success('Plan deleted')
    fetchPlans()
  })
}

onMounted(fetchPlans)
</script>
<style lang="scss" scoped>
.plans-wrapper {
  padding: 32px;
  background-color: #f8fafc;
  min-height: calc(100vh - 64px);

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #1e293b;
      font-weight: 700;
    }

    p {
      margin: 4px 0 0;
      color: #64748b;
      font-size: 14px;
    }

    .add-btn {
      border-radius: 8px;
      padding: 12px 24px;
    }
  }

  .table-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .plan-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .plan-icon {
      width: 36px;
      height: 36px;
      background: #eff6ff;
      color: #3b82f6;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .plan-name {
      font-weight: 600;
      color: #334155;
    }
  }

  .price-text {
    .amount {
      font-weight: 700;
      color: #0f172a;
      font-size: 16px;
    }
    .currency {
      font-size: 12px;
      color: #64748b;
      margin-left: 4px;
    }
  }

  .mr-4 { margin-right: 4px; }
  .px-24 { padding-left: 24px; padding-right: 24px; }
}
</style>