import type { Entity } from '../../types/entity'
import type { Task, TaskStatus } from '../../types/task'
import type { User } from '../../types/user'
import type { PaginationOptions } from '../../types/pagination'

// Generic repository interface
export interface Repository<T> {
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
}

// Add UserRepository interface
export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>
}

// Task-specific repository interface
export interface TaskRepository extends Repository<Task> {
  findByUserId(userId: string, options?: PaginationOptions): Promise<Task[]>
  findByUserIdAndStatus(userId: string, status: TaskStatus, options?: PaginationOptions): Promise<Task[]>
}