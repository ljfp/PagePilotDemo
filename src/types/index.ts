export interface CreateAuthorRequest {
  name: string;
  bio: string;
  birthYear: number;
}

export interface UpdateAuthorRequest {
  name?: string;
  bio?: string;
  birthYear?: number;
}

export interface CreateBookRequest {
  title: string;
  summary: string;
  publicationYear: number;
  authorId: string;
}

export interface UpdateBookRequest {
  title?: string;
  summary?: string;
  publicationYear?: number;
  authorId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
} 