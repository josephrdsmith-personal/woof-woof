import { Context, Next } from 'koa';
import { Response } from 'koa';
import { ValidationError as YupValidationError } from 'yup';
import { 
  errorHandler, 
  AppError, 
  NotFoundError, 
  ValidationError, 
  UnauthorizedError 
} from '../../../src/middleware/error.middleware';
import { Logger } from '../../../src/services/logger';

describe('Error Middleware', () => {
  let mockContext: Partial<Context>;
  let mockNext: jest.MockedFunction<Next>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    // Create a proper mock Response object
    const mockResponse: Partial<Response> = {
      status: 200,
      body: undefined,
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn()
    };

    mockContext = {
      response: mockResponse as Response,
      status: 200,
      path: '/test',
      method: 'GET',
      state: { requestId: 'test-id' },
      body: undefined
    };

    mockNext = jest.fn() as jest.MockedFunction<Next>;

    // Create mock logger with private log method
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      log: jest.fn()
    } as unknown as jest.Mocked<Logger>;

    jest.spyOn(Logger, 'getInstance').mockReturnValue(mockLogger);
  });

  it('should handle 404 for undefined routes', async () => {
    if (mockContext.response) {
      mockContext.response.status = 404;
    }
    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(404);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Route not found',
      details: undefined
    });
  });

  it('should handle Yup validation errors', async () => {
    const validationError = new YupValidationError('Validation failed', 'error', 'path');
    mockNext.mockRejectedValueOnce(validationError);

    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(400);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: validationError.errors
    });
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle AppError instances', async () => {
    const appError = new AppError(422, 'Custom error', 'CUSTOM_ERROR', { field: 'detail' });
    mockNext.mockRejectedValueOnce(appError);

    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(422);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'CUSTOM_ERROR',
      message: 'Custom error',
      details: { field: 'detail' }
    });
  });

  it('should handle UnauthorizedError by name', async () => {
    const unauthorizedError = { name: 'UnauthorizedError', message: 'Unauthorized access' };
    mockNext.mockRejectedValueOnce(unauthorizedError);

    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(401);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'Unauthorized access'
    });
  });

  it('should handle unknown errors in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const unknownError = new Error('Something went wrong');
    mockNext.mockRejectedValueOnce(unknownError);

    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(500);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred'
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle unknown errors in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const unknownError = new Error('Something went wrong');
    mockNext.mockRejectedValueOnce(unknownError);

    await errorHandler(mockContext as Context, mockNext);

    expect(mockContext.status).toBe(500);
    expect(mockContext.body).toEqual({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
    });

    process.env.NODE_ENV = originalEnv;
  });

  describe('Custom Error Classes', () => {
    it('should create NotFoundError with default message', () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create NotFoundError with custom message', () => {
      const error = new NotFoundError('Custom not found message');
      expect(error.message).toBe('Custom not found message');
    });

    it('should create ValidationError with details', () => {
      const details = { field: 'Invalid value' };
      const error = new ValidationError(details);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(details);
    });

    it('should create UnauthorizedError with default message', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });
}); 