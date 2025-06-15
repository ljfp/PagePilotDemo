import { FastifyRequest, FastifyReply } from 'fastify';
import { favoriteService } from '../services/favoriteService.js';
import { ApiSuccess } from '../types/index.js';
import { getCurrentUserId, authenticate } from '../utils/auth.js';

export class FavoriteController {
  async addFavorite(
    request: FastifyRequest, 
    reply: FastifyReply
  ): Promise<void> {
    await authenticate(request, reply);
    const userId = getCurrentUserId(request);
    const { bookId } = (request.body as { bookId: string });

    const favorite = await favoriteService.addFavorite({ userId, bookId });
    
    const response: ApiSuccess<typeof favorite> = {
      success: true,
      data: favorite,
      message: 'Book added to favorites successfully'
    };

    return reply.status(201).send(response);
  }

  async removeFavorite(
    request: FastifyRequest, 
    reply: FastifyReply
  ): Promise<void> {
    await authenticate(request, reply);
    const userId = getCurrentUserId(request);
    const { bookId } = (request.params as { bookId: string });

    await favoriteService.removeFavorite(userId, bookId);
    
    const response: ApiSuccess<null> = {
      success: true,
      data: null,
      message: 'Book removed from favorites successfully'
    };

    return reply.status(200).send(response);
  }

  async getUserFavorites(
    request: FastifyRequest, 
    reply: FastifyReply
  ): Promise<void> {
    await authenticate(request, reply);
    const userId = getCurrentUserId(request);
    const favorites = await favoriteService.getUserFavorites(userId);
    
    const response: ApiSuccess<typeof favorites> = {
      success: true,
      data: favorites,
      message: 'Favorites retrieved successfully'
    };

    return reply.status(200).send(response);
  }

  async checkFavoriteStatus(
    request: FastifyRequest, 
    reply: FastifyReply
  ): Promise<void> {
    await authenticate(request, reply);
    const userId = getCurrentUserId(request);
    const { bookId } = (request.params as { bookId: string });

    const isFavorited = await favoriteService.isFavorited(userId, bookId);
    
    const response: ApiSuccess<{ isFavorited: boolean }> = {
      success: true,
      data: { isFavorited },
      message: 'Favorite status retrieved successfully'
    };

    return reply.status(200).send(response);
  }

  async getFavoriteStats(
    request: FastifyRequest, 
    reply: FastifyReply
  ): Promise<void> {
    await authenticate(request, reply);
    const userId = getCurrentUserId(request);
    const stats = await favoriteService.getUserFavoriteStats(userId);
    
    const response: ApiSuccess<typeof stats> = {
      success: true,
      data: stats,
      message: 'Favorite statistics retrieved successfully'
    };

    return reply.status(200).send(response);
  }
}

export const favoriteController = new FavoriteController(); 