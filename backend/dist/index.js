"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const uuid_1 = require("uuid");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./services/logger");
const routes_1 = __importDefault(require("./routes"));
exports.app = new koa_1.default();
const logger = logger_1.Logger.getInstance();
// Add request ID to context
exports.app.use(async (ctx, next) => {
    ctx.state.requestId = (0, uuid_1.v4)();
    await next();
});
// Request logging
exports.app.use(async (ctx, next) => {
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
exports.app.use((0, cors_1.default)());
exports.app.use((0, koa_bodyparser_1.default)());
exports.app.use(error_middleware_1.errorHandler);
// Health check endpoint with detailed status
exports.app.use(async (ctx, next) => {
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
exports.app.use(routes_1.default.routes());
exports.app.use(routes_1.default.allowedMethods());
// Only start server if this file is being run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    exports.app.listen(port, () => {
        logger.info(`Server started`, {
            port,
            env: process.env.NODE_ENV,
            nodeVersion: process.version,
        });
    });
}
exports.default = exports.app;
