import Fastify from 'fastify';
import { connectDatabase, disconnectDatabase } from './database/client.js';
import { authorRoutes } from './routes/authorRoutes.js';
import { bookRoutes } from './routes/bookRoutes.js';
import { authenticationRoutes } from './routes/authenticationRoutes.js';
import { favoriteRoutes } from './routes/favoriteRoutes.js';

export async function startServer(port: number, host: string): Promise<void> {
  const server = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  await server.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'PagePilot Backend API',
        description: 'Backend service for PagePilot bookstore platform',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${host}:${port}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'authors', description: 'Author management endpoints' },
        { name: 'books', description: 'Book management endpoints' },
        { name: 'Authentication', description: 'User authentication endpoints' },
        { name: 'Favorites', description: 'User favorite management endpoints' },
        { name: 'health', description: 'Health check endpoints' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token for authentication',
          },
        },
      },
    },
  });

  await server.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list'
    },
    staticCSP: true,
    transformStaticCSP: (header) => {
      // Allow unsafe-inline for styles and scripts needed by Swagger UI
      // Remove upgrade-insecure-requests for development HTTP server
      return header
        .replace('style-src \'self\' https:', 'style-src \'self\' https: \'unsafe-inline\'')
        .replace('script-src \'self\'', 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'')
        .replace(' upgrade-insecure-requests;', ';');
    }
  });

  server.get('/health', {
    schema: {
      tags: ['health'],
      summary: 'Health check endpoint',
      description: 'Returns the current status of the API',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return { status: 'ok', message: 'PagePilot Backend is running!' };
  });

  server.get('/', {
    schema: {
      tags: ['health'],
      summary: 'API information',
      description: 'Returns basic information about the PagePilot API',
      response: {
        200: {
          description: 'API information retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: [true] },
            data: {
              type: 'object',
              properties: {
                service: { type: 'string' },
                version: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['service', 'version', 'description']
            },
            message: { type: 'string' }
          },
          required: ['success', 'data', 'message']
        }
      }
    }
  }, async () => {
    return {
      success: true,
      data: {
        service: 'PagePilot Backend',
        version: '1.0.0',
        description: 'RESTful API for managing bookstore inventory'
      },
      message: 'Welcome to PagePilot Backend API'
    };
  });

  await server.register(authorRoutes);
  await server.register(bookRoutes);
  await server.register(authenticationRoutes);
  await server.register(favoriteRoutes);

  server.addHook('onClose', async () => {
    await disconnectDatabase();
  });

  try {
    await connectDatabase();
    await server.listen({ port, host });
    console.log(`🎉 Server is running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`📚 API Documentation: http://${host}:${port}/docs`);
  } catch (error) {
    server.log.error(error);
    throw error;
  }
} 