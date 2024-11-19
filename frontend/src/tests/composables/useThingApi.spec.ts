import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThingApi } from '../../composables/useThingApi'
import type { ThingDTO } from '../../types/thing'

describe('useThingApi', () => {
  let thingApi: ReturnType<typeof useThingApi>

  beforeEach(() => {
    thingApi = useThingApi()
  })

  describe('createThing', () => {
    it('should validate thing type', async () => {
      await expect(thingApi.createThing({
        type: 'invalid' as any,
        content: 'test content'
      })).rejects.toThrow()
    })

    it('should require content', async () => {
      await expect(thingApi.createThing({
        type: 'text',
        content: ''
      })).rejects.toThrow()
    })

    it('should handle date serialization correctly', async () => {
      const mockDate = new Date('2024-11-17T23:42:24.176Z')
      const mockThingDTO: ThingDTO = {
        id: '1',
        userId: 'user1',
        type: 'text',
        content: 'test content',
        tags: [],
        stars: 0,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      }

      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify(mockThingDTO)))
      )

      const result = await thingApi.createThing({
        type: 'text',
        content: 'test content'
      })

      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
      expect(result.createdAt.getTime()).toBe(mockDate.getTime())
      expect(result.updatedAt.getTime()).toBe(mockDate.getTime())
    })
  })
}) 