import { v4 as uuidv4 } from 'uuid';
import { Repository } from '../interfaces/repository';
import { Task, TaskStatus } from '../../types/task';

export class TaskRepository implements Repository<Task> {
  private tasks: Map<string, Task> = new Map();

  async create(data: Partial<Task>): Promise<Task> {
    const id = uuidv4();
    const task: Task = {
      id,
      title: data.title!,
      description: data.description || '',
      userId: data.userId!,
      status: data.status || TaskStatus.TODO,
      dueDate: data.dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(id, task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = {
      ...task,
      ...data,
      updatedAt: new Date()
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

