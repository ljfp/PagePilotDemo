import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { favoriteService } from '../../../src/services/favoriteService.js';
import { prisma } from '../../../src/database/client.js';
import { v4 as uuid } from 'uuid';

describe('FavoriteService', () => {
  let userId: string;
  let authorId: string;
  let bookId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean tables
    await prisma.favorite.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();

    // Seed required data
    userId = uuid();
    await prisma.user.create({ data: { id: userId, email: 'user@example.com', name: 'User', password: 'hashed' } as any });

    authorId = uuid();
    await prisma.author.create({ data: { id: authorId, name: 'Author', bio: 'Bio', birthYear: 1900 } });

    bookId = uuid();
    await prisma.book.create({ data: { id: bookId, title: 'Book', summary: 'Summary', publicationYear: 2000, authorId } });
  });

  it('addFavorite should store favorite and return object with book', async () => {
    const fav = await favoriteService.addFavorite({ userId, bookId });
    expect(fav.userId).toBe(userId);
    expect(fav.book.id).toBe(bookId);
  });

  it('isFavorited should return true after adding', async () => {
    await favoriteService.addFavorite({ userId, bookId });
    const status = await favoriteService.isFavorited(userId, bookId);
    expect(status).toBe(true);
  });

  it('getUserFavorites should list favorites', async () => {
    await favoriteService.addFavorite({ userId, bookId });
    const list = await favoriteService.getUserFavorites(userId);
    expect(list).toHaveLength(1);
  });

  it('getUserFavoriteStats should report correct totals', async () => {
    await favoriteService.addFavorite({ userId, bookId });
    const stats = await favoriteService.getUserFavoriteStats(userId);
    expect(stats.totalFavorites).toBe(1);
    expect(Object.values(stats.favoritesByYear).reduce((a, b) => a + b, 0)).toBe(1);
  });

  it('removeFavorite should delete the record', async () => {
    await favoriteService.addFavorite({ userId, bookId });
    await favoriteService.removeFavorite(userId, bookId);

    const status = await favoriteService.isFavorited(userId, bookId);
    expect(status).toBe(false);
  });
}); 