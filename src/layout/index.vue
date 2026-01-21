<template>
  <el-container class="layout-wrapper">
    <el-aside 
      :width="adminStore.isSidebarCollapsed ? '20px' : '0px'" 
      class="aside-container"
    >
      <Sidebar />
    </el-aside>

    <el-container 
      class="main-container" 
      :style="{ marginLeft: adminStore.isSidebarCollapsed ? '80px' : '260px' }"
    >
      <el-header height="72px"> <Navbar />
      </el-header>

      <el-main class="content-body">
        <router-view v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
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
// Premium Curve: Starts fast, ends very gently
$ease-premium: cubic-bezier(0.25, 1, 0.5, 1);
$duration: 0.5s;

.layout-wrapper {
  min-height: 100vh;
  background-color: #fcfcfd; // Cleaner, almost-white background
}

.aside-container {
  transition: width $duration $ease-premium;
  overflow: hidden;
  z-index: 1001;
  background: #fff;
}

.main-container {
  transition: margin-left $duration $ease-premium;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: transparent;
}

.el-header {
  padding: 0;
  background: transparent; // Let the Navbar's glassmorphism shine
  position: sticky;
  top: 0;
  z-index: 1000;
}

.content-body {
  padding: 24px 32px; // generous spacing for premium feel
  overflow-x: hidden;
}

/* PREMIUM PAGE TRANSITION 
   Instead of just sliding, it slightly scales for a "depth" effect
*/
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s $ease-premium;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.01);
}
</style>