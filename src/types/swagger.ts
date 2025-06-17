/**
 * OpenAPI/Swagger schema definitions for PagePilot API
 */

// Author schemas
export const AuthorSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique identifier for the author' },
    name: { type: 'string', minLength: 1, maxLength: 200, description: 'Author full name' },
    bio: { type: 'string', minLength: 1, maxLength: 1000, description: 'Author biography' },
    birthYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Author birth year' },
    createdAt: { type: 'string', format: 'date-time', description: 'Record creation timestamp' },
    updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
  },
  required: ['id', 'name', 'bio', 'birthYear', 'createdAt', 'updatedAt']
} as const;

export const CreateAuthorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200, description: 'Author full name' },
    bio: { type: 'string', minLength: 1, maxLength: 1000, description: 'Author biography' },
    birthYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Author birth year' }
  },
  required: ['name', 'bio', 'birthYear'],
  additionalProperties: false
} as const;

export const UpdateAuthorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200, description: 'Author full name' },
    bio: { type: 'string', minLength: 1, maxLength: 1000, description: 'Author biography' },
    birthYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Author birth year' }
  },
  additionalProperties: false,
  minProperties: 1
} as const;

// Book schemas
export const BookSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique identifier for the book' },
    title: { type: 'string', minLength: 1, maxLength: 300, description: 'Book title' },
    summary: { type: 'string', minLength: 1, maxLength: 2000, description: 'Book summary' },
    publicationYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Publication year' },
    authorId: { type: 'string', format: 'uuid', description: 'Reference to author ID' },
    createdAt: { type: 'string', format: 'date-time', description: 'Record creation timestamp' },
    updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
  },
  required: ['id', 'title', 'summary', 'publicationYear', 'authorId', 'createdAt', 'updatedAt']
} as const;

export const CreateBookSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 300, description: 'Book title' },
    summary: { type: 'string', minLength: 1, maxLength: 2000, description: 'Book summary' },
    publicationYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Publication year' },
    authorId: { type: 'string', format: 'uuid', description: 'Reference to author ID' }
  },
  required: ['title', 'summary', 'publicationYear', 'authorId'],
  additionalProperties: false
} as const;

export const UpdateBookSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 300, description: 'Book title' },
    summary: { type: 'string', minLength: 1, maxLength: 2000, description: 'Book summary' },
    publicationYear: { type: 'integer', minimum: 1000, maximum: 2024, description: 'Publication year' },
    authorId: { type: 'string', format: 'uuid', description: 'Reference to author ID' }
  },
  additionalProperties: false,
  minProperties: 1
} as const;

// User schemas
export const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique identifier for the user' },
    email: { type: 'string', format: 'email', description: 'User email address' },
    name: { type: 'string', minLength: 1, maxLength: 100, description: 'User full name' },
    createdAt: { type: 'string', format: 'date-time', description: 'Account creation timestamp' },
    updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
  },
  required: ['id', 'email', 'name', 'createdAt', 'updatedAt']
} as const;

export const RegisterUserSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', description: 'User email address' },
    password: { type: 'string', minLength: 6, description: 'User password (minimum 6 characters)' },
    name: { type: 'string', minLength: 1, maxLength: 100, description: 'User full name' }
  },
  required: ['email', 'password', 'name'],
  additionalProperties: false
} as const;

export const LoginUserSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', description: 'User email address' },
    password: { type: 'string', description: 'User password' }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as const;

// Favorite schemas
export const FavoriteSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique identifier for the favorite' },
    userId: { type: 'string', format: 'uuid', description: 'Reference to user ID' },
    bookId: { type: 'string', format: 'uuid', description: 'Reference to book ID' },
    createdAt: { type: 'string', format: 'date-time', description: 'Record creation timestamp' }
  },
  required: ['id', 'userId', 'bookId', 'createdAt']
} as const;

export const AddFavoriteSchema = {
  type: 'object',
  properties: {
    bookId: { type: 'string', format: 'uuid', description: 'Reference to book ID' }
  },
  required: ['bookId'],
  additionalProperties: false
} as const;

// Response schemas
export const SuccessResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', enum: [true] },
    data: { description: 'Response data' },
    message: { type: 'string', description: 'Success message' }
  },
  required: ['success', 'data', 'message']
} as const;

export const ErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', enum: [false] },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Error code' },
        message: { type: 'string', description: 'Error message' },
        details: { type: 'object', description: 'Additional error details' }
      },
      required: ['code', 'message']
    }
  },
  required: ['success', 'error']
} as const;

// Parameter schemas
export const UuidParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'UUID identifier' }
  },
  required: ['id']
} as const;

// Health check schema
export const HealthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ok'] },
    message: { type: 'string', description: 'Health status message' }
  },
  required: ['status', 'message']
} as const;

// Welcome response schema
export const WelcomeResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', enum: [true] },
    data: {
      type: 'object',
      properties: {
        service: { type: 'string' },
        version: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['service', 'version', 'description']
    },
    message: { type: 'string' }
  },
  required: ['success', 'data', 'message']
} as const; 