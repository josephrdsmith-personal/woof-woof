import { mande } from 'mande'
import { ref } from 'vue'
import * as yup from 'yup'
import type { UserDTO, LoginResponse } from '../types/user'

const api = mande('/api/auth')

// Add validation schemas
const emailSchema = yup.string().email().required()
const passwordSchema = yup.string().min(8).required()

const authSchema = yup.object({
  email: emailSchema,
  password: passwordSchema
})

export function useAuthApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const validateCredentials = async (email: string, password: string) => {
    await authSchema.validate({ email, password })
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    loading.value = true
    error.value = null
    try {
      await validateCredentials(email, password)
      const response = await api.post<LoginResponse>('/login', { email, password })
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  const signup = async (email: string, password: string): Promise<LoginResponse> => {
    loading.value = true
    error.value = null
    try {
      await validateCredentials(email, password)
      const response = await api.post<LoginResponse>('/signup', { email, password })
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Signup failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    login,
    signup,
    loading,
    error
  }
} 