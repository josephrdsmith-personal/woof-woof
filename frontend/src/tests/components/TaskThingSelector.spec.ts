import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import TaskThingSelector from '../../components/TaskThingSelector.vue'
import { useThingStore } from '../../stores/thingStore'
import { useTaskThingStore } from '../../stores/taskThingStore'

describe('TaskThingSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountComponent = () => {
    return mount(TaskThingSelector, {
      props: {
        taskId: 'task-1'
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              thing: { things: [] },
              taskThing: { taskThings: [] }
            }
          })
        ]
      }
    })
  }

  it('shows search results when typing', async () => {
    const wrapper = mountComponent()
    const thingStore = useThingStore()
    
    // Mock store data
    thingStore.$patch({
      things: [
        { id: '1', content: 'test thing', type: 'text', tags: [], stars: 0, createdAt: new Date(), updatedAt: new Date() }
      ]
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    
    await vi.advanceTimersByTime(300)
    await nextTick()

    const searchResults = wrapper.find('[data-testid="search-results"]')
    expect(searchResults.exists()).toBe(true)
    expect(searchResults.text()).toContain('test thing')
  })

  it('filters out already associated things', async () => {
    const wrapper = mountComponent()
    const thingStore = useThingStore()
    const taskThingStore = useTaskThingStore()
    
    // Mock store data
    thingStore.$patch({
      things: [
        { id: '1', content: 'test thing', type: 'text', tags: [], stars: 0, createdAt: new Date(), updatedAt: new Date() }
      ]
    })
    
    // Mock associated things using $patch instead of direct assignment
    taskThingStore.$patch({
      taskThings: [{ taskId: 'task-1', thingId: '1' }]
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    
    await vi.advanceTimersByTime(300)
    await nextTick()

    const searchResults = wrapper.find('[data-testid="search-results"]')
    expect(searchResults.exists()).toBe(false)
  })
}) 