import { Context, Next } from 'koa';
import { Request } from 'koa';
import * as yup from 'yup';
import { validate } from '../../../src/middleware/validation.middleware';
import { ValidationError } from '../../../src/middleware/error.middleware';

describe('Validation Middleware', () => {
  let mockContext: Partial<Context>;
  let mockNext: jest.MockedFunction<Next>;

  beforeEach(() => {
    // Create a proper mock Request object
    const mockRequest: Partial<Request> = {
      body: {},
      get: jest.fn(),
      is: jest.fn(),
      accepts: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsLanguages: jest.fn(),
    };

    mockContext = {
      request: mockRequest as Request,
      query: {},
      params: {},
      state: { requestId: 'test-id' }
    };
    mockNext = jest.fn();
  });

  const schema = yup.object().shape({
    name: yup.string().required(),
    age: yup.number().min(0)
  });

  it('should validate and pass valid body data', async () => {
    mockContext.request!.body = {
      name: 'Test',
      age: 25
    };

    const middleware = validate(schema);
    await middleware(mockContext as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.request!.body).toEqual({
      name: 'Test',
      age: 25
    });
  });

  it('should validate and pass valid query data', async () => {
    mockContext.query = {
      name: 'Test',
      age: '25'
    };

    const middleware = validate(schema, 'query');
    await middleware(mockContext as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.query).toEqual({
      name: 'Test',
      age: 25  // Yup converts string to number
    });
  });

  it('should validate and pass valid params data', async () => {
    mockContext.params = {
      name: 'Test',
      age: '25'
    };

    const middleware = validate(schema, 'params');
    await middleware(mockContext as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.params).toEqual({
      name: 'Test',
      age: 25
    });
  });

  it('should handle validation error with single error', async () => {
    mockContext.request!.body = {
      age: -1  // Invalid age, name is missing
    };

    const middleware = validate(schema);
    
    await expect(middleware(mockContext as Context, mockNext))
      .rejects
      .toThrow(ValidationError);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle validation error with multiple errors', async () => {
    mockContext.request!.body = {
      name: '',      // Empty name
      age: -1       // Invalid age
    };

    const middleware = validate(schema, 'body', { abortEarly: false });
    
    try {
      await middleware(mockContext as Context, mockNext);
      fail('Should have thrown ValidationError');
    } catch (err) {
      const error = err as ValidationError;  // Type assertion here
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.details).toEqual(expect.objectContaining({
        name: expect.any(String),
        age: expect.any(String)
      }));
    }

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle non-validation errors', async () => {
    const errorSchema = yup.object().shape({
      test: yup.string().test('throw', 'Test error', () => {
        throw new Error('Non-validation error');
      })
    });

    mockContext.request!.body = { test: 'value' };
    const middleware = validate(errorSchema);

    await expect(middleware(mockContext as Context, mockNext))
      .rejects
      .toThrow('Non-validation error');

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should strip unknown fields when configured', async () => {
    mockContext.request!.body = {
      name: 'Test',
      age: 25,
      unknown: 'field'
    };

    const middleware = validate(schema, 'body', { stripUnknown: true });
    await middleware(mockContext as Context, mockNext);

    expect(mockContext.request!.body).toEqual({
      name: 'Test',
      age: 25
    });
    expect(mockContext.request!.body).not.toHaveProperty('unknown');
  });
}); 