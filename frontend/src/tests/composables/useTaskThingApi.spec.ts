import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTaskThingApi } from '../../composables/useTaskThingApi'
import type { TaskThingDTO } from '../../types/taskThing'

describe('useTaskThingApi', () => {
  let taskThingApi: ReturnType<typeof useTaskThingApi>

  beforeEach(() => {
    taskThingApi = useTaskThingApi()
  })

  describe('associateThingWithTask', () => {
    it('should create a task-thing association and handle date serialization', async () => {
      const mockDate = new Date('2024-11-17T23:42:24.176Z')
      const mockTaskThingDTO: TaskThingDTO = {
        id: '1',
        taskId: 'task1',
        thingId: 'thing1',
        createdAt: mockDate.toISOString()
      }

      // Mock API call
      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify(mockTaskThingDTO)))
      )

      const result = await taskThingApi.associateThingWithTask({
        taskId: 'task1',
        thingId: 'thing1'
      })

      expect(result).toEqual({
        id: '1',
        taskId: 'task1',
        thingId: 'thing1',
        createdAt: mockDate
      })

      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.createdAt.getTime()).toBe(mockDate.getTime())
    })
  })
}) 