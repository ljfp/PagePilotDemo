import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticationService } from '../services/authenticationService.js';
import { CreateUser, LoginCredentials } from '../models/User.js';
import { AppError, handleError } from '../utils/errors.js';
import { HttpStatus, ErrorCode } from '../types/index.js';

export class AuthenticationController {
  async register(
    request: FastifyRequest<{ Body: CreateUser }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const user = await authenticationService.register(request.body);
      
      reply.status(HttpStatus.CREATED).send({
        success: true,
        data: user,
      });
    } catch (error) {
      const appError = handleError(error);
      reply.status(appError.statusCode).send({
        success: false,
        error: appError.message,
        code: appError.code,
      });
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginCredentials }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const loginResponse = await authenticationService.login(request.body);
      
      reply.status(HttpStatus.OK).send({
        success: true,
        data: loginResponse,
      });
    } catch (error) {
      const appError = handleError(error);
      reply.status(appError.statusCode).send({
        success: false,
        error: appError.message,
        code: appError.code,
      });
    }
  }

  async getCurrentUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        throw new AppError(
          'User not authenticated',
          ErrorCode.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const user = await authenticationService.getUserById(request.user.userId);
      
      if (!user) {
        throw new AppError(
          'User not found',
          ErrorCode.RESOURCE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      reply.status(HttpStatus.OK).send({
        success: true,
        data: user,
      });
    } catch (error) {
      const appError = handleError(error);
      reply.status(appError.statusCode).send({
        success: false,
        error: appError.message,
        code: appError.code,
      });
    }
  }
}

export const authenticationController = new AuthenticationController(); 