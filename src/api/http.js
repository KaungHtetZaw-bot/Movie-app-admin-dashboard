import router from '@/router'
import { useAuthStore } from '@/store/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000
})

/**
 * Request interceptor
 * - Attach token
 */
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * Response interceptor
 * - Global error handling
 */
http.interceptors.response.use(
  res => res.data,
  async err => {
    const authStore = useAuthStore()
    const originalRequest = err.config
    const status = err.response?.status

    if(status === 401 && !originalRequest._retry && !['/login', '/register'].includes(originalRequest.url)) {
      originalRequest._retry = true
      try {
        const response = await axios.post(`${http.defaults.baseURL}/refresh`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const newToken = response.data.acess_token
        authStore.token = newToken
        localStorage.setItem('token', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      } catch (refreshError) {
        authStore.logout()
        router.replace('/login')
        return Promise.reject(refreshError)
      }
    }

    if (status === 403) {
      ElMessage.error('Permission denied')
    }
    return Promise.reject(err)
  }
)
export default http
