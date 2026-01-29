import router from '@/router'
import axios from 'axios'

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
  err => {
    const status = err.response?.status
    const url = err.config?.url

    // 🚫 Don't redirect on login/register errors
    const authRoutes = ['/login', '/register']

    if (status === 401 && !authRoutes.includes(url)) {
      localStorage.removeItem('token')
      router.replace('/login')
    }

    return Promise.reject(err)
  }
)

export default http
