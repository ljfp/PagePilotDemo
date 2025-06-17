import { ErrorCode, HttpStatus } from '../types/index.js';
import { ValidationError, ValidationErrors } from './validation.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly context: Record<string, unknown> | undefined;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: HttpStatus,
    context?: Record<string, unknown> | undefined
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle ValidationError from our validation utils
  if (error instanceof ValidationError) {
    const statusCode = getStatusCodeForErrorCode(error.code);
    return new AppError(
      error.message,
      error.code,
      statusCode,
      error.details
    );
  }

  // Handle ValidationErrors (multiple validation errors)
  if (error instanceof ValidationErrors) {
    return new AppError(
      error.message,
      error.code,
      HttpStatus.UNPROCESSABLE_ENTITY,
      { errors: error.errors }
    );
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { originalError: error.name }
    );
  }

  // Handle unknown errors
  return new AppError(
    'An unknown error occurred',
    ErrorCode.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
    { originalError: String(error) }
  );
};

// Helper function to map error codes to HTTP status codes
const getStatusCodeForErrorCode = (code: ErrorCode): HttpStatus => {
  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_INPUT:
      return HttpStatus.UNPROCESSABLE_ENTITY;
    
    case ErrorCode.RESOURCE_NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    
    case ErrorCode.RESOURCE_ALREADY_EXISTS:
    case ErrorCode.CONFLICT:
      return HttpStatus.CONFLICT;
    
    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.INVALID_CREDENTIALS:
      return HttpStatus.UNAUTHORIZED;
    
    case ErrorCode.FORBIDDEN:
      return HttpStatus.FORBIDDEN;
    
    case ErrorCode.INVALID_AUTHOR_REFERENCE:
    case ErrorCode.BAD_REQUEST:
      return HttpStatus.BAD_REQUEST;
    
    case ErrorCode.DATABASE_ERROR:
    case ErrorCode.INTERNAL_SERVER_ERROR:
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}; 