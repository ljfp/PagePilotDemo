import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticationService } from '../services/authenticationService.js';
import { AppError } from './errors.js';
import { ErrorCode, HttpStatus } from '../types/index.js';
import { JwtPayload } from '../models/User.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const authenticate = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new AppError(
        'Authorization header required',
        ErrorCode.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      throw new AppError(
        'Invalid authorization header format',
        ErrorCode.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const payload = await authenticationService.verifyToken(token);
    
    request.user = payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Authentication failed',
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      { originalError: error }
    );
  }
};

export const optionalAuthenticate = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return;
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return;
    }

    const payload = await authenticationService.verifyToken(token);
    request.user = payload;
  } catch {
    return;
  }
};

export const getCurrentUserId = (request: FastifyRequest): string => {
  if (!request.user) {
    throw new AppError(
      'User not authenticated',
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
  return request.user.userId;
};

export const checkResourceOwnership = (request: FastifyRequest, resourceUserId: string): void => {
  const currentUserId = getCurrentUserId(request);
  
  if (currentUserId !== resourceUserId) {
    throw new AppError(
      'Access denied: You can only access your own resources',
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}; 