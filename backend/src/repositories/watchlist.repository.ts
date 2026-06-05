import { PrismaClient, Watchlist } from '@prisma/client';

export class WatchlistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUser(userId: string): Promise<Watchlist[]> {
    return this.prisma.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, movieId: number, mediaType: string): Promise<Watchlist | null> {
    return this.prisma.watchlist.findUnique({
      where: { userId_movieId_mediaType: { userId, movieId, mediaType } },
    });
  }

  async add(userId: string, movieId: number, mediaType: string): Promise<Watchlist> {
    return this.prisma.watchlist.create({
      data: { userId, movieId, mediaType },
    });
  }

  async remove(userId: string, movieId: number, mediaType: string): Promise<void> {
    await this.prisma.watchlist.delete({
      where: { userId_movieId_mediaType: { userId, movieId, mediaType } },
    });
  }

  async getMovieIds(userId: string): Promise<number[]> {
    const items = await this.prisma.watchlist.findMany({
      where: { userId },
      select: { movieId: true },
    });
    return items.map((i) => i.movieId);
  }
}
