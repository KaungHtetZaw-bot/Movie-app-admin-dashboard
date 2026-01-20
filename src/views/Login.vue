<template>
  <div class="login-wrapper">
    <div class="bg-decoration"></div>
    
    <el-card class="modern-login-card" shadow="always">
      <div class="login-brand">
        <div class="brand-logo">M</div>
        <h1>Movie Admin</h1>
        <p>Sign in to your dashboard</p>
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
            placeholder="name@company.com"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            :prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
          <el-link type="primary" :underline="false">Forgot password?</el-link>
        </div>

        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="loading" 
          @click="handleLogin"
        >
          Sign In
        </el-button>
        
        <div class="register-hint">
          Don't have an account? <el-link type="primary" @click="router.push('/register')">Register</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await http.post('/login', loginForm)
        
        localStorage.setItem('token', response.token)
        const role = response.user.role_id

        if(role!==1){
            ElMessage.success('Login Successful')
            router.push('/dashboard')
        }else{
            ElMessage.error("Unauthorized Account")
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Login Failed')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

// Modern Gradient Background
.bg-decoration {
  position: absolute;
  top: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(64,158,255,0.1) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
}

.modern-login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  border: none;
  padding: 20px;
  z-index: 1;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.login-brand {
  text-align: center;
  margin-bottom: 32px;

  .brand-logo {
    width: 48px;
    height: 48px;
    background: #409eff;
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0 auto 16px;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }

  h1 {
    font-size: 24px;
    color: #1e293b;
    margin: 0;
    font-weight: 700;
  }

  p {
    color: #64748b;
    font-size: 14px;
    margin-top: 8px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.register-hint {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}
</style>