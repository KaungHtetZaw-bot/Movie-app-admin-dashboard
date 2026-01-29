<template>
  <div class="app-container">
    <transition name="fade-slow">
      <div v-if="authStore.isLoadingProfile" class="initial-load-container">
        <div class="loader-content">
          <div class="logo-pulse">
            <el-icon :size="50" color="#6366f1"><VideoCameraFilled /></el-icon>
          </div>
          <p>Cinema Admin</p>
          <div class="loading-bar"></div>
        </div>
      </div>
    </transition>

    <router-view v-if="!authStore.isLoadingProfile" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchProfile()
  }
})
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

/* Transition Effects */
.fade-slow-leave-active {
  transition: opacity 0.8s ease;
}
.fade-slow-leave-to {
  opacity: 0;
}

.initial-load-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
  color: white;
}

.loader-content {
  text-align: center;
  
  p {
    margin-top: 20px;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0.8;
  }
}

/* Logo Pulse Animation */
.logo-pulse {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

/* Optional: Slim loading bar at the bottom */
.loading-bar {
  width: 120px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 15px auto;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  
  &:after {
    content: '';
    position: absolute;
    left: -100%;
    width: 100%;
    height: 100%;
    background: #6366f1;
    animation: loading-progress 1.5s infinite linear;
  }
}

@keyframes loading-progress {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
