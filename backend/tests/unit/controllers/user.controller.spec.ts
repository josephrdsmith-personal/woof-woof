import { UserController } from '../../../src/controllers/user.controller';
import { UserRepository } from '../../../src/repositories/memory/user.repository';
import { User } from '../../../src/types/user';
import { createMockContext } from '../../helpers/mock-types';
import { Context } from 'koa';

describe('UserController', () => {
  let controller: UserController;
  let repository: UserRepository;
  let ctx: Context;

  beforeEach(() => {
    repository = new UserRepository();
    controller = new UserController(repository);
    ctx = createMockContext();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      };

      ctx.request.body = userData;
      await controller.register(ctx as any);

      expect(ctx.status).toBe(201);
      expect(ctx.body).toMatchObject({
        id: expect.any(String),
        username: userData.username
      });
    });

    it('should return 400 for invalid data', async () => {
      ctx.request.body = { username: 'test' };
      await controller.register(ctx as any);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toHaveProperty('error');
    });
  });

  describe('login', () => {
    it('should authenticate valid credentials', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      };
      await repository.create(userData);

      ctx.request.body = {
        username: userData.username,
        password: userData.password
      };
      await controller.login(ctx as any);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toMatchObject({
        id: expect.any(String),
        username: userData.username
      });
    });

    it('should return 401 for invalid credentials', async () => {
      ctx.request.body = {
        username: 'nonexistent',
        password: 'wrongpassword'
      };
      await controller.login(ctx as any);

      expect(ctx.status).toBe(401);
      expect(ctx.body).toHaveProperty('error');
    });
  });
});