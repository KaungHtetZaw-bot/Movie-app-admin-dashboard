<template>
  <div class="plans-wrapper">
    <header class="page-header">
      <div class="header-left">
        <span class="category-tag">Billing & Products</span>
        <h1>Subscription Plans</h1>
        <p>Define pricing tiers and access durations for your audience.</p>
      </div>
      <el-button class="premium-action-btn" @click="openDialog()">
        <el-icon class="mr-8"><Plus /></el-icon> New Tiers
      </el-button>
    </header>

    <div class="table-container">
      <el-table :data="plans" v-loading="loading" class="premium-table">
        <el-table-column label="Subscription Tier" min-width="240">
          <template #default="scope">
            <div class="plan-identity">
              <div class="tier-icon" :class="getTierClass(scope.row.name)">
                <el-icon v-if="scope.row.month >= 12"><Medal /></el-icon>
                <el-icon v-else><Files /></el-icon>
              </div>
              <div class="tier-details">
                <span class="tier-name">{{ scope.row.name }}</span>
                <span class="tier-id">PLAN-ID-{{ scope.row.id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Unit Price" min-width="180">
          <template #default="scope">
            <div class="premium-price">
              <span class="currency">Ks</span>
              <span class="amount">{{ formatNumber(scope.row.amount) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Cycle Duration" min-width="180">
          <template #default="scope">
            <div class="duration-pill" :class="getDurationTag(scope.row.month)">
              <span class="dot"></span>
              {{ scope.row.month }} {{ scope.row.month > 1 ? 'Days' : 'Day' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Management" width="120" align="right">
          <template #default="scope">
            <div class="action-trigger">
              <el-dropdown trigger="click">
                <el-button link class="more-btn">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu class="premium-dropdown">
                    <el-dropdown-item :icon="Edit" @click="openDialog(scope.row)">Edit Tier</el-dropdown-item>
                    <el-dropdown-item :icon="Delete" class="delete-action" @click="handleDelete(scope.row.id)">Archive Plan</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog 
      v-model="dialogVisible" 
      width="420px"
      class="premium-modal"
      :show-close="false"
      align-center
    >
      <template #header>
        <div class="modal-header">
          <h3>{{ editMode ? 'Modify Tier' : 'New Tier' }}</h3>
          <p>Configure billing and duration details.</p>
        </div>
      </template>

      <el-form :model="form" label-position="top" class="premium-form">
        <el-form-item label="Display Name">
          <el-input v-model="form.name" placeholder="e.g. Gold Membership" />
        </el-form-item>
        
        <div class="form-row">
          <el-form-item label="Price (MMK)" class="flex-2">
            <el-input-number v-model="form.amount" :min="0" :controls="false" />
          </el-form-item>
          <el-form-item label="Days" class="flex-1">
            <el-input-number v-model="form.day" :min="1" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="modal-footer">
          <el-button link @click="dialogVisible = false">Cancel</el-button>
          <el-button class="confirm-btn" @click="submitForm" :loading="submitting">
            {{ editMode ? 'Save Changes' : 'Launch Plan' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Plus, Edit, Delete, Medal, Files, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/api/http'

const plans = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editMode = ref(false)

const form = reactive({ id: null, name: '', amount: 0, day: 1 })

const fetchPlans = async () => {
  loading.value = true
  try {
    const res = await http.get('/plans')
    plans.value = res.data.data || res.data
  } finally {
    loading.value = false
  }
}

// 1. Logic for naming classes (Fixes the Error)
const getTierClass = (name) => {
  if (!name) return ''
  const n = name.toLowerCase()
  if (n.includes('gold')) return 'gold'
  if (n.includes('premium')) return 'premium'
  return ''
}

// 2. Logic for duration colors
const getDurationTag = (days) => {
  if (days >= 16) return 'success'
  if (days >= 6) return 'warning'
  return ''
}

const formatNumber = (val) => new Intl.NumberFormat().format(val)

const openDialog = (data = null) => {
  if (data) {
    editMode.value = true
    Object.assign(form, data)
  } else {
    editMode.value = false
    Object.assign(form, { id: null, name: '', amount: 0, day: 1 })
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await http.patch(`/plans/${form.id}`, form)
      ElMessage.success('Plan updated')
    } else {
      await http.post('/plans', form)
      ElMessage.success('Plan created')
    }
    dialogVisible.value = false
    fetchPlans()
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('Archive this plan?', 'Warning', {
    confirmButtonText: 'Archive',
    type: 'warning'
  }).then(async () => {
    await http.delete(`/plans/${id}`)
    ElMessage.success('Plan archived')
    fetchPlans()
  })
}

onMounted(fetchPlans)
</script>
<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$accent: #1e293b;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.plans-wrapper {
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
      color: #6366f1;
      margin-bottom: 8px;
      display: block;
    }

    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 0; }
    p { color: $text-muted; font-size: 15px; margin-top: 4px; }
  }

  .premium-action-btn {
    background: $accent;
    color: white;
    border-radius: 12px;
    padding: 22px 28px;
    font-weight: 600;
    border: none;
    transition: all 0.3s $ease;
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15); background: #000; }
  }

  .table-container {
    background: white;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.04);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }

  /* PREMIUM TABLE STYLING */
  :deep(.premium-table) {
    --el-table-header-bg-color: #fcfcfd;
    --el-table-row-hover-bg-color: #f8fafc;
    
    .el-table__header th {
      padding: 16px 0;
      color: $text-muted;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    .plan-identity {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;

      .tier-icon {
        width: 40px;
        height: 40px;
        background: #f1f5f9;
        color: $accent;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        &.gold { background: #fef3c7; color: #92400e; }
      }

      .tier-details {
        display: flex;
        flex-direction: column;
        .tier-name { font-weight: 700; color: $text-main; font-size: 15px; }
        .tier-id { font-size: 11px; color: #94a3b8; font-family: monospace; }
      }
    }

    .premium-price {
      .currency { font-size: 12px; font-weight: 600; color: $text-muted; margin-right: 4px; }
      .amount { font-size: 18px; font-weight: 800; color: $text-main; letter-spacing: -0.5px; }
    }

    .duration-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 600;
      background: #f1f5f9;
      color: $text-muted;
      
      .dot { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
      &.success { background: #ecfdf5; color: #065f46; .dot { background: #10b981; } }
      &.warning { background: #fffbeb; color: #92400e; .dot { background: #f59e0b; } }
    }
  }
  .action-trigger{
    display: flex;
    justify-content: center;
  }
}

/* MODAL STYLING */
:deep(.premium-modal) {
  border-radius: 24px;
  .modal-header {
    h3 { margin: 0; font-size: 20px; font-weight: 800; color: $text-main; }
    p { margin: 4px 0 0; font-size: 14px; color: $text-muted; }
  }
  
  .premium-form {
    margin-top: 24px;
    .form-row { display: flex; gap: 16px; .flex-2 { flex: 2; } .flex-1 { flex: 1; } }
    
    label { font-size: 13px; font-weight: 700; color: $text-main; }
    .el-input__wrapper { background: #f1f5f9; box-shadow: none !important; border-radius: 12px; padding: 10px 16px; }
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .confirm-btn { background: $accent; color: white; border: none; padding: 22px 32px; border-radius: 12px; font-weight: 700; }
  }
}

.mr-8 { margin-right: 8px; }
</style>