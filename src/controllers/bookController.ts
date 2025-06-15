import { FastifyRequest, FastifyReply } from 'fastify';
import { BookService } from '../services/bookService.js';
import { AuthorService } from '../services/authorService.js';
import { CreateBookRequest, UpdateBookRequest, ApiResponse } from '../types/index.js';

const bookService = new BookService();
const authorService = new AuthorService();

export class BookController {
  async createBook(
    request: FastifyRequest<{ Body: CreateBookRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const authorExists = await authorService.authorExists(request.body.authorId);
      if (!authorExists) {
        reply.code(400).send({
          success: false,
          error: 'Author not found',
        } as ApiResponse<never>);
        return;
      }

      const book = await bookService.createBook(request.body);
      reply.code(201).send({
        success: true,
        data: book,
      } as ApiResponse<typeof book>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to create book',
      } as ApiResponse<never>);
    }
  }

  async getAllBooks(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const books = await bookService.getAllBooks();
      reply.send({
        success: true,
        data: books,
      } as ApiResponse<typeof books>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch books',
      } as ApiResponse<never>);
    }
  }

  async getBookById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const book = await bookService.getBookById(request.params.id);
      if (!book) {
        reply.code(404).send({
          success: false,
          error: 'Book not found',
        } as ApiResponse<never>);
        return;
      }
      reply.send({
        success: true,
        data: book,
      } as ApiResponse<typeof book>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch book',
      } as ApiResponse<never>);
    }
  }

  async updateBook(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateBookRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (request.body.authorId) {
        const authorExists = await authorService.authorExists(request.body.authorId);
        if (!authorExists) {
          reply.code(400).send({
            success: false,
            error: 'Author not found',
          } as ApiResponse<never>);
          return;
        }
      }

      const book = await bookService.updateBook(request.params.id, request.body);
      reply.send({
        success: true,
        data: book,
      } as ApiResponse<typeof book>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to update book',
      } as ApiResponse<never>);
    }
  }

  async deleteBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await bookService.deleteBook(request.params.id);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to delete book',
      } as ApiResponse<never>);
    }
  }

  async getBooksByAuthor(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const authorExists = await authorService.authorExists(request.params.id);
      if (!authorExists) {
        reply.code(404).send({
          success: false,
          error: 'Author not found',
        } as ApiResponse<never>);
        return;
      }

      const books = await bookService.getBooksByAuthorId(request.params.id);
      reply.send({
        success: true,
        data: books,
      } as ApiResponse<typeof books>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch books by author',
      } as ApiResponse<never>);
    }
  }
} 