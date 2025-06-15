import { prisma } from '../database/client.js';
import { CreateFavorite, FavoriteWithBook } from '../models/Favorite.js';
import { AppError } from '../utils/errors.js';
import { ErrorCode, HttpStatus } from '../types/index.js';

export class FavoriteService {
  async addFavorite(data: CreateFavorite): Promise<FavoriteWithBook> {
    try {
      const book = await prisma.book.findUnique({
        where: { id: data.bookId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      if (!book) {
        throw new AppError(
          'Book not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!user) {
        throw new AppError(
          'User not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_bookId: {
            userId: data.userId,
            bookId: data.bookId,
          }
        }
      });

      if (existingFavorite) {
        throw new AppError(
          'Book is already in favorites',
          ErrorCode.CONFLICT,
          HttpStatus.CONFLICT
        );
      }

      const favorite = await prisma.favorite.create({
        data,
        include: {
          book: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      });

      return favorite as FavoriteWithBook;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to add favorite',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async removeFavorite(userId: string, bookId: string): Promise<void> {
    try {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          }
        }
      });

      if (!favorite) {
        throw new AppError(
          'Favorite not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      await prisma.favorite.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to remove favorite',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async getUserFavorites(userId: string): Promise<FavoriteWithBook[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError(
          'User not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return favorites as FavoriteWithBook[];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to get user favorites',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async isFavorited(userId: string, bookId: string): Promise<boolean> {
    try {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          }
        }
      });

      return !!favorite;
    } catch (error) {
      throw new AppError(
        'Failed to check favorite status',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async getUserFavoriteStats(userId: string): Promise<{
    totalFavorites: number;
    favoritesByYear: Record<string, number>;
    favoritesByAuthor: Record<string, number>;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError(
          'User not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              author: true
            }
          }
        }
      });

      const totalFavorites = favorites.length;
      const favoritesByYear: Record<string, number> = {};
      const favoritesByAuthor: Record<string, number> = {};

      favorites.forEach(favorite => {
        const year = favorite.book.publicationYear.toString();
        const authorName = favorite.book.author.name;

        favoritesByYear[year] = (favoritesByYear[year] || 0) + 1;
        favoritesByAuthor[authorName] = (favoritesByAuthor[authorName] || 0) + 1;
      });

      return {
        totalFavorites,
        favoritesByYear,
        favoritesByAuthor,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to get favorite statistics',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }
}

export const favoriteService = new FavoriteService(); 