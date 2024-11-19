import { Context } from 'koa';
import { BaseController } from './base.controller';
import { UserRepository } from '../repositories/memory/user.repository';
import { LoginSchema, RegisterSchema } from '../schemas/user.schema';
import { ValidationError } from 'yup';

export class UserController implements BaseController {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  register = async (ctx: Context): Promise<void> => {
    try {
      const userData = await RegisterSchema.validate(ctx.request.body);
      const user = await this.userRepository.create(userData);
      ctx.status = 201;
      ctx.body = { id: user.id, username: user.username };
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = { error: error.message };
        return;
      }
      throw error;
    }
  };

  login = async (ctx: Context): Promise<void> => {
    try {
      const credentials = await LoginSchema.validate(ctx.request.body);
      const user = await this.userRepository.findByCredentials(
        credentials.username,
        credentials.password
      );
      
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }

      // In a real app, you'd generate a JWT token here
      ctx.status = 200;
      ctx.body = { id: user.id, username: user.username };
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = { error: error.message };
        return;
      }
      throw error;
    }
  };

  handleRequest = async (ctx: Context): Promise<void> => {
    switch (ctx.path) {
      case '/register':
        await this.register(ctx);
        break;
      case '/login':
        await this.login(ctx);
        break;
      default:
        ctx.status = 404;
        ctx.body = { error: 'Not found' };
    }
  };
}
