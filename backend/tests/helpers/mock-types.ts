import { Context, Request, Response, Next, ParameterizedContext } from 'koa';
import { DefaultState, DefaultContext } from 'koa';

// Create proper request mock that matches Koa's Request
export interface MockRequest extends Partial<Request> {
  body: any;
  headers: Record<string, string>;
}

// Create response mock that matches Koa's Response structure
export interface MockResponse extends Partial<Response> {
  body: unknown;
  status: number;
  set: jest.Mock;
  get: jest.Mock;
  remove: jest.Mock;
}

// Create context interface that properly implements Koa's Context
export type MockContext = Partial<Omit<Context, 'request' | 'response' | 'state'>> & {
  request: MockRequest;
  response: MockResponse;
  state: DefaultState & {
    requestId?: string;
    user?: { id: string };
  };
  params: Record<string, string>;
  throw: jest.Mock;
};

export function createMockContext(overrides: Partial<MockContext> = {}): Context {
  const ctx = {
    request: {
      body: {},
      headers: {},
      get: jest.fn(),
      is: jest.fn(),
      accepts: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsLanguages: jest.fn(),
    },
    response: {
      body: undefined,
      status: 200,
      set: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
    },
    req: {} as any, // Node's request object
    res: {} as any, // Node's response object
    originalUrl: '',
    params: {},
    state: {
      requestId: 'test-request-id'
    },
    throw: jest.fn((status?: number, message?: string) => {
      const err = new Error(message || `Status: ${status}`);
      if (status) {
        (err as any).status = status;
      }
      throw err;
    }),
    assert: jest.fn(),
    respond: true,
    app: {
      emit: jest.fn(),
      env: 'test',
      proxy: false,
      subdomainOffset: 2,
      proxyIpHeader: 'X-Forwarded-For',
      maxIpsCount: 0,
    },
    cookies: {
      get: jest.fn(),
      set: jest.fn(),
    },
    accept: {
      types: jest.fn(),
      charsets: jest.fn(),
      encodings: jest.fn(),
      languages: jest.fn(),
    },
    url: '',
    method: 'GET',
    path: '',
    query: {},
    querystring: '',
    host: '',
    hostname: '',
    protocol: 'http',
    secure: false,
    ip: '',
    ips: [],
    subdomains: [],
    is: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    ...overrides
  };

  // Add getters/setters to sync status/body between ctx and ctx.response
  Object.defineProperty(ctx, 'status', {
    get() { return this.response.status; },
    set(value) { this.response.status = value; }
  });

  Object.defineProperty(ctx, 'body', {
    get() { return this.response.body; },
    set(value) { this.response.body = value; }
  });

  return ctx as unknown as Context;
} 