import { mande } from 'mande'
import { ref } from 'vue'
import * as yup from 'yup'
import type { Thing, ThingDTO, CreateThingDTO, Comment, CommentDTO } from '../types/thing'
import { deserializeDate } from '../utils/dateUtils'

const api = mande('/api/things')

export const thingSchema = yup.object({
  type: yup.string().oneOf(['text', 'image', 'other']).required(),
  content: yup.string().required(),
  tags: yup.array().of(yup.string())
})

export function useThingApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deserializeThing = (dto: ThingDTO): Thing => {
    const thing: Thing = {
      ...dto,
      createdAt: deserializeDate(dto.createdAt),
      updatedAt: deserializeDate(dto.updatedAt),
      type: dto.type as Thing['type']
    }
    return thing
  }

  const deserializeComment = (dto: CommentDTO): Comment => ({
    ...dto,
    createdAt: deserializeDate(dto.createdAt)
  })

  const createThing = async (data: CreateThingDTO): Promise<Thing> => {
    loading.value = true
    error.value = null
    try {
      await thingSchema.validate(data)
      const response = await api.post<ThingDTO>('/', data)
      return deserializeThing(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const copyThing = async (thingId: string): Promise<Thing> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<ThingDTO>(`/${thingId}/copy`)
      return deserializeThing(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const addComment = async (thingId: string, content: string): Promise<Comment> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<CommentDTO>(`/${thingId}/comments`, { content })
      return deserializeComment(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const starThing = async (thingId: string): Promise<Thing> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<ThingDTO>(`/${thingId}/star`)
      return deserializeThing(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTags = async (thingId: string, tags: string[]): Promise<Thing> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<ThingDTO>(`/${thingId}/tags`, { tags })
      return deserializeThing(response)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    createThing,
    copyThing,
    addComment,
    starThing,
    updateTags,
    loading,
    error
  }
} 