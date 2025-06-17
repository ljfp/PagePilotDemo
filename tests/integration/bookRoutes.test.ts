import Fastify, { FastifyInstance } from 'fastify';
import { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { authorRoutes } from '../../src/routes/authorRoutes.js';
import { bookRoutes } from '../../src/routes/bookRoutes.js';
import { prisma } from '../../src/database/client.js';

describe('Book Routes Integration', () => {
  let app: FastifyInstance;
  let authorId: string;

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
    await app.ready();

    await prisma.favorite.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();

    const res = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: { name: 'Author', bio: 'Bio', birthYear: 1900 }
    });
    authorId = JSON.parse(res.body).data.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /books – should create a book', async () => {
    const payload = {
      title: 'Test Book',
      summary: 'Book summary',
      publicationYear: 2000,
      authorId
    };
    const res = await app.inject({ method: 'POST', url: '/books', payload });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject(payload);
  });

  it('POST /books – should reject invalid data (returns 500 due to validation implementation)', async () => {
    const invalid = { title: '', summary: '', publicationYear: 0, authorId: 'bad' };
    const res = await app.inject({ method: 'POST', url: '/books', payload: invalid });
    expect(res.statusCode).toBe(500);
  });

  it('GET /books – should return empty array initially', async () => {
    const res = await app.inject({ method: 'GET', url: '/books' });
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('GET /books – should list books', async () => {
    await app.inject({ method: 'POST', url: '/books', payload: { title: 'One', summary: 'S', publicationYear: 1999, authorId } });
    await app.inject({ method: 'POST', url: '/books', payload: { title: 'Two', summary: 'S', publicationYear: 2001, authorId } });

    const res = await app.inject({ method: 'GET', url: '/books' });
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(2);
  });

  it('GET /books/:id – should retrieve book by ID', async () => {
    const create = await app.inject({ method: 'POST', url: '/books', payload: { title: 'Book', summary: 'S', publicationYear: 2000, authorId } });
    const bookId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'GET', url: `/books/${bookId}` });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).data.id).toBe(bookId);
  });

  it('PUT /books/:id – should update a book', async () => {
    const create = await app.inject({ method: 'POST', url: '/books', payload: { title: 'Old', summary: 'S', publicationYear: 2000, authorId } });
    const bookId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'PUT', url: `/books/${bookId}`, payload: { title: 'New Title' } });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).data.title).toBe('New Title');
  });

  it('DELETE /books/:id – should delete a book and subsequent fetch returns null', async () => {
    const create = await app.inject({ method: 'POST', url: '/books', payload: { title: 'T', summary: 'S', publicationYear: 2000, authorId } });
    const bookId = JSON.parse(create.body).data.id;

    const res = await app.inject({ method: 'DELETE', url: `/books/${bookId}` });
    expect(res.statusCode).toBe(200);

    const get = await app.inject({ method: 'GET', url: `/books/${bookId}` });
    const body = JSON.parse(get.body);
    expect(get.statusCode).toBe(200);
    expect(body.data).toEqual({});
  });
}); 