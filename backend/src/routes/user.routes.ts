import Router from '@koa/router';
import { UserController } from '../controllers/user.controller';

const router = new Router();
const userController = new UserController();

router.post('/register', async (ctx) => await userController.register(ctx));
router.post('/login', async (ctx) => await userController.login(ctx));

export default router; 