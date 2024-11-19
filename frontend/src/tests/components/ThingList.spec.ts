import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThingList from '../../components/ThingList.vue'
import { createTestingPinia } from '@pinia/testing'
import type { Thing, ThingType } from '../../types/thing'

const mockThings: Thing[] = [
  {
    id: '1',
    type: 'text' as ThingType,
    content: 'Test content',
    tags: ['test'],
    stars: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

describe('ThingList', () => {
  it('renders things correctly', () => {
    const wrapper = mount(ThingList, {
      props: {
        things: mockThings
      },
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.text()).toContain('Test content')
    expect(wrapper.text()).toContain('text')
  })

  it('emits select event when thing is clicked', async () => {
    const wrapper = mount(ThingList, {
      props: {
        things: mockThings
      },
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([mockThings[0]])
  })
}) 