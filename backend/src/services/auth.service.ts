import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; avatar: string | null };
}

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(input: RegisterInput): Promise<AuthTokens> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await this.userRepo.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    const tokens = this.generateTokens(user.id, user.email);
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } };
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const tokens = this.generateTokens(user.id, user.email);
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    return { accessToken: signAccessToken({ userId: user.id, email: user.email }) };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.updateRefreshToken(userId, null);
  }

  private generateTokens(userId: string, email: string) {
    return {
      accessToken: signAccessToken({ userId, email }),
      refreshToken: signRefreshToken({ userId, email }),
    };
  }
}
