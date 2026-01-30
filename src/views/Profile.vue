<template>
  <div class="profile-container">
    <header class="page-header">
      <span class="category-tag">System Settings</span>
      <h1>Account Settings</h1>
      <p>Manage your administrative credentials and security preferences.</p>
    </header>

    <el-row :gutter="28">
      <el-col :xs="24" :md="8">
        <div class="glass-card user-identity-card">
          <div class="card-glow"></div>
          <div class="profile-header">
            <div class="avatar-wrapper">
              <el-avatar :size="100" src="https://ui-avatars.com/api/?name=Admin&background=f1f5f9&color=64748b&bold=true" />
              <div class="status-badge"></div>
            </div>
            <h3>{{ authStore?.user?.name }}</h3>
            <div class="role-pill">{{ authStore?.user?.role?.name }}</div>
          </div>

          <el-divider class="premium-divider" />

          <div class="user-details">
            <div class="detail-item">
              <div class="icon-box"><el-icon><Message /></el-icon></div>
              <div class="info">
                <span class="label">Email Address</span>
                <span class="value">{{ authStore?.user?.email }}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="icon-box"><el-icon><Calendar /></el-icon></div>
              <div class="info">
                <span class="label">Member Since</span>
                <span class="value">{{formatDate(authStore.user.created_at)}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :md="16">
        <div class="glass-card settings-card">
          <el-tabs v-model="activeTab" class="premium-tabs">
            <el-tab-pane label="Profile Details" name="edit">
              <el-form :model="userForm" label-position="top" class="premium-form">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="Display Name">
                      <el-input v-model="userForm.name" placeholder="Enter name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Email Address">
                      <el-input v-model="userForm.email" placeholder="email@example.com" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="form-actions">
                  <el-button class="action-btn primary" :loading="btnLoading" :disabled="userForm.name === authStore.user.name && userForm.email === authStore.user.email" @click="updateProfile">Save Changes</el-button>
                </div>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="Security & Password" name="security">
              <el-form label-position="top" class="premium-form">
                <el-form-item label="Current Password">
                  <el-input type="password" v-model="passwords.current" show-password placeholder="••••••••" />
                </el-form-item>
                <el-form-item label="New Password">
                  <el-input type="password" v-model="passwords.new" show-password placeholder="Enter new password"/>
                </el-form-item>
                <el-form-item label="Confirm Password">
                  <el-input type="password" v-model="passwords.confirm" show-password placeholder="Enter confirm password" />
                </el-form-item>
                <div class="form-actions">
                  <el-button class="action-btn danger" @click="updateSecurity" :loading="btnLoading">Update Security</el-button>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog 
    v-model="emailDialogVisible" 
    width="440px" 
    :close-on-click-modal="false" 
    :append-to-body="false"
    class="premium-security-dialog"
    align-center
  >
    <div class="security-container">
      <div class="brand-icon-box">
        <el-icon><Lock /></el-icon>
        <div class="pulse-ring"></div>
      </div>

      <h2>Confirm Identity</h2>
      <p>You're making a high-level administrative change to: <br>
        <span class="highlight-email">{{ userForm.email }}</span>
      </p>

      <el-form label-position="top" class="security-form" @submit.prevent="confirmEmailUpdate">
        <el-form-item label="Current Password">
          <el-input 
            v-model="userForm.current_password" 
            type="password" 
            show-password 
            placeholder="Enter password to authorize" 
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-button 
          type="primary" 
          class="confirm-btn" 
          :loading="btnLoading" 
          @click="confirmEmailUpdate"
        >
          Authorize & Update
        </el-button>
      </el-form>

      <div class="cancel-link">
        <el-button link @click="emailDialogVisible = false">Cancel Action</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message, Calendar, Lock } from '@element-plus/icons-vue'

import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import http from '@/api/http'
import { formatDate } from '@/utils/helpers'

const activeTab = ref('edit')
const authStore = useAuthStore()
const emailDialogVisible = ref(false)
const btnLoading = ref(false)
const userForm = reactive({
  name: authStore.user?.name || 'Administrator',
  email: authStore.user?.email || 'admin@example.com'
})

const passwords =ref({
  current:'',
  new:'',
  confirm:''
})

const updateProfile = async () => {
  const emailChanged = userForm.email !== authStore.user.email;
  const nameChanged = userForm.name !== authStore.user.name;

  if (!emailChanged && !nameChanged) {
    ElMessage.info('No changes detected');
    return;
  }

  if (emailChanged) {
    emailDialogVisible.value = true;
  } else {
    executeApiUpdate({ name: userForm.name });
  }
};

const confirmEmailUpdate = () => {
  if (!userForm.current_password) {
    ElMessage.warning('Password is required to change email');
    return;
  }

  const payload = {
    name: userForm.name,
    email: userForm.email,
    current_password: userForm.current_password
  };

  executeApiUpdate(payload);
};

const executeApiUpdate = async (data) => {
  try {
    btnLoading.value = true;
    const res = await http.patch(`/users/${authStore.user.id}/change-profile`, data);
    
    authStore.user = res.user;
    userForm.current_password = '';
    emailDialogVisible.value = false;

    ElMessage.success('Profile updated successfully');
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Update failed');
  } finally {
    btnLoading.value = false;
  }
};

const updateSecurity = async() => {

  const { current, new: newPass, confirm } = passwords.value;

  if (!current?.trim() || !newPass?.trim() || !confirm?.trim()) {
    ElMessage({
      message: 'All password fields are required',
      type: 'warning',
      customClass: 'premium-message'
    });
    return;
  }

  if (newPass.length < 8) {
    ElMessage.error('Security minimum: New password must be at least 8 characters');
    return;
  }
  if (confirm !== newPass) {
    ElMessage.error('Passwords do not match. Please verify your typing.');
    return;
  }
  try{
    btnLoading.value = true;
    const payload = {
      current_password: passwords.value.current,
      password: passwords.value.new,
      password_confirmation: passwords.value.confirm
    };
    const res = await http.patch(`/users/${authStore.user.id}/change-password`, payload);

    ElMessage({
      message: res?.message || 'Security settings updated successfully',
      type: 'success',
      customClass: 'premium-message'
    });
    passwords.value.current = '';
    passwords.value.new = '';
    passwords.value.confirm = '';

  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Update failed';
    ElMessage.error(errorMsg);
  } finally {
    btnLoading.value = false;
  }
  
}
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$primary: #6366f1;
$ease-premium: cubic-bezier(0.25, 1, 0.5, 1);

.profile-container {
  padding: 0;

  .page-header {
    margin-bottom: 40px;
    .category-tag { font-size: 11px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; }
    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 8px 0 0; }
    p { color: $text-muted; font-size: 16px; margin-top: 4px; }
  }

  .glass-card {
    background: white;
    border-radius: 24px;
    border: 1px solid #f1f5f9;
    padding: 32px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .user-identity-card {
    text-align: center;
    .avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 20px;
      .status-badge {
        position: absolute; bottom: 5px; right: 5px;
        width: 18px; height: 18px; background: #10b981;
        border: 3px solid white; border-radius: 50%;
      }
    }
    h3 { font-size: 22px; font-weight: 800; color: $text-main; margin: 0; }
    .role-pill {
      display: inline-block; margin-top: 8px; padding: 4px 12px;
      background: #f1f5f9; color: $text-muted; font-size: 12px;
      font-weight: 700; border-radius: 30px; text-transform: uppercase;
    }
  }

  .user-details {
    text-align: left;
    .detail-item {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
      .icon-box {
        width: 40px; height: 40px; border-radius: 12px; background: #f8fafc;
        display: flex; align-items: center; justify-content: center; color: $text-muted;
      }
      .info {
        display: flex; flex-direction: column;
        .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: 600; color: $text-main; }
      }
    }
  }

  /* Form & Tab Styling */
  :deep(.premium-tabs) {
    .el-tabs__item { font-weight: 700; color: $text-muted; padding: 0 20px 15px; }
    .el-tabs__item.is-active { color: $text-main; }
    .el-tabs__active-bar { background: $text-main; height: 3px; }
    .el-tabs__nav-wrap::after { display: none; }
  }

  .premium-form {
    margin-top: 24px;
    :deep(.el-form-item__label) { font-weight: 700; color: $text-main; font-size: 13px; margin-bottom: 8px; }
    :deep(.el-input__wrapper) { background: #f8fafc; box-shadow: none; border: 1px solid #f1f5f9; border-radius: 12px; padding: 8px 16px; }
  }

  .form-actions {
    margin-top: 32px;
    .action-btn {
      border-radius: 12px; padding: 22px 30px; font-weight: 700; border: none; transition: all 0.3s $ease-premium;
      &.primary { background: $text-main; color: white; &:hover { background: #1e293b; transform: translateY(-2px); } }
      &.danger { background: #fef2f2; color: #ef4444; &:hover { background: #ef4444; color: white; } }
    }
  }
}
/* Premium Dialog Styling */
:deep(.premium-security-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  .el-dialog__header { display: none; } // We build our own header
  .el-dialog__body { padding: 40px; }
}

.security-container {
  text-align: center;

  .brand-icon-box {
    width: 64px; height: 64px; background: $text-main; color: white;
    border-radius: 18px; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; font-size: 24px; position: relative;
    
    .pulse-ring {
      position: absolute; width: 100%; height: 100%;
      border: 2px solid $text-main; border-radius: 18px;
      animation: pulse 2s infinite;
    }
  }

  h2 { font-weight: 800; color: $text-main; margin-bottom: 8px; font-size: 24px; letter-spacing: -0.5px; }
  p { color: $text-muted; font-size: 14px; line-height: 1.6; margin-bottom: 30px; 
      .highlight-email { color: $primary; font-weight: 700; }
  }

  .security-form {
    :deep(.el-form-item__label) { font-weight: 700; color: $text-main; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    :deep(.el-input__wrapper) { background: #f8fafc; border-radius: 12px; padding: 10px 14px; }
  }

  .confirm-btn {
    width: 100%; height: 52px; border-radius: 14px; background: $text-main;
    border: none; font-weight: 700; font-size: 16px; margin-top: 10px;
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
  }

  .cancel-link { margin-top: 20px; .el-button { color: $text-muted; font-weight: 600; font-size: 13px; } }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}
</style>
<style lang="scss">
.premium-security-dialog {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-radius: 15px !important;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  .el-dialog__header { display: none !important; }
  .el-dialog__body { padding: 0 !important; }
}
</style>