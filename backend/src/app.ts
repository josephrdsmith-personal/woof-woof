import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import taskRoutes from './routes/task.routes'
import { errorMiddleware } from './middleware/error.middleware'

export function createApp(): Koa {
  const app = new Koa()

  app.use(bodyParser())
  app.use(errorMiddleware)
  app.use(taskRoutes.routes())
  app.use(taskRoutes.allowedMethods())

  return app
} 