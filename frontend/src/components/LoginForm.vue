<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
    <button
      type="submit"
      :disabled="loading"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span v-if="loading">Loading...</span>
      <span v-else>Login</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthApi } from '../composables/useAuthApi'
import { useAuthStore } from '../stores/authStore'
import type { User } from '../stores/authStore'

const email = ref('')
const password = ref('')
const { login, loading, error } = useAuthApi()
const authStore = useAuthStore()

const handleSubmit = async () => {
  try {
    const response = await login(email.value, password.value)
    const userData: User = {
      id: response.user.id,
      email: response.user.email,
      token: response.user.token,
      createdAt: new Date(response.user.createdAt),
      updatedAt: new Date(response.user.updatedAt)
    }
    authStore.setUser(userData)
  } catch (e) {
    // Error is handled by useAuthApi
  }
}
</script> 