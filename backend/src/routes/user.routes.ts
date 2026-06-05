import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { authenticate } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types';

export function createUserRouter(prisma: PrismaClient): Router {
  const router = Router();
  const userRepo = new UserRepository(prisma);
  const userService = new UserService(userRepo);
  const controller = new UserController(userService);

  const auth = authenticate as never;
  const wrap = (fn: (req: AuthenticatedRequest, res: never, next: never) => Promise<void>) =>
    (req: never, res: never, next: never) => fn(req, res, next);

  router.use(auth);
  router.get('/profile', wrap(controller.getProfile));
  router.patch('/avatar', wrap(controller.updateAvatar));

  return router;
}
