import type { Entity } from '../../types/entity'
import type { Repository } from '../interfaces/repository'
import type { PaginationOptions } from '../../types/pagination'

export abstract class BaseMemoryRepository<T extends Entity> implements Repository<T> {
  protected items: Map<string, T>

  constructor() {
    this.items = new Map()
  }

  async create(data: Partial<T>): Promise<T> {
    const now = new Date()
    const newEntity = {
      ...data,
      id: `${this.constructor.name}-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    } as T

    this.items.set(newEntity.id, newEntity)
    return newEntity
  }

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null
  }

  async findAll(options?: PaginationOptions): Promise<T[]> {
    const items = Array.from(this.items.values())
    
    if (!options) {
      return items
    }

    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = options
    const start = (page - 1) * limit
    const end = Math.min(start + limit, items.length)

    let result = items
    if (sortBy) {
      result = [...items].sort((a, b) => {
        const aValue = a[sortBy as keyof T]
        const bValue = b[sortBy as keyof T]
        return sortOrder === 'asc' 
          ? (aValue < bValue ? -1 : 1)
          : (aValue > bValue ? -1 : 1)
      })
    }

    return result.slice(start, end)
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`)
    }

    await new Promise(resolve => setTimeout(resolve, 1))

    const updated = {
      ...existing,
      ...entity,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date()
    }

    this.items.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id)
  }
}