// Update src/tests/setup.ts to provide better test isolation:

import { Repositories } from '../src/repositories';
import { Logger } from '../src/services/logger';
import { TaskStatus } from '../src/types/task';

// Clear state before each test
beforeEach(() => {
  Repositories.getInstance().clear();
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.resetModules();
});

// Global teardown
afterAll(async () => {
  // Clear any remaining timeouts
  jest.useRealTimers();
  
  // Allow event loop to clear
  await new Promise(resolve => setImmediate(resolve));
});

// Enhance logger mock
jest.mock('../src/services/logger', () => ({
  Logger: {
    getInstance: () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      _testLogs: [] as any[],
      _reset: function() { this._testLogs = []; }
    })
  }
}));

// Mock Date.now() to return a fixed timestamp
const NOW = new Date('2024-01-01T00:00:00.000Z');
global.Date.now = jest.fn(() => NOW.getTime());
global.Date = jest.fn(() => NOW) as any;

// Add custom matchers if needed
expect.extend({
  toBeValidTask(received) {
    const pass = received &&
      typeof received.id === 'string' &&
      typeof received.title === 'string' &&
      typeof received.userId === 'string' &&
      Object.values(TaskStatus).includes(received.status);

    return {
      pass,
      message: () => `expected ${received} to be a valid task`
    };
  }
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});