<template>
  <div class="profile-container">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="never" class="user-card">
          <div class="profile-header">
            <el-avatar :size="80" src="https://ui-avatars.com/api/?name=Admin&background=409eff&color=fff" />
            <h3>Administrator</h3>
            <el-tag size="small" type="success">Super Admin</el-tag>
          </div>
          <el-divider />
          <div class="user-details">
            <div class="detail-item">
              <el-icon><Mail /></el-icon> <span>admin@example.com</span>
            </div>
            <div class="detail-item">
              <el-icon><Calendar /></el-icon> <span>Joined: Jan 2026</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="never" class="settings-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="Edit Profile" name="edit">
              <el-form :model="userForm" label-position="top">
                <el-form-item label="Display Name">
                  <el-input v-model="userForm.name" />
                </el-form-item>
                <el-form-item label="Email Address">
                  <el-input v-model="userForm.email" />
                </el-form-item>
                <el-button type="primary" @click="updateProfile">Save Changes</el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="Password & Security" name="security">
              <el-form label-position="top">
                <el-form-item label="Current Password">
                  <el-input type="password" show-password />
                </el-form-item>
                <el-form-item label="New Password">
                  <el-input type="password" show-password />
                </el-form-item>
                <el-button type="danger">Update Password</el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Mail, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('edit')
const userForm = reactive({
  name: 'Administrator',
  email: 'admin@example.com'
})

const updateProfile = () => {
  ElMessage.success('Profile updated successfully')
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 24px;
  .user-card {
    text-align: center;
    border-radius: 12px;
    .profile-header {
      padding-bottom: 10px;
      h3 { margin: 12px 0 6px; }
    }
    .user-details {
      text-align: left;
      .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        color: #606266;
        font-size: 14px;
      }
    }
  }
  .settings-card { border-radius: 12px; }
}
</style>