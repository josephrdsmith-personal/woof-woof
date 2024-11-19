import { ref } from '@vue/runtime-core'
import type { Ref } from '@vue/runtime-core'
import type { Task } from '../types/Task'

interface TaskApiReturn {
  tasks: Ref<Task[]>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  fetchTasks: () => Promise<void>
  createTask: (taskData: Omit<Task, 'id'>) => Promise<Task>
}

export function useTaskApi(): TaskApiReturn {
  const tasks = ref<Task[]>([])
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const fetchTasks = async () => {
    isLoading.value = true
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      tasks.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      tasks.value = [...tasks.value, newTask]
      return newTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
      throw err
    }
  }

  return {
    tasks,
    error,
    isLoading,
    fetchTasks,
    createTask,
  }
} 