import { Context } from 'koa';
import { User } from '../../src/types/user';
import { Task, TaskStatus } from '../../src/types/task';

export const createMockContext = (overrides: Partial<Context> = {}): Context => {
  return {
    request: {
      body: {}
    },
    params: {},
    status: 200,
    body: {},
    state: {
      requestId: 'test-request-id'
    },
    ...overrides
  } as unknown as Context;
};

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test Description',
  userId: 'test-user-id',
  status: TaskStatus.TODO,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});