import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { authenticate } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types';

export function createAuthRouter(prisma: PrismaClient): Router {
  const router = Router();
  const userRepo = new UserRepository(prisma);
  const authService = new AuthService(userRepo);
  const controller = new AuthController(authService);

  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/logout', authenticate as never, (req, res, next) => controller.logout(req as AuthenticatedRequest, res, next));
  router.get('/me', authenticate as never, (req, res, next) => controller.me(req as AuthenticatedRequest, res, next));

  return router;
}
