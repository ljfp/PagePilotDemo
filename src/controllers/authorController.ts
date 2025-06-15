import { FastifyRequest, FastifyReply } from 'fastify';
import { authorService } from '../services/authorService.js';
import { ApiSuccess, HttpStatus, CreateAuthorRequest, UpdateAuthorRequest } from '../types/index.js';

export class AuthorController {
  async createAuthor(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const author = await authorService.createAuthor(request.body as unknown as CreateAuthorRequest);
    
    const response: ApiSuccess<typeof author> = {
      success: true,
      data: author,
      message: 'Author created successfully'
    };
    
    reply.status(HttpStatus.CREATED).send(response);
  }

  async getAllAuthors(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authors = await authorService.getAllAuthors();
    
    const response: ApiSuccess<typeof authors> = {
      success: true,
      data: authors,
      message: authors.length === 0 ? 'No authors found' : 'Authors retrieved successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async getAuthorById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const author = await authorService.getAuthorById(id);
    
    const response: ApiSuccess<typeof author> = {
      success: true,
      data: author,
      message: 'Author retrieved successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async updateAuthor(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const author = await authorService.updateAuthor(id, request.body as unknown as UpdateAuthorRequest);
    
    const response: ApiSuccess<typeof author> = {
      success: true,
      data: author,
      message: 'Author updated successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }

  async deleteAuthor(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    await authorService.deleteAuthor(id);
    
    const response = {
      success: true,
      message: 'Author deleted successfully'
    };
    
    reply.status(HttpStatus.OK).send(response);
  }
}

export const authorController = new AuthorController(); 