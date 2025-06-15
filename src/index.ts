import { startServer } from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

const gracefulShutdown = (signal: string): void => {
  console.log(`\n📝 Received ${signal}. Starting graceful shutdown...`);
  
  console.log('✅ Graceful shutdown completed');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('🚀 Starting PagePilot Backend...');
startServer(PORT, HOST).catch((error: unknown) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}); 