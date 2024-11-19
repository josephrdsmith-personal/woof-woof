import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  email: string
  token: string
  createdAt: Date
  updatedAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  function setUser(userData: User) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    setUser,
    clearUser
  }
}) 