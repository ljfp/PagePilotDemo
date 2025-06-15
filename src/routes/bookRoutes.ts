import { FastifyInstance } from 'fastify';
import { BookController } from '../controllers/bookController.js';

const bookController = new BookController();

export async function bookRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/books', {
    handler: bookController.createBook.bind(bookController),
  });

  fastify.get('/books', {
    handler: bookController.getAllBooks.bind(bookController),
  });

  fastify.get('/books/:id', {
    handler: bookController.getBookById.bind(bookController),
  });

  fastify.put('/books/:id', {
    handler: bookController.updateBook.bind(bookController),
  });

  fastify.delete('/books/:id', {
    handler: bookController.deleteBook.bind(bookController),
  });

  fastify.get('/authors/:id/books', {
    handler: bookController.getBooksByAuthor.bind(bookController),
  });
} 