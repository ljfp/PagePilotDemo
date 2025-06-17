import Fastify from 'fastify';
import { connectDatabase, disconnectDatabase } from './database/client.js';
import { authorRoutes } from './routes/authorRoutes.js';
import { bookRoutes } from './routes/bookRoutes.js';
import { authenticationRoutes } from './routes/authenticationRoutes.js';
import { favoriteRoutes } from './routes/favoriteRoutes.js';
import { HealthResponseSchema, WelcomeResponseSchema } from './types/swagger.js';

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
        description: 'Backend service for PagePilot bookstore platform with comprehensive author and book management',
        version: '1.0.0',
        contact: {
          name: 'PagePilot API Support',
          email: 'support@pagepilot.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://${host}:${port}`,
          description: 'Development server',
        },
      ],
      tags: [
        { 
          name: 'authors', 
          description: 'Author management endpoints - Create, read, update, and delete authors' 
        },
        { 
          name: 'books', 
          description: 'Book management endpoints - Create, read, update, and delete books with author relationships' 
        },
        { 
          name: 'Authentication', 
          description: 'User authentication endpoints - Register, login, and JWT token management' 
        },
        { 
          name: 'Favorites', 
          description: 'User favorite management endpoints - Add and remove book favorites' 
        },
        { 
          name: 'health', 
          description: 'Health check and API information endpoints' 
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token for authentication. Format: Bearer <token>',
          },
        },
      },
    },
  });

  await server.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayOperationId: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayRequestDuration: true
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
      description: 'Returns the current status of the API server and database connectivity',
      response: {
        200: HealthResponseSchema,
      },
    },
  }, async () => {
    return { status: 'ok', message: 'PagePilot Backend is running!' };
  });

  server.get('/', {
    schema: {
      tags: ['health'],
      summary: 'API information',
      description: 'Returns basic information about the PagePilot API including service details and version',
      response: {
        200: WelcomeResponseSchema
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