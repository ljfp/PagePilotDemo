import { CreateAuthorRequest, UpdateAuthorRequest, CreateBookRequest, UpdateBookRequest, ErrorCode } from '../types/index.js';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1000;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 200;
const MIN_BIO_LENGTH = 1;
const MAX_BIO_LENGTH = 1000;
const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 300;
const MIN_SUMMARY_LENGTH = 1;
const MAX_SUMMARY_LENGTH = 2000;

export const isValidUuid = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

const isValidString = (value: unknown, minLength: number, maxLength: number): boolean => {
  return typeof value === 'string' && 
         value.trim().length >= minLength && 
         value.trim().length <= maxLength;
};

const isValidYear = (value: unknown): boolean => {
  return typeof value === 'number' && 
         Number.isInteger(value) && 
         value >= MIN_YEAR && 
         value <= CURRENT_YEAR;
};

const isValidEmail = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateCreateAuthor = (data: unknown): asserts data is CreateAuthorRequest => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError(ErrorCode.INVALID_INPUT, 'Request body must be an object');
  }

  const obj = data as Record<string, unknown>;

  if (!isValidString(obj.name, MIN_NAME_LENGTH, MAX_NAME_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Name must be a string between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
  }

  if (!isValidString(obj.bio, MIN_BIO_LENGTH, MAX_BIO_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Bio must be a string between ${MIN_BIO_LENGTH} and ${MAX_BIO_LENGTH} characters`);
  }

  if (!isValidYear(obj.birthYear)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Birth year must be a valid year between ${MIN_YEAR} and ${CURRENT_YEAR}`);
  }
};

export const validateUpdateAuthor = (data: unknown): asserts data is UpdateAuthorRequest => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError(ErrorCode.INVALID_INPUT, 'Request body must be an object');
  }

  const obj = data as Record<string, unknown>;

  const hasValidField = obj.name !== undefined || obj.bio !== undefined || obj.birthYear !== undefined;
  if (!hasValidField) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, 'At least one field (name, bio, birthYear) must be provided');
  }

  if (obj.name !== undefined && !isValidString(obj.name, MIN_NAME_LENGTH, MAX_NAME_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Name must be a string between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
  }

  if (obj.bio !== undefined && !isValidString(obj.bio, MIN_BIO_LENGTH, MAX_BIO_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Bio must be a string between ${MIN_BIO_LENGTH} and ${MAX_BIO_LENGTH} characters`);
  }

  if (obj.birthYear !== undefined && !isValidYear(obj.birthYear)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Birth year must be a valid year between ${MIN_YEAR} and ${CURRENT_YEAR}`);
  }
};

export const validateCreateBook = (data: unknown): asserts data is CreateBookRequest => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError(ErrorCode.INVALID_INPUT, 'Request body must be an object');
  }

  const obj = data as Record<string, unknown>;

  if (!isValidString(obj.title, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Title must be a string between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`);
  }

  if (!isValidString(obj.summary, MIN_SUMMARY_LENGTH, MAX_SUMMARY_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Summary must be a string between ${MIN_SUMMARY_LENGTH} and ${MAX_SUMMARY_LENGTH} characters`);
  }

  if (!isValidYear(obj.publicationYear)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Publication year must be a valid year between ${MIN_YEAR} and ${CURRENT_YEAR}`);
  }

  if (!obj.authorId || typeof obj.authorId !== 'string' || !isValidUuid(obj.authorId)) {
    throw new ValidationError(ErrorCode.INVALID_AUTHOR_REFERENCE, 'Author ID must be a valid UUID');
  }
};

export const validateUpdateBook = (data: unknown): asserts data is UpdateBookRequest => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError(ErrorCode.INVALID_INPUT, 'Request body must be an object');
  }

  const obj = data as Record<string, unknown>;

  const hasValidField = obj.title !== undefined || 
                       obj.summary !== undefined || 
                       obj.publicationYear !== undefined || 
                       obj.authorId !== undefined;
  if (!hasValidField) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, 'At least one field (title, summary, publicationYear, authorId) must be provided');
  }

  if (obj.title !== undefined && !isValidString(obj.title, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Title must be a string between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`);
  }

  if (obj.summary !== undefined && !isValidString(obj.summary, MIN_SUMMARY_LENGTH, MAX_SUMMARY_LENGTH)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Summary must be a string between ${MIN_SUMMARY_LENGTH} and ${MAX_SUMMARY_LENGTH} characters`);
  }

  if (obj.publicationYear !== undefined && !isValidYear(obj.publicationYear)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, `Publication year must be a valid year between ${MIN_YEAR} and ${CURRENT_YEAR}`);
  }

  if (obj.authorId !== undefined && (typeof obj.authorId !== 'string' || !isValidUuid(obj.authorId))) {
    throw new ValidationError(ErrorCode.INVALID_AUTHOR_REFERENCE, 'Author ID must be a valid UUID');
  }
};

export const validateId = (id: unknown): asserts id is string => {
  if (!id || typeof id !== 'string' || !isValidUuid(id)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, 'ID must be a valid UUID');
  }
};

// Enhanced validation for user-related operations
export const validateEmail = (email: unknown): asserts email is string => {
  if (!isValidEmail(email)) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, 'Email must be a valid email address');
  }
};

export const validatePassword = (password: unknown): asserts password is string => {
  if (typeof password !== 'string' || password.length < 6) {
    throw new ValidationError(ErrorCode.VALIDATION_ERROR, 'Password must be at least 6 characters long');
  }
};

// Enhanced error classes
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  public code: ErrorCode;
  public details?: Record<string, unknown> | undefined;

  constructor(code: ErrorCode, message: string, details?: Record<string, unknown> | undefined) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ValidationError';
  }
}

export class ValidationErrors extends Error {
  public errors: ValidationErrorDetail[];
  public code: ErrorCode = ErrorCode.VALIDATION_ERROR;

  constructor(errors: ValidationErrorDetail[]) {
    super('Validation failed');
    this.errors = errors;
    this.name = 'ValidationErrors';
  }
} 