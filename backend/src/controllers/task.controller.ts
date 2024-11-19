// src/controllers/task.controller.ts
import { Context } from 'koa';
import { BaseController } from './base.controller';
import { TaskRepository } from '../repositories/memory/task.repository';
import { TaskSchema } from '../schemas/task.schema';
import { ValidationError } from 'yup';

export class TaskController implements BaseController {
  private taskRepository: TaskRepository;

  constructor(taskRepository = new TaskRepository()) {
    this.taskRepository = taskRepository;
  }

  create = async (ctx: Context): Promise<void> => {
    try {
      const taskData = await TaskSchema.validate(ctx.request.body);
      const task = await this.taskRepository.create(taskData);
      ctx.status = 201;
      ctx.body = task;
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = { error: error.message };
        return;
      }
      throw error;
    }
  };

  list = async (ctx: Context): Promise<void> => {
    const tasks = await this.taskRepository.findAll();
    ctx.body = tasks;
  };

  getById = async (ctx: Context): Promise<void> => {
    const task = await this.taskRepository.findById(ctx.params.id);
    if (!task) {
      ctx.status = 404;
      ctx.body = { error: 'Task not found' };
      return;
    }
    ctx.body = task;
  };

  update = async (ctx: Context): Promise<void> => {
    try {
      const taskData = await TaskSchema.validate(ctx.request.body);
      const task = await this.taskRepository.update(ctx.params.id, taskData);
      if (!task) {
        ctx.status = 404;
        ctx.body = { error: 'Task not found' };
        return;
      }
      ctx.body = task;
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = { error: error.message };
        return;
      }
      throw error;
    }
  };

  delete = async (ctx: Context): Promise<void> => {
    const success = await this.taskRepository.delete(ctx.params.id);
    if (!success) {
      ctx.status = 404;
      ctx.body = { error: 'Task not found' };
      return;
    }
    ctx.status = 204;
  };

  handleRequest = async (ctx: Context): Promise<void> => {
    switch (ctx.method) {
      case 'POST':
        await this.create(ctx);
        break;
      case 'GET':
        if (ctx.params.id) {
          await this.getById(ctx);
        } else {
          await this.list(ctx);
        }
        break;
      case 'PUT':
        await this.update(ctx);
        break;
      case 'DELETE':
        await this.delete(ctx);
        break;
      default:
        ctx.status = 405;
        ctx.body = { error: 'Method not allowed' };
    }
  };
}