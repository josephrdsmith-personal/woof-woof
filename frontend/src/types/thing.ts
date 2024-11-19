export type ThingType = 'text' | 'image' | 'other'

export interface Thing {
  id: string
  content: string
  type: ThingType
  tags: string[]
  stars: number
  createdAt: Date
  updatedAt: Date
}

export interface ThingDTO {
  id: string
  userId: string
  type: ThingType
  content: string
  tags: string[]
  stars: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  thingId: string
  userId: string
  content: string
  createdAt: Date
}

export interface CommentDTO {
  id: string
  thingId: string
  userId: string
  content: string
  createdAt: string
}

export interface CreateThingDTO {
  type: ThingType
  content: string
  tags?: string[]
} 