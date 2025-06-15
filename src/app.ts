import Fastify from 'fastify';
import { connectDatabase, disconnectDatabase } from './database/client.js';
import { authorRoutes } from './routes/authorRoutes.js';
import { bookRoutes } from './routes/bookRoutes.js';

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
        { name: 'health', description: 'Health check endpoints' },
      ],
    },
  });

  await server.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
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

  await server.register(authorRoutes);
  await server.register(bookRoutes);

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