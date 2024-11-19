import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskForm from '../../components/TaskForm.vue'

describe('TaskForm', () => {
  it('emits task-created event with correct data when form is submitted', async () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input')
    const form = wrapper.find('form')
    
    await input.setValue('New Task')
    await form.trigger('submit')

    expect(wrapper.emitted('task-created')).toBeTruthy()
    expect(wrapper.emitted('task-created')![0][0]).toEqual({
      title: 'New Task',
      completed: false
    })
  })

  it('shows error message when submitting empty title', async () => {
    const wrapper = mount(TaskForm)
    const form = wrapper.find('form')
    
    await form.trigger('submit')

    expect(wrapper.find('.error-message').text()).toBe('Title is required')
    expect(wrapper.emitted('task-created')).toBeFalsy()
  })

  it('clears input after successful submission', async () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input')
    const form = wrapper.find('form')
    
    await input.setValue('New Task')
    await form.trigger('submit')

    expect((input.element as HTMLInputElement).value).toBe('')
  })
}) 