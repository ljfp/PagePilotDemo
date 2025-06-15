import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthorService } from '../services/authorService.js';
import { CreateAuthorRequest, UpdateAuthorRequest, ApiResponse } from '../types/index.js';
import { validateCreateAuthor, validateUpdateAuthor, validateId } from '../utils/validation.js';

const authorService = new AuthorService();

export class AuthorController {
  async createAuthor(
    request: FastifyRequest<{ Body: CreateAuthorRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validationErrors = validateCreateAuthor(request.body);
      if (validationErrors.length > 0) {
        reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      const author = await authorService.createAuthor(request.body);
      reply.code(201).send({
        success: true,
        data: author,
      } as ApiResponse<typeof author>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to create author',
      } as ApiResponse<never>);
    }
  }

  async getAllAuthors(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const authors = await authorService.getAllAuthors();
      reply.send({
        success: true,
        data: authors,
      } as ApiResponse<typeof authors>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch authors',
      } as ApiResponse<never>);
    }
  }

  async getAuthorById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validationErrors = validateId(request.params.id);
      if (validationErrors.length > 0) {
        reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      const author = await authorService.getAuthorById(request.params.id);
      if (!author) {
        reply.code(404).send({
          success: false,
          error: 'Author not found',
        } as ApiResponse<never>);
        return;
      }
      reply.send({
        success: true,
        data: author,
      } as ApiResponse<typeof author>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch author',
      } as ApiResponse<never>);
    }
  }

  async updateAuthor(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateAuthorRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const idValidationErrors = validateId(request.params.id);
      const bodyValidationErrors = validateUpdateAuthor(request.body);
      const validationErrors = [...idValidationErrors, ...bodyValidationErrors];
      
      if (validationErrors.length > 0) {
        reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      const author = await authorService.updateAuthor(request.params.id, request.body);
      reply.send({
        success: true,
        data: author,
      } as ApiResponse<typeof author>);
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to update author',
      } as ApiResponse<never>);
    }
  }

  async deleteAuthor(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validationErrors = validateId(request.params.id);
      if (validationErrors.length > 0) {
        reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      await authorService.deleteAuthor(request.params.id);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        success: false,
        error: 'Failed to delete author',
      } as ApiResponse<never>);
    }
  }
} 