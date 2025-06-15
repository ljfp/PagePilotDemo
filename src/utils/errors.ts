import { ErrorCode, HttpStatus } from '../types/index.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly context: Record<string, unknown> | undefined;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: HttpStatus,
    context?: Record<string, unknown>
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

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { originalError: error.name }
    );
  }

  return new AppError(
    'An unknown error occurred',
    ErrorCode.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
    { originalError: String(error) }
  );
}; 