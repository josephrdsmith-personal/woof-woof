import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTaskApi } from '../../composables/useTaskApi'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, onMounted } from 'vue'

describe('useTaskApi Composable', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ]

  const mockFetch = vi.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('fetches tasks successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks)
    })

    const TestComponent = defineComponent({
      setup() {
        const { tasks, fetchTasks } = useTaskApi()
        onMounted(() => {
          fetchTasks()
        })
        return { tasks }
      },
      template: '<div>{{ tasks }}</div>'
    })

    const wrapper = mount(TestComponent)
    
    await flushPromises()

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks')
    expect(wrapper.vm.tasks).toEqual(mockTasks)
  })

  it('handles task creation', async () => {
    const newTask = { id: 1, title: 'New Task', completed: false }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newTask)
    })

    const TestComponent = defineComponent({
      setup() {
        const { tasks, createTask } = useTaskApi()
        onMounted(async () => {
          await createTask({ title: 'New Task', completed: false })
        })
        return { tasks }
      },
      template: '<div>{{ tasks }}</div>'
    })

    const wrapper = mount(TestComponent)
    
    await flushPromises()

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Task', completed: false }),
    })
    
    expect(wrapper.vm.tasks).toContainEqual(newTask)
  })
}) 