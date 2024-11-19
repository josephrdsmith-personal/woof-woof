import type { Context } from 'koa'

export function createMockContext(overrides: Partial<Context> = {}): Context {
  const ctx = {
    request: {
      body: {},
      headers: {},
      query: {},
      get: jest.fn(),
    } as any,
    response: {
      body: undefined,
      status: 200,
    },
    params: {},
    state: {},
    throw: jest.fn((status: number | string, message?: string) => {
      const err = new Error(typeof status === 'string' ? status : message || `Status: ${status}`)
      if (typeof status === 'number') {
        (err as any).status = status
      }
      throw err
    }),
    ...overrides
  } as Context

  return ctx
} 