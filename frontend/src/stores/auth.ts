import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  async function login(email: string, password: string) {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
    const { user: userData, token: tokenData } = response.data.data
    user.value = userData
    token.value = tokenData
    localStorage.setItem('auth_token', tokenData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  function loadUser() {
    const saved = localStorage.getItem('user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loadUser
  }
})