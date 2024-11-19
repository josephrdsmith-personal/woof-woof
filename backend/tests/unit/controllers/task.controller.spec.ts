import { TaskController } from '../../../src/controllers/task.controller';
import { TaskRepository } from '../../../src/repositories/memory/task.repository';
import { TaskStatus } from '../../../src/types/task';
import { createMockContext } from '../../helpers/mock-types';
import { Context } from 'koa';

describe('TaskController', () => {
  let controller: TaskController;
  let repository: TaskRepository;
  let ctx: Context;

  beforeEach(() => {
    repository = new TaskRepository();
    controller = new TaskController(repository);
    ctx = createMockContext();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123',
        status: TaskStatus.TODO
      };

      ctx.request.body = taskData;
      await controller.create(ctx);

      expect(ctx.status).toBe(201);
      expect(ctx.body).toMatchObject({
        ...taskData,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should return 400 for invalid data', async () => {
      ctx.request.body = { title: '' }; // Invalid title
      await controller.create(ctx);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toHaveProperty('error');
    });
  });

  describe('getById', () => {
    it('should return task by id', async () => {
      // First create a task
      const task = await repository.create({
        title: 'Test Task',
        userId: '123',
        status: TaskStatus.TODO
      });

      ctx.params = { id: task.id };
      await controller.getById(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toMatchObject({
        id: task.id,
        title: task.title
      });
    });

    it('should return 404 for non-existent task', async () => {
      ctx.params = { id: 'nonexistent' };
      await controller.getById(ctx);

      expect(ctx.status).toBe(404);
      expect(ctx.body).toHaveProperty('error');
    });
  });

  describe('update', () => {
    it('should update existing task', async () => {
      // First create a task
      const task = await repository.create({
        title: 'Test Task',
        userId: '123',
        status: TaskStatus.TODO
      });

      const updateData = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS
      };

      ctx.params = { id: task.id };
      ctx.request.body = updateData;
      await controller.update(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toMatchObject({
        id: task.id,
        ...updateData
      });
    });
  });

  describe('delete', () => {
    it('should delete existing task', async () => {
      // First create a task
      const task = await repository.create({
        title: 'Test Task',
        userId: '123',
        status: TaskStatus.TODO
      });

      ctx.params = { id: task.id };
      await controller.delete(ctx);

      expect(ctx.status).toBe(204);
    });
  });
}); 