import Router from '@koa/router'
import { TaskController } from '../controllers/task.controller'

/**
 * Task-specific router handling global task operations and user-task queries
 * 
 * User-Task Query Routes:
 * POST   /api/tasks/user/:userId   - Create task for specific user
 * GET    /api/tasks/user/:userId   - List tasks for specific user
 * 
 * Global Task Routes:
 * GET    /api/tasks               - List all tasks
 * GET    /api/tasks/:id          - Get task details
 * PUT    /api/tasks/:id          - Update task
 * DELETE /api/tasks/:id          - Delete task
 * 
 * Note: This router provides task-centric operations while /users/:userId/tasks 
 * provides user-centric task operations. Use this router for task management 
 * and querying tasks across users.
 */

const router = new Router()

const taskController = new TaskController()

router.post('/', async (ctx) => await taskController.create(ctx))
router.get('/', async (ctx) => await taskController.list(ctx))
router.get('/:id', async (ctx) => await taskController.getById(ctx))
router.put('/:id', async (ctx) => await taskController.update(ctx))
router.delete('/:id', async (ctx) => await taskController.delete(ctx))

export default router 