// backend/src/repositories/index.ts
import { UserRepository } from './memory/user.repository';
import { TaskRepository } from './memory/task.repository';

export class Repositories {
  private static instance: Repositories;
  private _users: UserRepository;
  private _tasks: TaskRepository;

  private constructor() {
    this._users = new UserRepository();
    this._tasks = new TaskRepository();
  }

  static getInstance(): Repositories {
    if (!Repositories.instance) {
      Repositories.instance = new Repositories();
    }
    return Repositories.instance;
  }

  get users(): UserRepository {
    return this._users;
  }

  get tasks(): TaskRepository {
    return this._tasks;
  }

  // Useful for testing - clears all data
  clear(): void {
    this._users = new UserRepository();
    this._tasks = new TaskRepository();
  }
}