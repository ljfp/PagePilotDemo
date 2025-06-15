import Fastify from 'fastify';

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

  server.get('/health', async () => {
    return { status: 'ok', message: 'PagePilot Backend is running!' };
  });

  try {
    await server.listen({ port, host });
    console.log(`🎉 Server is running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
  } catch (error) {
    server.log.error(error);
    throw error;
  }
} 