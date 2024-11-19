import { Context } from 'koa';

declare global {
  namespace jest {
    interface Matchers<R> {
      // Add any custom matchers here if needed
    }
  }
}

declare module 'koa' {
  interface DefaultState {
    requestId?: string;
    user?: { id: string };
  }

  interface DefaultContext {
    params: Record<string, string>;
  }
} 