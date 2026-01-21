<template>
  <div class="sidebar-container">
    <div class="logo-wrapper">
      <div class="logo-icon">M</div>
      <span v-if="!adminStore.isSidebarCollapsed" class="logo-text">MovieAdmin</span>
    </div>

    <div class="sidebar-wrapper">
      <el-menu
      router
      :default-active="route.path"
      class="modern-menu"
      :collapse="adminStore.isSidebarCollapsed"
    >
      <el-menu-item index="/dashboard">
        <el-icon><Monitor /></el-icon>
        <span>Dashboard</span>
      </el-menu-item>

      <el-menu-item index="/users">
        <el-icon><User /></el-icon>
        <span>User Management</span>
      </el-menu-item>

      <el-menu-item index="/purchases">
        <el-icon><ShoppingCart /></el-icon>
        <span>Purchases</span>
      </el-menu-item>

      <el-menu-item index="/plans">
        <el-icon><GoldMedal /></el-icon>
        <span>Pricing Plans</span>
      </el-menu-item>

      <el-menu-item index="/payments">
        <el-icon><Wallet /></el-icon>
        <span>Payment Gateways</span>
      </el-menu-item>

      <div class="menu-divider"></div>

      <el-menu-item @click="handleLogout" class="logout-item">
        <el-icon><SwitchButton /></el-icon>
        <span>Log Out</span>
      </el-menu-item>
    </el-menu>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Monitor, User, ShoppingCart, 
  GoldMedal, Wallet, SwitchButton 
} from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const handleLogout = () => {
  ElMessageBox.confirm('Are you sure you want to log out?', 'Logout', {
    confirmButtonText: 'Logout',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role_id')
    ElMessage.success('Logged out successfully')
    router.push('/login')
  })
}
</script>
<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #f0f0f0;
  position: fixed;

  .logo-wrapper {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #409eff, #3a8ee6);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
    }

    .logo-text {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2f3d;
      letter-spacing: -0.5px;
    }
  }

  .modern-menu {
    border-right: none;
    padding-left: 12px;
    width: 100%;

    .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin-bottom: 4px;
      border-radius: 8px 0 0 8px;
      color: #606266;

      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }

      &.is-active {
        background-color: #ecf5ff;
        color: #409eff;
        font-weight: 600;
        
        &::before {
          content: "";
          position: absolute;
          left: -12px;
          height: 20px;
          width: 4px;
          background: #409eff;
          border-radius: 0 4px 4px 0;
        }
      }

      .el-icon {
        font-size: 18px;
        margin-right: 12px;
      }
    }

    .menu-divider {
      height: 1px;
      background: #f0f0f0;
      margin: 20px 12px;
    }

    .logout-item {
      color: #f56c6c;
      &:hover {
        background-color: #fef0f0;
        color: #f56c6c;
      }
    }
  }
}
</style>