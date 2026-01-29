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
            <h3>{{ userForm.name }}</h3>
            <div class="role-pill">{{ authStore?.user?.role?.name }}</div>
          </div>

          <el-divider class="premium-divider" />

          <div class="user-details">
            <div class="detail-item">
              <div class="icon-box"><el-icon><Message /></el-icon></div>
              <div class="info">
                <span class="label">Email Address</span>
                <span class="value">{{ userForm.email }}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="icon-box"><el-icon><Calendar /></el-icon></div>
              <div class="info">
                <span class="label">Member Since</span>
                <span class="value">{{authStore.formatDate(authStore.user.created_at)}}</span>
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
                  <el-input type="password" show-password placeholder="••••••••" />
                </el-form-item>
                <el-form-item label="New Password">
                  <el-input type="password" show-password placeholder="Enter new password" />
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import http from '@/api/http'

const activeTab = ref('edit')
const authStore = useAuthStore()
const btnLoading = ref(false)
const userForm = reactive({
  name: authStore.user?.name || 'Administrator',
  email: authStore.user?.email || 'admin@example.com'
})

onMounted(()=>{
  console.log(authStore.user)
})
const updateProfile = async () => {
  const isUnchanged = userForm.name === authStore.user.name && 
                      userForm.email === authStore.user.email;
  
  if (isUnchanged) {
    ElMessage({
      message: 'Please change at least one value to update.',
      type: 'warning'
    });
    return;
  }

  try {
    btnLoading.value = true;
    const res = await http.patch(`/users/${authStore.user.id}/change-profile`, userForm);
    authStore.user = res.user; 

    ElMessage({
      message: 'Profile updated successfully',
      type: 'success',
      customClass: 'premium-message'
    });
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Update failed');
  } finally {
    btnLoading.value = false;
  }
};

const updateSecurity = () => {
  ElMessage({
    message: 'Security settings updated successfully',
    type: 'success',
    customClass: 'premium-message'
  })
}
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
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
</style>