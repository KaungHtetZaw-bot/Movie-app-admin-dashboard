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
          Already part of the crew? <el-link type="primary" underline="never" @click="router.push('/login')">Sign In</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
    <el-dialog 
      v-model="showOtpDialog" 
      width="440px" 
      :close-on-click-modal="false" 
      :show-close="false"
      class="otp-dialog"
      align-center
    >
      <div class="otp-container">
        <div class="icon-box">
          <el-icon><Message /></el-icon>
        </div>
        <h2>Verify your email</h2>
        <p>We've sent a 6-digit verification code to <br><strong>{{ registerForm.email }}</strong></p>

        <div class="otp-input-group">
          <input 
            v-for="(digit, index) in 6" 
            :key="index"
            v-model="otpDigits[index]"
            type="text"
            maxlength="1"
            class="otp-slot"
            :id="'digit-' + index"
            @input="handleInput(index, $event)"
            @keydown.delete="handleDelete(index, $event)"
          />
        </div>

        <el-button 
          type="primary" 
          class="verify-btn" 
          :loading="isVerifying" 
          @click="submitVerification"
        >
          Confirm & Log In
        </el-button>

        <p class="resend-text">
          Didn't receive the code? 
          <el-button link type="primary" @click="handleRegister">Resend</el-button>
        </p>
      </div>
    </el-dialog>
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
const showOtpDialog = ref(false);
const isVerifying = ref(false);
const otpDigits = reactive(['', '', '', '', '', '']);

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
  if (!registerFormRef.value) return;
  try {
    loading.value = true
    await registerFormRef.value.validate()
    await http.post('/register', registerForm)
    showOtpDialog.value = true;
    console.log('Registration successful, OTP dialog shown.',showOtpDialog.value);
  } catch (error) {
    console.error('Registration error:', error?.password_confirmation);
    const name = error?.name?.[0]?.message;
    const ConfirmPassword = error?.password_confirmation?.[0]?.message || error?.password_confirmation?.[0]?.error;
    ElMessage.error(name || ConfirmPassword || error.response?.data?.message || 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleInput = (index, event) => {
  const value = event.target.value;
  if (value && index < 5) {
    document.getElementById(`digit-${index + 1}`).focus();
  }
};

const handleDelete = (index, event) => {
  if (!otpDigits[index] && index > 0) {
    document.getElementById(`digit-${index - 1}`).focus();
  }
};

const submitVerification = async () => {
  const otpCode = otpDigits.join('');
  if (otpCode.length < 6) {
    ElMessage.error('Please enter the complete 6-digit code.');
    return;
  }
  try {
    isVerifying.value = true;
    await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const payload = {
          ...registerForm,
          code: otpCode
        };
        console.log('Submitting OTP code:', typeof(otpCode), otpCode);
        await http.post('/verify-code', payload)
        ElMessage({
          message: 'Account Created! Please contact a Super Admin to activate your access.',
          type: 'warning',
          duration: 6000,
          showClose: true,
          customClass: 'premium-message'
        })
        router.push('/login')
      } catch (error) {
        console.log('OTP verification error:', error);
        ElMessage.error(error.response?.data?.message || 'Registration failed')
      } finally {
        loading.value = false
      }
    }
  })
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'OTP verification failed. Please try again.');
  } finally {
    isVerifying.value = false;
  }
};
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

.otp-container {
  text-align: center;
  padding: 20px 10px;

  .icon-box {
    width: 60px; height: 60px; background: #f0f7ff; color: #3b82f6;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 28px;
  }

  h2 { font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 30px; }

  .otp-input-group {
    display: flex; justify-content: center; gap: 10px; margin-bottom: 30px;

    .otp-slot {
      width: 45px; height: 55px; text-align: center; font-size: 24px; font-weight: 700;
      border: 2px solid #e2e8f0; border-radius: 12px; background: #f8fafc;
      transition: all 0.2s ease;
      
      &:focus { border-color: #3b82f6; background: #fff; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
    }
  }

  .verify-btn { width: 100%; height: 50px; border-radius: 12px; font-weight: 700; font-size: 16px; }
  .resend-text { margin-top: 20px; font-size: 13px; }
}
</style>