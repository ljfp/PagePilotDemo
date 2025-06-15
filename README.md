# PagePilot Backend

Backend service for PagePilot bookstore platform.

## Overview

PagePilot is a platform designed to help independent bookstores manage their inventory, sales, and operations through a clean and simple digital interface.

This backend service provides REST API endpoints for managing books, authors, and their relationships.

## Features

- CRUD operations for Books and Authors
- Link Books to Authors (many-to-one relationship)  
- Fetch all books by a specific author
- RESTful API design with proper HTTP status codes
- TypeScript implementation with strict type checking
- Fastify web framework for high performance
- Prisma ORM with SQLite database
- Input validation for all endpoints
- Comprehensive test suite with Vitest
- OpenAPI/Swagger documentation
- Structured logging with Pino

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Database Setup

```bash
npm run db:push
```

### Database Seeding

To populate the database with sample data for development and testing:

```bash
npm run db:seed
```

This will create:
- 10 authors (5 with 3 books each, 5 with 1 book each)
- 20 books total
- 10 users with hashed passwords
- 5 users with favorite books

To reset the database and reseed:

```bash
npm run db:reset
```

To verify the seeded data:

```bash
npm run db:verify
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3000` with:
- 📊 Health check: `http://localhost:3000/health`
- 📚 API Documentation: `http://localhost:3000/docs`

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

### Start Production

```bash
npm start
```

## API Endpoints

### Health
- `GET /health` - Health check endpoint

### Authors
- `POST /authors` - Create a new author
- `GET /authors` - List all authors
- `GET /authors/:id` - Get author by ID
- `PUT /authors/:id` - Update author by ID
- `DELETE /authors/:id` - Delete author by ID

### Books
- `POST /books` - Create a new book
- `GET /books` - List all books
- `GET /books/:id` - Get book by ID
- `PUT /books/:id` - Update book by ID
- `DELETE /books/:id` - Delete book by ID

### Relationships
- `GET /authors/:id/books` - Get all books by author

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)

## Data Models

### Author
```typescript
{
  id: string;           // UUID
  name: string;         // Author's full name
  bio: string;          // Author biography
  birthYear: number;    // Year of birth
  createdAt: Date;      // Record creation timestamp
  updatedAt: Date;      // Record update timestamp
}
```

### Book
```typescript
{
  id: string;              // UUID
  title: string;           // Book title
  summary: string;         // Book description
  publicationYear: number; // Year published
  authorId: string;        // Reference to Author
  createdAt: Date;         // Record creation timestamp
  updatedAt: Date;         // Record update timestamp
  author?: Author;         // Author information (when included)
}
```

## Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── routes/          # API route definitions with schemas
├── database/        # Database connection and configuration
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (validation)
└── generated/       # Generated Prisma client

tests/               # Test files
prisma/              # Database schema and migrations
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Populate database with sample data
- `npm run db:reset` - Reset database and reseed with sample data
- `npm run db:verify` - Verify seeded data structure

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript with strict configuration
- **Web Framework**: Fastify for high performance
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest with comprehensive test coverage
- **Documentation**: OpenAPI 3.0 with Swagger UI
- **Validation**: Custom validation utilities
- **Logging**: Pino for structured logging

## Development

The project follows a layered architecture:

1. **Routes**: Define API endpoints with OpenAPI schemas
2. **Controllers**: Handle HTTP requests/responses and validation
3. **Services**: Implement business logic and database operations
4. **Database**: Prisma-managed data layer

All endpoints include:
- Input validation with detailed error messages
- Proper HTTP status codes
- Consistent JSON response format
- OpenAPI documentation
- Comprehensive test coverage 