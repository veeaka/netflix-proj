import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middlewares/error.middleware';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return { id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.createdAt };
  }

  async updateAvatar(userId: string, avatar: string) {
    return this.userRepo.updateAvatar(userId, avatar);
  }
}
