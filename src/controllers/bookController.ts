import { FastifyRequest, FastifyReply } from 'fastify';
import { bookService } from '../services/bookService.js';
import { ApiSuccess, HttpStatus, CreateBookRequest, UpdateBookRequest } from '../types/index.js';

export class BookController {
  async createBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const book = await bookService.createBook(request.body as unknown as CreateBookRequest);
    
    const response: ApiSuccess<typeof book> = {
      success: true,
      data: book,
      message: 'Book created successfully'
    };
    
    reply.status(HttpStatus.CREATED).send(response);
  }

  async getAllBooks(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const books = await bookService.getAllBooks();
    
    const response: ApiSuccess<typeof books> = {
      success: true,
      data: books,
      message: books.length === 0 ? 'No books found' : 'Books retrieved successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async getBookById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const book = await bookService.getBookById(id);
    
    const response: ApiSuccess<typeof book> = {
      success: true,
      data: book,
      message: 'Book retrieved successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async updateBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const book = await bookService.updateBook(id, request.body as unknown as UpdateBookRequest);
    
    const response: ApiSuccess<typeof book> = {
      success: true,
      data: book,
      message: 'Book updated successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async deleteBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    await bookService.deleteBook(id);
    
    const response = {
      success: true,
      message: 'Book deleted successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async getBooksByAuthorId(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const books = await bookService.getBooksByAuthorId(id);
    
    const response: ApiSuccess<typeof books> = {
      success: true,
      data: books,
      message: books.length === 0 
        ? 'No books found for this author' 
        : `Found ${books.length} book(s) by this author`
    };
    
    reply.status(HttpStatus.OK).send(response);
  }
}

export const bookController = new BookController(); 