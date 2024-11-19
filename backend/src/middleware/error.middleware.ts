// src/middleware/error.middleware.ts

import { Context, Next } from 'koa';
import { ValidationError as YupValidationError } from 'yup';
import { Logger } from '../services/logger';

// Custom error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(details: any) {
    super(400, 'Validation failed', 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

// Error handler middleware
export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();

    // Handle 404 for undefined routes
    if (ctx.response.status === 404 && !ctx.response.body) {
      throw new NotFoundError('Route not found');
    }
  } catch (err) {
    const logger = Logger.getInstance();
    const error = err as Error;  // Type assertion for error handling

    // Log the error
    logger.error('Error occurred:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      requestId: ctx.state.requestId,
      path: ctx.path,
      method: ctx.method,
    });

    // Handle different types of errors
    if (error instanceof YupValidationError) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors
      };
    } else if (error instanceof AppError) {
      ctx.status = error.statusCode;
      ctx.body = {
        status: 'error',
        code: error.code,
        message: error.message,
        details: error.details
      };
    } else if (error.name === 'UnauthorizedError') {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access'
      };
    } else {
      // Handle unknown errors
      ctx.status = 500;
      ctx.body = {
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'An internal server error occurred'
          : error.message
      };
    }
  }
};

interface KoaError extends Error {
  status?: number
}

export async function errorMiddleware(ctx: Context, next: Next) {
  try {
    await next()
  } catch (err: unknown) {
    const error = err as KoaError
    if (err instanceof Error) {
      ctx.status = error.status || 500;
      ctx.body = {
        error: error.message || 'Internal Server Error'
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: 'Internal Server Error'
      };
    }
    // Log error for debugging
    console.error(err)
  }
}