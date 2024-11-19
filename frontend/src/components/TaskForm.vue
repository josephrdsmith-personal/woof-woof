<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Task } from '../types/Task'

export default defineComponent({
  name: 'TaskForm',
  emits: ['task-created'],
  setup(_, { emit }) {
    const title = ref('')
    const error = ref<string | null>(null)

    const handleSubmit = async () => {
      if (!title.value.trim()) {
        error.value = 'Title is required'
        return
      }

      const newTask: Omit<Task, 'id'> = {
        title: title.value.trim(),
        completed: false
      }

      emit('task-created', newTask)
      title.value = ''
      error.value = null
    }

    return {
      title,
      error,
      handleSubmit
    }
  }
})
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <input
        v-model="title"
        class="task-input"
        type="text"
        placeholder="Enter new task..."
      />
      <button type="submit" class="submit-button">Add Task</button>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </form>
</template>

<style scoped>
.task-form {
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  gap: 0.5rem;
}

.task-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style> 