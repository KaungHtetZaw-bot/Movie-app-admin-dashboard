<template>
  <div class="sidebar-container" :class="{ 'is-collapsed': adminStore.isSidebarCollapsed }">
    <div class="logo-section">
      <div class="logo-box">
        <div class="logo-icon">M</div>
        <span v-if="!adminStore.isSidebarCollapsed" class="logo-text">MovieAdmin</span>
      </div>
    </div>

    <div class="menu-area">
      <el-menu
        router
        :default-active="route.path"
        class="premium-menu"
        :collapse="adminStore.isSidebarCollapsed"
        :collapse-transition="true"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>Overview</template>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>User Management</template>
        </el-menu-item>

        <el-menu-item index="/purchases">
          <el-icon><ShoppingCart /></el-icon>
          <template #title>Purchases</template>
        </el-menu-item>

        <el-menu-item index="/plans">
          <el-icon><GoldMedal /></el-icon>
          <template #title>Subscription Plans</template>
        </el-menu-item>

        <el-menu-item index="/payments">
          <el-icon><Wallet /></el-icon>
          <template #title>Payment Accounts</template>
        </el-menu-item>

        <div class="spacer"></div>

        <div class="footer-section">
          <el-menu-item @click="handleLogout" index="#" class="logout-item">
            <el-icon><SwitchButton /></el-icon>
            <template #title>Sign Out</template>
          </el-menu-item>
        </div>
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
// Variables for a "Slate" Premium Look
$bg-sidebar: #ffffff;
$text-main: #0f172a;
$text-muted: #64748b;
$accent-dark: #1e293b;
$ease-premium: cubic-bezier(0.25, 1, 0.5, 1);
$sidebar-width: 260px;

.sidebar-container {
  height: 100vh;
  background-color: $bg-sidebar;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.5s $ease-premium;
  width: $sidebar-width;
  z-index: 1001;

  &.is-collapsed {
    width: 80px;
    .logo-section { padding: 24px 0; justify-content: center; }
  }

  .logo-section {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 28px;
    transition: all 0.5s $ease-premium;

    .logo-box {
      display: flex;
      align-items: center;
      gap: 14px;

      .logo-icon {
        width: 36px;
        height: 36px;
        background: $accent-dark;
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);
      }

      .logo-text {
        font-size: 1.1rem;
        font-weight: 800;
        color: $text-main;
        letter-spacing: -0.5px;
        white-space: nowrap;
      }
    }
  }

  .menu-area {
    flex: 1;
    padding: 0 12px;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar { width: 0; } // Hide scrollbar for clean look
  }

  .premium-menu {
    border-right: none;
    background: transparent;

    .el-menu-item {
      height: 48px;
      margin-bottom: 4px;
      border-radius: 12px;
      color: $text-muted;
      transition: all 0.4s $ease-premium;

      .el-icon {
        font-size: 20px;
        transition: transform 0.4s $ease-premium;
      }

      &:hover {
        background-color: #f8fafc;
        color: $text-main;
        .el-icon { transform: scale(1.1); }
      }

      &.is-active {
        background-color: #f1f5f9; // Very light slate
        color: $text-main;
        font-weight: 600;

        &::after { // Subtle indicator instead of the blue bar
          content: "";
          position: absolute;
          right: 12px;
          width: 5px;
          height: 5px;
          background: $accent-dark;
          border-radius: 50%;
        }
      }
    }
  }

  .spacer { flex: 1; }

  .footer-section {
    padding-bottom: 24px;
    .logout-item {
      color: #ef4444;
      &:hover { background-color: #fef2f2 !important; }
    }
  }
}

.menu-title-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.premium-dot {
  margin-left: 8px;
  :deep(.el-badge__content) {
    background-color: #10b981; // Emerald for "online/new" feel
  }
}
</style>