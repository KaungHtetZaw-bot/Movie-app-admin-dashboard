<template>
  <div class="login-wrapper"> <div class="bg-mesh"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    
    <el-card class="premium-register-card" shadow="never">
      <div class="login-brand">
        <div class="brand-logo">
          <el-icon><VideoCameraFilled /></el-icon>
        </div>
        <h1>Join the Cinema</h1>
        <p>Create your administrator account</p>
      </div>

      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerFormRef"
        label-position="top"
        class="login-form"
        @keyup.enter="handleRegister"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Full Name" prop="name">
              <el-input v-model="registerForm.name" placeholder="John Doe" :prefix-icon="User" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Email Address" prop="email">
          <el-input v-model="registerForm.email" placeholder="admin@cinema.com" :prefix-icon="Message" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Password" prop="password">
              <el-input v-model="registerForm.password" type="password" show-password :prefix-icon="Lock" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Confirm" prop="password_confirmation">
              <el-input v-model="registerForm.password_confirmation" type="password" show-password :prefix-icon="Check" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-button 
          type="primary" 
          class="submit-btn" 
          :loading="loading" 
          @click="handleRegister"
        >
          Create Account
        </el-button>

        <div class="register-hint">
          Already part of the crew? <el-link type="primary" @click="router.push('/login')">Sign In</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, Message, Check, VideoCameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('Passwords do not match!'))
  } else {
    callback()
  }
}

const rules = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Create a password', trigger: 'blur' },
    { min: 6, message: 'Security minimum: 6 chars', trigger: 'blur' }
  ],
  password_confirmation: [
    { required: true, message: 'Confirm your password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await http.post('/register', registerForm)
        ElMessage({
          message: 'Account Created! Please contact a Super Admin to activate your access.',
          type: 'warning',
          duration: 6000,
          showClose: true,
          customClass: 'premium-message'
        })
        router.push('/login')
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Registration failed')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$primary: #6366f1;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

/* Reusing the wrapper styles from Login.vue */
.login-wrapper {
  height: 100vh; width: 100vw;
  display: flex; justify-content: center; align-items: center;
  background: #0f172a;
  position: relative; overflow: hidden;
}

.premium-register-card {
  width: 100%; max-width: 500px; /* Slightly wider for two-column rows */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 28px;
  border: none;
  padding: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

/* ... (Keep the .bg-mesh, .bg-orb, and .login-brand styles from Login.vue) ... */

:deep(.el-input__wrapper) {
  background: #f8fafc; box-shadow: none; border: 1px solid #e2e8f0;
  border-radius: 12px; padding: 10px 14px; transition: all 0.3s $ease;
  &.is-focus { border-color: $primary; background: white; }
}

.submit-btn {
  width: 100%; height: 50px; background: $text-main; border: none;
  font-size: 16px; font-weight: 700; border-radius: 14px; margin-top: 20px;
  &:hover { background: #1e293b; transform: translateY(-2px); }
}

.register-hint {
  text-align: center; margin-top: 24px; font-size: 14px; color: $text-muted;
}
</style>