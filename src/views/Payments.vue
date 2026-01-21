<template>
  <div class="payment-wrapper">
    <div class="page-header">
      <div class="header-content">
        <h1>Payment Gateways</h1>
        <p>Configure the payment methods available for your subscribers</p>
      </div>
      <el-button type="primary" size="large" :icon="Plus" @click="openDialog()">
        Add New Method
      </el-button>
    </div>

    <el-row :gutter="20" class="mb-24">
      <el-col :span="6">
        <el-card shadow="never" class="summary-card">
          <div class="label">Total Methods</div>
          <div class="value">{{ payments.length }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in payments" :key="item.id">
        <el-card class="modern-payment-card" shadow="hover">
          <div class="card-top">
            <el-tag :type="getTagType(item.type)" effect="light" round>
              {{ item.type }}
            </el-tag>
            <div class="actions">
              <el-button :icon="Edit" circle size="small" @click="openDialog(item)" />
              <el-button :icon="Delete" circle size="small" type="danger" @click="handleDelete(item.id)" />
            </div>
          </div>
          
          <div class="card-main">
            <div class="provider-avatar">
              {{ item.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="provider-name">{{ item.name }}</h3>
            <div class="account-details">
              <span class="label">Account Number</span>
              <code class="number">{{ item.number }}</code>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog 
      v-model="dialogVisible" 
      :title="editMode ? 'Update Payment Method' : 'Create Payment Method'" 
      width="440px"
      align-center
    >
      <el-form :model="form" label-position="top" class="mt-10">
        <el-form-item label="Payment Category">
          <el-select v-model="form.type" placeholder="Select category" style="width: 100%">
            <el-option label="Bank Transfer" value="Bank" />
            <el-option label="Mobile Wallet" value="Mobile Wallet" />
            <el-option label="Cryptocurrency" value="Crypto" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Provider Name">
          <el-input v-model="form.name" placeholder="e.g. KBZ Bank or KPay" />
        </el-form-item>

        <el-form-item label="Account Details (Number/Phone)">
          <el-input v-model="form.number" placeholder="Enter number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          {{ editMode ? 'Update Gateway' : 'Save Gateway' }}
        </el-button>
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
.payment-wrapper {
  padding: 24px 24px 24px 5px;
  background-color: #f8fafc;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h1 { font-size: 24px; color: #1e293b; margin: 0; }
    p { color: #64748b; margin-top: 4px; }
  }

  .mb-24 { margin-bottom: 24px; }
  .mt-10 { margin-top: 10px; }

  .summary-card {
    border-radius: 12px;
    border: none;
    .label { font-size: 13px; color: #64748b; }
    .value { font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px; }
  }

  .modern-payment-card {
    border-radius: 16px;
    border: none;
    margin-bottom: 20px;
    
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-main {
      text-align: center;
      padding-bottom: 10px;

      .provider-avatar {
        width: 56px;
        height: 56px;
        background: #f1f5f9;
        color: #3b82f6;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 800;
        margin: 0 auto 16px;
      }

      .provider-name {
        font-size: 18px;
        color: #1e293b;
        margin: 0 0 12px;
      }

      .account-details {
        background: #f8fafc;
        padding: 12px;
        border-radius: 10px;
        .label { display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
        .number { display: block; font-size: 15px; color: #334155; font-family: monospace; font-weight: 600; margin-top: 4px; }
      }
    }
  }
}
</style>