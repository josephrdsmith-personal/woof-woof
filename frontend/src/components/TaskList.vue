<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Task } from '../types/Task'

export default defineComponent({
  name: 'TaskList',
  props: {
    tasks: {
      type: Array as () => Task[],
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-task', 'delete-task'],
  setup(props, { emit }) {
    const sortedTasks = computed(() => {
      return [...props.tasks].sort((a, b) => {
        // Sort by completion status first, then by id
        if (a.completed === b.completed) {
          return b.id - a.id // Newer tasks first
        }
        return a.completed ? 1 : -1 // Incomplete tasks first
      })
    })

    const toggleTask = (task: Task) => {
      emit('toggle-task', task)
    }

    const deleteTask = (task: Task) => {
      emit('delete-task', task)
    }

    return {
      sortedTasks,
      toggleTask,
      deleteTask
    }
  }
})
</script>

<template>
  <div class="task-list">
    <div v-if="isLoading" class="loading">
      Loading tasks...
    </div>
    <div v-else-if="!tasks.length" class="empty-state">
      No tasks available. Add some tasks to get started!
    </div>
    <ul v-else>
      <li v-for="task in sortedTasks" :key="task.id" class="task-item">
        <div class="task-content">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="toggleTask(task)"
          />
          <span :class="{ completed: task.completed }">{{ task.title }}</span>
        </div>
        <button @click="deleteTask(task)" class="delete-button">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 1rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.delete-button {
  padding: 0.25rem 0.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}
</style> 