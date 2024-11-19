import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TaskThing } from '../types/taskThing'

export const useTaskThingStore = defineStore('taskThing', () => {
  const taskThings = ref<TaskThing[]>([])

  const addTaskThing = (taskThing: TaskThing) => {
    taskThings.value.push(taskThing)
  }

  const removeTaskThing = (taskId: string, thingId: string) => {
    taskThings.value = taskThings.value.filter(
      tt => !(tt.taskId === taskId && tt.thingId === thingId)
    )
  }

  const getThingsByTaskId = computed(() => (taskId: string) => {
    return taskThings.value.filter(tt => tt.taskId === taskId)
  })

  const getTasksByThingId = computed(() => (thingId: string) => {
    return taskThings.value.filter(tt => tt.thingId === thingId)
  })

  return {
    taskThings,
    addTaskThing,
    removeTaskThing,
    getThingsByTaskId,
    getTasksByThingId
  }
}) 