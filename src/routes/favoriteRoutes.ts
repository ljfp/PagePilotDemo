import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { favoriteController } from '../controllers/favoriteController.js';

export async function favoriteRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/favorites', {
    schema: {
      tags: ['Favorites'],
      summary: 'Add book to favorites',
      description: 'Add a book to the authenticated user\'s favorites',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          bookId: { type: 'string', description: 'ID of the book to favorite' }
        },
        required: ['bookId'],
        additionalProperties: false
      },
      response: {
        201: {
          description: 'Book added to favorites successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Favorite ID' },
                userId: { type: 'string', description: 'User ID' },
                bookId: { type: 'string', description: 'Book ID' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        },
        409: {
          description: 'Book already in favorites',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return favoriteController.addFavorite(request, reply);
    }
  });

  fastify.delete('/favorites/:bookId', {
    schema: {
      tags: ['Favorites'],
      summary: 'Remove book from favorites',
      description: 'Remove a book from the authenticated user\'s favorites',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          bookId: { type: 'string', description: 'ID of the book to remove from favorites' }
        },
        required: ['bookId']
      },
      response: {
        200: {
          description: 'Book removed from favorites successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: { type: 'null' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Favorite not found',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return favoriteController.removeFavorite(request, reply);
    }
  });

  fastify.get('/favorites', {
    schema: {
      tags: ['Favorites'],
      summary: 'Get user favorites',
      description: 'Get all books favorited by the authenticated user',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'User favorites retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Favorite ID' },
                  userId: { type: 'string', description: 'User ID' },
                  bookId: { type: 'string', description: 'Book ID' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return favoriteController.getUserFavorites(request, reply);
    }
  });

  fastify.get('/favorites/:bookId/status', {
    schema: {
      tags: ['Favorites'],
      summary: 'Check if book is favorited',
      description: 'Check if a book is in the authenticated user\'s favorites',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          bookId: { type: 'string', description: 'ID of the book to check' }
        },
        required: ['bookId']
      },
      response: {
        200: {
          description: 'Favorite status retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                isFavorited: { type: 'boolean', description: 'Whether the book is favorited' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return favoriteController.checkFavoriteStatus(request, reply);
    }
  });

  fastify.get('/favorites/stats', {
    schema: {
      tags: ['Favorites'],
      summary: 'Get favorite statistics',
      description: 'Get statistics about the authenticated user\'s favorites',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Favorite statistics retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                totalFavorites: { type: 'integer', description: 'Total number of favorites' },
                favoritesByYear: {
                  type: 'object',
                  additionalProperties: { type: 'integer' },
                  description: 'Number of favorites grouped by publication year'
                },
                favoritesByAuthor: {
                  type: 'object',
                  additionalProperties: { type: 'integer' },
                  description: 'Number of favorites grouped by author'
                }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return favoriteController.getFavoriteStats(request, reply);
    }
  });
} 