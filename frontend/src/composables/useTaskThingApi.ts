import { mande } from 'mande'
import { ref } from 'vue'
import type { TaskThing, TaskThingDTO, CreateTaskThingDTO } from '../types/taskThing'
import { deserializeDate } from '../utils/dateUtils'

const api = mande('/api/task-things')

export function useTaskThingApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deserializeTaskThing = (dto: TaskThingDTO): TaskThing => ({
    ...dto,
    createdAt: deserializeDate(dto.createdAt)
  })

  const associateThingWithTask = async (data: CreateTaskThingDTO): Promise<TaskThing> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<TaskThingDTO>('/', data)
      return deserializeTaskThing(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const removeThingFromTask = async (taskId: string, thingId: string): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/${taskId}/things/${thingId}`)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getThingsForTask = async (taskId: string): Promise<TaskThing[]> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<TaskThingDTO[]>(`/${taskId}/things`)
      return response.map(deserializeTaskThing)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    associateThingWithTask,
    removeThingFromTask,
    getThingsForTask,
    loading,
    error
  }
} 