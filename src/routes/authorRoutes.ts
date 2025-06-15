import { FastifyInstance } from 'fastify';
import { AuthorController } from '../controllers/authorController.js';

const authorController = new AuthorController();

export async function authorRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/authors', {
    handler: authorController.createAuthor.bind(authorController),
  });

  fastify.get('/authors', {
    handler: authorController.getAllAuthors.bind(authorController),
  });

  fastify.get('/authors/:id', {
    handler: authorController.getAuthorById.bind(authorController),
  });

  fastify.put('/authors/:id', {
    handler: authorController.updateAuthor.bind(authorController),
  });

  fastify.delete('/authors/:id', {
    handler: authorController.deleteAuthor.bind(authorController),
  });
} 