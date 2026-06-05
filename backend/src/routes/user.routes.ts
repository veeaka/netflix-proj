import { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { authenticate } from '../middlewares/auth.middleware';

export function createUserRouter(prisma: PrismaClient): Router {
  const router = Router();
  const userRepo = new UserRepository(prisma);
  const userService = new UserService(userRepo);
  const controller = new UserController(userService);

  router.use(authenticate as RequestHandler);
  router.get('/profile', controller.getProfile as RequestHandler);
  router.patch('/avatar', controller.updateAvatar as RequestHandler);

  return router;
}
