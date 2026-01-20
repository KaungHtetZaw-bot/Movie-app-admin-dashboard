<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="register-header">
          <h2>Create Account</h2>
          <p>Join our movie platform</p>
        </div>
      </template>

      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerFormRef"
        label-position="top"
        @keyup.enter="handleRegister"
      >
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="registerForm.name" placeholder="" :prefix-icon="User" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" placeholder="" :prefix-icon="Message" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="registerForm.password" type="" show-password :prefix-icon="Lock" />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="password_confirmation">
          <el-input v-model="registerForm.password_confirmation" type="password" show-password :prefix-icon="Check" />
        </el-form-item>

        <el-button type="primary" class="register-button" :loading="loading" @click="handleRegister">
          Register
        </el-button>

        <div class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, Message, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http' // Your axios instance
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

// Custom validator to check if passwords match
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('Passwords do not match!'))
  } else {
    callback()
  }
}

const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Minimum 6 characters', trigger: 'blur' }
  ],
  password_confirmation: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { data } = await http.post('/register', registerForm)
        
        ElMessage.success('Registration successful! Please login.')
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

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
.register-card {
  width: 400px;
}
.register-button {
  width: 100%;
  margin-top: 10px;
}
.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>