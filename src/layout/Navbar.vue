<template>
  <div class="navbar-container">
    <div class="left-section">
      <div class="toggle-wrapper" @click="adminStore.toggleSidebar">
        <div class="burger-icon" :class="{ 'is-active': !adminStore.isSidebarCollapsed }">
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="breadcrumb-wrapper">
        <span class="root-path">Home</span>
        <span class="separator">/</span>
        <span class="current-path">{{ currentRouteName }}</span>
      </div>
    </div>

    <div class="right-section">
      <div class="action-item">
        <el-badge :value="5" :offset="[0, 5]" class="custom-badge">
          <el-icon class="icon-btn"><Bell /></el-icon>
        </el-badge>
      </div>

      <el-dropdown trigger="click" border-radius="12">
        <div class="user-trigger">
          <div class="avatar-wrapper">
            <img src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" alt="admin">
          </div>
          <div class="user-meta">
            <span class="username">Administrator</span>
            <span class="role">Super Admin</span>
          </div>
          <el-icon class="chevron"><ArrowDown /></el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu class="premium-dropdown">
            <el-dropdown-item :icon="User" @click="router.push('/profile')">Profile</el-dropdown-item>
            <el-dropdown-item :icon="Setting" @click="router.push('/setting')">System Settings</el-dropdown-item>
            <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout" class="logout-link">
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
const currentRouteName = computed(() => route.meta.title || 'Overview')

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('Logged out successfully')
  router.push('/login')
}
</script>
<style lang="scss" scoped>
// Premium Design Variables
$text-main: #0f172a;
$text-muted: #64748b;
$bg-hover: #f8fafc;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.navbar-container {
  height: 72px; // Slightly taller for better breathing room
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px); // Glassmorphism effect
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;

  .left-section {
    display: flex;
    align-items: center;
    gap: 24px;

    .toggle-wrapper {
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      transition: background 0.4s $ease;
      &:hover { background: $bg-hover; }

      .burger-icon {
        width: 18px;
        height: 12px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        span {
          display: block;
          height: 2px;
          width: 100%;
          background: $text-main;
          border-radius: 2px;
          transition: all 0.4s $ease;
        }

        &.is-active span:nth-child(2) { width: 60%; }
      }
    }

    .breadcrumb-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      letter-spacing: -0.2px;

      .root-path { color: $text-muted; font-weight: 400; }
      .separator { color: #cbd5e1; font-size: 12px; }
      .current-path { color: $text-main; font-weight: 600; }
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-item {
      padding: 10px;
      cursor: pointer;
      border-radius: 10px;
      transition: background 0.3s $ease;
      &:hover { background: $bg-hover; }
      
      .icon-btn { font-size: 20px; color: $text-main; }
    }

    .user-trigger {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 12px;
      transition: all 0.3s $ease;

      &:hover {
        background: $bg-hover;
        .chevron { transform: translateY(2px); }
      }

      .avatar-wrapper {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        img { width: 100%; height: 100%; object-fit: cover; }
      }

      .user-meta {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
        
        .username { font-size: 14px; font-weight: 600; color: $text-main; }
        .role { font-size: 11px; font-weight: 500; color: $text-muted; text-transform: uppercase; letter-spacing: 0.5px; }
      }

      .chevron { font-size: 12px; color: $text-muted; transition: transform 0.3s $ease; }
    }
  }
}
</style>