// src/middleware/validation.middleware.ts

import { Context, Next } from 'koa';
import { Schema, ValidationError as YupValidationError } from 'yup';
import { ValidationError } from './error.middleware';

export interface ValidationOptions {
  abortEarly?: boolean;
  stripUnknown?: boolean;
}

export const validate = (
  schema: Schema,
  target: 'body' | 'query' | 'params' = 'body',
  options: ValidationOptions = { abortEarly: false, stripUnknown: true }
) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    try {
      const data = target === 'body' ? ctx.request.body : ctx[target];
      const validated = await schema.validate(data, options);
      
      // Replace the original data with the validated data
      if (target === 'body') {
        ctx.request.body = validated;
      } else {
        ctx[target] = validated;
      }

      await next();
    } catch (error: unknown) {
      if (error instanceof YupValidationError) {
        const validationErrors: Record<string, string> = {};

        // Handle nested validation errors
        if (error.inner && error.inner.length > 0) {
          error.inner.forEach((err) => {
            if (err.path) {
              validationErrors[err.path] = err.message;
            }
          });
        } else if (error.path) {
          // Handle single validation error
          validationErrors[error.path] = error.message;
        }

        throw new ValidationError(validationErrors);
      }
      throw error;
    }
  };
};