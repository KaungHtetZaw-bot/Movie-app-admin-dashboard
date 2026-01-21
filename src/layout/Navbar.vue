<template>
  <div class="navbar-container">
    <div class="left-section">
      <div class="toggle-icon" @click="adminStore.toggleSidebar">
        <el-icon v-if="adminStore.isSidebarCollapsed"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon>
      </div>
      <el-breadcrumb separator="/" class="ml-15">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-section">
      <el-badge :value="5" class="notification-badge" type="danger">
        <el-icon class="icon-btn"><Bell /></el-icon>
      </el-badge>

      <el-dropdown trigger="click">
        <div class="user-profile">
          <el-avatar 
            :size="32" 
            src="https://ui-avatars.com/api/?name=Admin&background=409eff&color=fff" 
          />
          <span class="username">Administrator</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="User" @click="router.push('/profile')">My Profile</el-dropdown-item>
            <el-dropdown-item :icon="Setting">Settings</el-dropdown-item>
            <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">
              Logout
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, ArrowDown, User, Setting, SwitchButton,Fold,Expand } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/store/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

// Dynamically get the page name from the router meta
const currentRouteName = computed(() => route.meta.title || 'Dashboard')

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('Logged out successfully')
  router.push('/login')
}
</script>
<style lang="scss" scoped>
.navbar-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .left-section {
    display: flex;
    align-items: center;

    .toggle-icon {
      font-size: 20px;
      cursor: pointer;
      color: #606266;
      display: flex;
      align-items: center;
      &:hover { color: #409eff; }
    }

    .ml-15 { 
      margin-left: 15px; 
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 24px;

    .icon-btn {
      font-size: 20px;
      color: #606266;
      cursor: pointer;
      &:hover { color: #409eff; }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: #f5f7fa;
      }

      .username {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }
  }
}

// Simple fix for breadcrumb alignment
:deep(.el-breadcrumb) {
  font-size: 14px;
}
</style>