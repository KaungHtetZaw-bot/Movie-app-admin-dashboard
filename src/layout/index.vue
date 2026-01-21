<template>
  <el-container class="layout-wrapper">
    <el-aside :width="adminStore.isSidebarCollapsed ? '64px' : '0px'" class="aside-container">
      <Sidebar />
    </el-aside>

    <el-container class="main-container" :style="{ marginLeft: adminStore.isSidebarCollapsed ? '40px' : '220px' }">
      <el-header height="64px">
        <Navbar />
      </el-header>

      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { useAdminStore } from '@/store/admin'

const adminStore = useAdminStore()
</script>

<style lang="scss" scoped>
.layout-wrapper {
  min-height: 100vh;
  background-color: #f8fafc; // Light slate background for the whole app
}

.aside-container {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1001;
}

.main-container {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  min-width: 0; // Prevents flex items from overflowing
}

.el-header {
  padding: 0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.el-main {
  padding: 0; // Padding is usually handled inside the views for better control
}

/* Page Transition Animation */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
</style>