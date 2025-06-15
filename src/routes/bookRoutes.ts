import { FastifyInstance } from 'fastify';
import { BookController } from '../controllers/bookController.js';

const bookController = new BookController();

export async function bookRoutes(fastify: FastifyInstance): Promise<void> {
  const authorSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      bio: { type: 'string' },
      birthYear: { type: 'number' },
    },
  };

  const bookSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      summary: { type: 'string' },
      publicationYear: { type: 'number' },
      authorId: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      author: authorSchema,
    },
  };

  const createBookSchema = {
    type: 'object',
    required: ['title', 'summary', 'publicationYear', 'authorId'],
    properties: {
      title: { type: 'string' },
      summary: { type: 'string' },
      publicationYear: { type: 'number' },
      authorId: { type: 'string' },
    },
  };

  const updateBookSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      summary: { type: 'string' },
      publicationYear: { type: 'number' },
      authorId: { type: 'string' },
    },
  };

  fastify.post('/books', {
    schema: {
      tags: ['books'],
      summary: 'Create a new book',
      body: createBookSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: bookSchema,
          },
        },
      },
    },
    handler: bookController.createBook.bind(bookController),
  });

  fastify.get('/books', {
    schema: {
      tags: ['books'],
      summary: 'Get all books',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: bookSchema,
            },
          },
        },
      },
    },
    handler: bookController.getAllBooks.bind(bookController),
  });

  fastify.get('/books/:id', {
    schema: {
      tags: ['books'],
      summary: 'Get book by ID',
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
            data: bookSchema,
          },
        },
      },
    },
    handler: bookController.getBookById.bind(bookController),
  });

  fastify.put('/books/:id', {
    schema: {
      tags: ['books'],
      summary: 'Update book by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: updateBookSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: bookSchema,
          },
        },
      },
    },
    handler: bookController.updateBook.bind(bookController),
  });

  fastify.delete('/books/:id', {
    schema: {
      tags: ['books'],
      summary: 'Delete book by ID',
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
    handler: bookController.deleteBook.bind(bookController),
  });

  fastify.get('/authors/:id/books', {
    schema: {
      tags: ['books'],
      summary: 'Get all books by author',
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
            data: {
              type: 'array',
              items: bookSchema,
            },
          },
        },
      },
    },
    handler: bookController.getBooksByAuthor.bind(bookController),
  });
} 