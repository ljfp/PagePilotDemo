import { FastifyInstance } from 'fastify';
import { AuthorController } from '../controllers/authorController.js';

const authorController = new AuthorController();

export async function authorRoutes(fastify: FastifyInstance): Promise<void> {
  const authorSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      bio: { type: 'string' },
      birthYear: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };

  const createAuthorSchema = {
    type: 'object',
    required: ['name', 'bio', 'birthYear'],
    properties: {
      name: { type: 'string' },
      bio: { type: 'string' },
      birthYear: { type: 'number' },
    },
  };

  const updateAuthorSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      bio: { type: 'string' },
      birthYear: { type: 'number' },
    },
  };

  fastify.post('/authors', {
    schema: {
      tags: ['authors'],
      summary: 'Create a new author',
      body: createAuthorSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: authorSchema,
          },
        },
      },
    },
    handler: authorController.createAuthor.bind(authorController),
  });

  fastify.get('/authors', {
    schema: {
      tags: ['authors'],
      summary: 'Get all authors',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: authorSchema,
            },
          },
        },
      },
    },
    handler: authorController.getAllAuthors.bind(authorController),
  });

  fastify.get('/authors/:id', {
    schema: {
      tags: ['authors'],
      summary: 'Get author by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: authorSchema,
          },
        },
      },
    },
    handler: authorController.getAuthorById.bind(authorController),
  });

  fastify.put('/authors/:id', {
    schema: {
      tags: ['authors'],
      summary: 'Update author by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: updateAuthorSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: authorSchema,
          },
        },
      },
    },
    handler: authorController.updateAuthor.bind(authorController),
  });

  fastify.delete('/authors/:id', {
    schema: {
      tags: ['authors'],
      summary: 'Delete author by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        204: {
          type: 'null',
        },
      },
    },
    handler: authorController.deleteAuthor.bind(authorController),
  });
} 