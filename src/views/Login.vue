<template>
  <div class="login-wrapper">
    <div class="bg-mesh"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    
    <el-card class="premium-login-card" shadow="never">
      <div class="login-brand">
        <div class="brand-logo">
          <el-icon><VideoCameraFilled /></el-icon>
        </div>
        <h1>Cinema Admin</h1>
        <p>Enter your credentials to manage the platform</p>
      </div>

      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-position="top"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="Email Address" prop="email">
          <el-input 
            v-model="loginForm.email" 
            placeholder="admin@cinema.com"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="••••••••"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-link">Forgot password?</el-link>
        </div>

        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="authStore.isLoading" 
          @click="handleLogin"
        >
          Access Dashboard
        </el-button>
        
        <div class="register-hint">
          New to the platform? <el-link type="primary" @click="router.push('/register')">Create Account</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, VideoCameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)
const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Identity required', trigger: 'blur' },
    { type: 'email', message: 'Invalid format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password required', trigger: 'blur' },
    { min: 6, message: 'Security minimum: 6 characters', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      authStore.login(loginForm,router)
    }
  })
}
</script>
<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$primary: #6366f1; // Indigo
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.login-wrapper {
  height: 100vh; width: 100vw;
  display: flex; justify-content: center; align-items: center;
  background: #0f172a; // Deep Navy/Slate
  position: relative; overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

// Animated Decorative Background
.bg-mesh {
  position: absolute; inset: 0;
  background-image: radial-gradient(#1e293b 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}

.bg-orb {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15;
  &.orb-1 { top: -100px; right: -100px; width: 400px; height: 400px; background: $primary; }
  &.orb-2 { bottom: -100px; left: -100px; width: 300px; height: 300px; background: #ec4899; }
}

.premium-login-card {
  width: 100%; 
  max-width: 440px;
  height: 85%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.login-brand {
  text-align: center; margin-bottom: 40px;
  .brand-logo {
    width: 64px; height: 64px; background: $text-main; color: white;
    border-radius: 18px; display: flex; align-items: center;
    justify-content: center; font-size: 28px; margin: 0 auto 20px;
  }
  h1 { font-size: 28px; color: $text-main; font-weight: 800; letter-spacing: -1px; }
  p { color: $text-muted; font-size: 15px; margin-top: 6px; }
}

// Input Styling
:deep(.el-input__wrapper) {
  background: #f8fafc; box-shadow: none; border: 1px solid #e2e8f0;
  border-radius: 12px; padding: 12px 16px; transition: all 0.3s $ease;
  &.is-focus { border-color: $primary; background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
}

:deep(.el-form-item__label) {
  font-weight: 700; color: $text-main; font-size: 13px; margin-bottom: 8px;
}

.form-options {
  display: flex; justify-content: space-between; align-items: center; margin: 24px 0;
  .forgot-link { font-weight: 600; font-size: 13px; }
}

.submit-btn {
  width: 100%; 
  height: 54px; 
  background: $text-main; 
  border: none;
  font-size: 16px; 
  font-weight: 700; 
  border-radius: 14px;
  transition: all 0.3s $ease;
  &:hover { 
    background: #1e293b; 
    transform: translateY(-2px); 
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); }
}

.register-hint {
  text-align: center; margin-top: 32px; font-size: 14px; color: $text-muted;
  .el-link { font-weight: 700; }
}
</style>