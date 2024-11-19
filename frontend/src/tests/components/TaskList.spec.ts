import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../../components/TaskList.vue'
import type { Task } from '../../types/Task'

describe('TaskList', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ]

  it('renders loading state correctly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        isLoading: true
      }
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading tasks...')
  })

  it('renders empty state when no tasks are available', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        isLoading: false
      }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('renders tasks in correct order', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false
      }
    })

    const taskItems = wrapper.findAll('.task-item')
    expect(taskItems).toHaveLength(2)
    expect(taskItems[0].text()).toContain('Task 1') // Incomplete task first
    expect(taskItems[1].text()).toContain('Task 2') // Complete task second
  })

  it('emits toggle-task event when checkbox is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false
      }
    })

    await wrapper.find('input[type="checkbox"]').trigger('change')

    expect(wrapper.emitted('toggle-task')).toBeTruthy()
    expect(wrapper.emitted('toggle-task')![0][0]).toEqual(mockTasks[0])
  })

  it('emits delete-task event when delete button is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false
      }
    })

    await wrapper.find('.delete-button').trigger('click')

    expect(wrapper.emitted('delete-task')).toBeTruthy()
    expect(wrapper.emitted('delete-task')![0][0]).toEqual(mockTasks[0])
  })
}) 