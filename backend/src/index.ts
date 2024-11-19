// backend/src/index.ts
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './middleware/error.middleware';
import { Logger } from './services/logger';
import router from './routes';

export const app = new Koa();
const logger = Logger.getInstance();

// Add request ID to context
app.use(async (ctx, next) => {
  ctx.state.requestId = uuidv4();
  await next();
});

// Request logging
app.use(async (ctx, next) => {
  const startTime = Date.now();
  
  logger.info('Request received', {
    requestId: ctx.state.requestId,
    method: ctx.method,
    path: ctx.url,
  });

  await next();

  const duration = Date.now() - startTime;
  logger.info('Request completed', {
    requestId: ctx.state.requestId,
    method: ctx.method,
    path: ctx.url,
    status: ctx.status,
    duration,
  });
});

// Middleware
app.use(cors());
app.use(bodyParser());
app.use(errorHandler);

// Health check endpoint with detailed status
app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
    ctx.body = health;
    return;
  }
  await next();
});

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// Only start server if this file is being run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server started`, {
      port,
      env: process.env.NODE_ENV,
      nodeVersion: process.version,
    });
  });
}

export default app;