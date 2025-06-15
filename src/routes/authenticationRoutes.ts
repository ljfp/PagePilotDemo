import { FastifyInstance } from 'fastify';
import { authenticationController } from '../controllers/authenticationController.js';
import { authenticate } from '../utils/auth.js';

export async function authenticationRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/authentication/register', {
    schema: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Creates a new user account with email and password',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', minLength: 6, maxLength: 100, description: 'User password (min 6 characters)' },
          name: { type: 'string', minLength: 1, maxLength: 100, description: 'User full name' }
        },
        required: ['email', 'password', 'name'],
        additionalProperties: false
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'User ID' },
                email: { type: 'string', format: 'email', description: 'User email' },
                name: { type: 'string', description: 'User name' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              },
              required: ['id', 'email', 'name', 'createdAt', 'updatedAt']
            }
          }
        },
        409: {
          description: 'User already exists',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    handler: authenticationController.register.bind(authenticationController)
  });

  fastify.post('/authentication/login', {
    schema: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: 'Authenticates user and returns access token',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', description: 'User password' }
        },
        required: ['email', 'password'],
        additionalProperties: false
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'User ID' },
                    email: { type: 'string', format: 'email', description: 'User email' },
                    name: { type: 'string', description: 'User name' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                  },
                  required: ['id', 'email', 'name', 'createdAt', 'updatedAt']
                },
                accessToken: { type: 'string', description: 'JWT access token' }
              },
              required: ['user', 'accessToken']
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    handler: authenticationController.login.bind(authenticationController)
  });

  fastify.get('/authentication/profile', {
    preHandler: authenticate,
    schema: {
      tags: ['Authentication'],
      summary: 'Get current user profile',
      description: 'Returns the authenticated user\'s profile information',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'User profile retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'User ID' },
                email: { type: 'string', format: 'email', description: 'User email' },
                name: { type: 'string', description: 'User name' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              },
              required: ['id', 'email', 'name', 'createdAt', 'updatedAt']
            }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    handler: authenticationController.getCurrentUser.bind(authenticationController)
  });
} 