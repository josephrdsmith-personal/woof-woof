// src/routes/index.ts

import Router from '@koa/router';
import userRoutes from './user.routes';
import taskRoutes from './task.routes';

const router = new Router();

// Mount sub-routers
router.use('/api/users', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/api/tasks', taskRoutes.routes(), taskRoutes.allowedMethods());

export default router;