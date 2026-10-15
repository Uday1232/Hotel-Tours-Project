import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const notification = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 5000)
  }

  function clearNotification() {
    notification.value = null
  }

  return {
    isLoading,
    notification,
    setLoading,
    showNotification,
    clearNotification
  }
})