import Fastify, { FastifyInstance } from 'fastify';
import { beforeEach, afterEach, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { authorRoutes } from '../../src/routes/authorRoutes.js';
import { bookRoutes } from '../../src/routes/bookRoutes.js';
import { favoriteRoutes } from '../../src/routes/favoriteRoutes.js';
import { authenticationRoutes } from '../../src/routes/authenticationRoutes.js';
import { prisma } from '../../src/database/client.js';

describe('Route Registration Regression', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    app = Fastify({ logger: false });
    await app.register(authorRoutes);
    await app.register(bookRoutes);
    await app.register(authenticationRoutes);
    await app.register(favoriteRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should not return "Route not found" for critical endpoints', async () => {
    const routes = [
      { method: 'GET', url: '/authors' },
      { method: 'POST', url: '/authors', payload: { name: 'A', bio: 'B', birthYear: 1900 } },
      { method: 'GET', url: '/books' },
      { method: 'POST', url: '/books', payload: {} }, // Will fail validation but route must exist
      { method: 'POST', url: '/authentication/register', payload: { email: 'test@example.com', password: 'secret123', name: 'User' } },
    ];

    for (const r of routes) {
      const res = await app.inject({ method: r.method as any, url: r.url, payload: r.payload });
      expect(res.statusCode).not.toBe(404);
      if (res.statusCode === 404) {
        const body = JSON.parse(res.body);
        expect(body.message).not.toMatch(/Route.*not found/i);
      }
    }
  });
}); 