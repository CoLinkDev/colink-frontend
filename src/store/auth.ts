import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const email = ref(localStorage.getItem('email') || '')

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setEmail(newEmail: string) {
    email.value = newEmail
    localStorage.setItem('email', newEmail)
  }

  function clearToken() {
    token.value = ''
    email.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('email')
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res: any = await request.get('/me')
      if (res.code === 0 && res.data?.email) {
        setEmail(res.data.email)
      }
    } catch (e) {
      console.error('Failed to fetch profile', e)
    }
  }

  return { token, email, isAuthenticated, setToken, setEmail, clearToken, fetchProfile }
})
