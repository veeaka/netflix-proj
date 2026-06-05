import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../types';

const updateAvatarSchema = z.object({
  avatar: z.string().url(),
});

export class UserController {
  constructor(private readonly userService: UserService) {}

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.userService.getProfile(req.user.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  updateAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { avatar } = updateAvatarSchema.parse(req.body);
      const data = await this.userService.updateAvatar(req.user.userId, avatar);
      res.json({ success: true, data: { id: data.id, avatar: data.avatar } });
    } catch (err) {
      next(err);
    }
  };
}
