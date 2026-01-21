<template>
  <div class="payment-wrapper">
    <div class="page-header">
      <div class="header-content">
        <span class="system-tag">Financial Settings</span>
        <h1>Payment Gateways</h1>
        <p>Manage secure entry points for subscriber transactions.</p>
      </div>
      <el-button class="premium-add-btn" @click="openDialog()">
        <el-icon class="mr-8"><Plus /></el-icon> Add New Gateway
      </el-button>
    </div>

    <div class="stats-row mb-32">
      <div class="stat-pill">
        <span class="label">Connected Gateways</span>
        <span class="value">{{ payments.length }}</span>
      </div>
      <div class="stat-pill">
        <span class="label">System Status</span>
        <span class="value status-ok">Operational</span>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :lg="8" v-for="item in payments" :key="item.id">
        <div class="gateway-card">
          <div class="card-glass-bg"></div>
          
          <div class="card-header">
            <span class="type-badge" :class="item.type.toLowerCase().replace(' ', '-')">
              {{ item.type }}
            </span>
            <div class="card-actions">
              <el-button link class="edit-btn" @click="openDialog(item)"><el-icon><Edit /></el-icon></el-button>
              <el-button link class="delete-btn" @click="handleDelete(item.id)"><el-icon><Delete /></el-icon></el-button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="provider-info">
              <div class="provider-logo">{{ item.name.charAt(0) }}</div>
              <h3 class="provider-name">{{ item.name }}</h3>
            </div>
            
            <div class="account-box">
              <span class="account-label">Destination Account</span>
              <div class="account-number-wrapper">
                <code>{{ item.number }}</code>
                <el-icon class="copy-icon"><DocumentCopy /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog 
      v-model="dialogVisible" 
      :title="editMode ? 'Edit Gateway' : 'New Gateway'" 
      width="400px"
      class="premium-dialog"
      align-center
    >
      <div class="form-container">
        <div class="form-item">
          <label>Category</label>
          <el-select v-model="form.type" placeholder="Select type" class="premium-input">
            <el-option label="Bank Transfer" value="Bank" />
            <el-option label="Mobile Wallet" value="Mobile Wallet" />
            <el-option label="Cryptocurrency" value="Crypto" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Provider</label>
          <el-input v-model="form.name" placeholder="e.g. KBZ Bank" class="premium-input" />
        </div>

        <div class="form-item">
          <label>Account / Wallet ID</label>
          <el-input v-model="form.number" placeholder="Enter credentials" class="premium-input" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="dialogVisible = false">Discard</el-button>
          <el-button class="save-btn" @click="submitForm" :loading="submitting">
            {{ editMode ? 'Save Changes' : 'Confirm Integration' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/api/http'

const payments = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const submitting = ref(false)

const form = reactive({ id: null, type: '', name: '', number: '' })

const fetchPayments = async () => {
  try {
    const res = await http.get('/payments')
    payments.value = res.data.data || res.data
  } catch (error) {
    ElMessage.error("Failed to load payment methods")
  }
}

const getTagType = (type) => {
  const types = { 'Bank': 'primary', 'Mobile Wallet': 'success', 'Crypto': 'warning' }
  return types[type] || 'info'
}

const openDialog = (item = null) => {
  if (item) {
    editMode.value = true
    Object.assign(form, item)
  } else {
    editMode.value = false
    Object.assign(form, { id: null, type: '', name: '', number: '' })
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await http.patch(`/payments/${form.id}`, form)
      ElMessage.success('Gateway updated')
    } else {
      await http.post('/payments', form)
      ElMessage.success('Gateway created')
    }
    dialogVisible.value = false
    fetchPayments()
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('Permanent delete this gateway?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await http.delete(`/payments/${id}`)
    ElMessage.success('Deleted')
    fetchPayments()
  })
}

onMounted(fetchPayments)
</script>
<style lang="scss" scoped>
$text-dark: #0f172a;
$text-slate: #64748b;
$accent: #1e293b;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.payment-wrapper {
  padding: 0 10px; // Main padding handled by Layout.vue

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;

    .system-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #3b82f6;
      margin-bottom: 8px;
      display: block;
    }

    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-dark; letter-spacing: -1px; margin: 0; }
    p { color: $text-slate; font-size: 15px; margin-top: 4px; }
  }

  .premium-add-btn {
    background: $accent;
    color: white;
    border-radius: 12px;
    padding: 22px 24px;
    font-weight: 600;
    border: none;
    transition: all 0.3s $ease;
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2); background: #000; }
  }

  .stats-row {
    display: flex;
    gap: 32px;
    .stat-pill {
      .label { display: block; font-size: 12px; font-weight: 600; color: $text-slate; text-transform: uppercase; }
      .value { font-size: 24px; font-weight: 800; color: $text-dark; 
        &.status-ok { color: #10b981; &::before { content: '●'; font-size: 14px; margin-right: 8px; } }
      }
    }
  }

  .mb-32{
    margin-bottom: 32px;
  }

  /* GATEWAY CARD REDESIGN */
  .gateway-card {
    background: white;
    border-radius: 24px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    transition: all 0.5s $ease;
    margin-bottom: 24px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.06);
      border-color: rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .type-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 20px;
        background: #f1f5f9;
        color: $text-slate;
        &.bank { background: #eff6ff; color: #1d4ed8; }
        &.mobile-wallet { background: #f0fdf4; color: #15803d; }
      }
      
      .card-actions .el-button { color: #cbd5e1; &:hover { color: $text-dark; } .delete-btn:hover { color: #ef4444; } }
    }

    .provider-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      .provider-logo {
        width: 48px;
        height: 48px;
        background: $accent;
        color: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 800;
      }

      .provider-name { font-size: 20px; font-weight: 700; color: $text-dark; margin: 0; }
    }

    .account-box {
      background: #f8fafc;
      padding: 16px;
      border-radius: 16px;
      .account-label { font-size: 11px; color: $text-slate; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 4px; }
      .account-number-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        code { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; color: $text-dark; }
        .copy-icon { color: #94a3b8; cursor: pointer; &:hover { color: $accent; } }
      }
    }
  }
}

/* DIALOG STYLING */
:deep(.premium-dialog) {
  border-radius: 24px;
  .el-dialog__header { padding: 32px 32px 10px; .el-dialog__title { font-weight: 800; font-family: 'Plus Jakarta Sans'; } }
  .el-dialog__body { padding: 20px 32px; }
  
  .form-item {
    margin-bottom: 20px;
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: $text-dark; }
  }

  .premium-input .el-input__wrapper {
    box-shadow: none !important;
    background: #f1f5f9;
    border-radius: 12px;
    padding: 8px 12px;
  }

  .save-btn {
    background: $accent;
    color: white;
    border-radius: 12px;
    padding: 20px 24px;
    border: none;
    font-weight: 600;
  }
}
</style>