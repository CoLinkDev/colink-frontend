import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.clearToken()
      // Optional: Handle refresh token logic here
      router.push({ name: 'Login' })
    }
    return Promise.reject(error)
  }
)

export default request
