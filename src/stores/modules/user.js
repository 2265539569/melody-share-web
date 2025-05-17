import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'ms-token',
  () => {
    const token = ref(null)
    const setToken = (newToken) => {
      token.value = newToken
    }
    const logout = () => {
      token.value = null
    }

    return {
      token,
      setToken,
      logout
    }
  },
  {
    persist: true
  }
)
