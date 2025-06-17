import Fastify, { FastifyInstance } from 'fastify';
import { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { authorRoutes } from '../../src/routes/authorRoutes.js';
import { bookRoutes } from '../../src/routes/bookRoutes.js';
import { prisma } from '../../src/database/client.js';

describe('Author Routes Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // This ensures a fresh Fastify instance per test
    app = Fastify({ logger: false });
    await app.register(authorRoutes);
    await app.register(bookRoutes); // Needed for nested author→books route
    await app.ready();

    await prisma.favorite.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /authors – should create a new author', async () => {
    const payload = {
      name: 'J.K. Rowling',
      bio: 'British author best known for the Harry Potter series',
      birthYear: 1965,
    };

    const res = await app.inject({ method: 'POST', url: '/authors', payload });
    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject(payload);
    expect(body.data.id).toBeDefined();
  });

  it('GET /authors – should return empty list initially', async () => {
    const res = await app.inject({ method: 'GET', url: '/authors' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('GET /authors – should list all authors', async () => {
    await app.inject({ method: 'POST', url: '/authors', payload: { name: 'A', bio: 'B', birthYear: 1900 } });
    await app.inject({ method: 'POST', url: '/authors', payload: { name: 'C', bio: 'D', birthYear: 1901 } });

    const res = await app.inject({ method: 'GET', url: '/authors' });
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(2);
  });

  it('GET /authors/:id – should retrieve author by ID', async () => {
    const create = await app.inject({ method: 'POST', url: '/authors', payload: { name: 'Test', bio: 'Bio', birthYear: 1900 } });
    const authorId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'GET', url: `/authors/${authorId}` });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.id).toBe(authorId);
  });

  it('PUT /authors/:id – should update an author', async () => {
    const create = await app.inject({ method: 'POST', url: '/authors', payload: { name: 'ToUpdate', bio: 'Bio', birthYear: 1900 } });
    const authorId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'PUT', url: `/authors/${authorId}`, payload: { name: 'Updated' } });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.name).toBe('Updated');
  });

  it('DELETE /authors/:id – should delete an author and subsequent fetch returns null', async () => {
    const create = await app.inject({ method: 'POST', url: '/authors', payload: { name: 'ToDelete', bio: 'Bio', birthYear: 1900 } });
    const authorId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'DELETE', url: `/authors/${authorId}` });
    expect(res.statusCode).toBe(200);

    const get = await app.inject({ method: 'GET', url: `/authors/${authorId}` });
    const body = JSON.parse(get.body);
    expect(get.statusCode).toBe(200);
    expect(body.data).toEqual({});
  });

  it('GET /authors/:id/books – should list books for a given author', async () => {
    const authorResp = await app.inject({ method: 'POST', url: '/authors', payload: { name: 'Author', bio: 'Bio', birthYear: 1900 } });
    const authorId = JSON.parse(authorResp.body).data.id;

    const first = await app.inject({ method: 'GET', url: `/authors/${authorId}/books` });
    expect(first.statusCode).toBe(200);
    expect(JSON.parse(first.body).data).toEqual([]);

    await app.inject({ method: 'POST', url: '/books', payload: { title: 'Book', summary: 'Summary', publicationYear: 2000, authorId } });

    const second = await app.inject({ method: 'GET', url: `/authors/${authorId}/books` });
    expect(JSON.parse(second.body).data).toHaveLength(1);
  });
}); 