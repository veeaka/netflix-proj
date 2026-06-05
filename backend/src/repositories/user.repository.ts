import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; name: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async updateAvatar(userId: string, avatar: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
  }
}
