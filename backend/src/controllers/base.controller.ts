import { Context } from 'koa';

export interface BaseController {
  handleRequest(ctx: Context): Promise<void>;
} 