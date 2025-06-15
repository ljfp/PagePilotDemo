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

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Required: Database URL (SQLite for local development)
DATABASE_URL="file:./dev.db"

# Required: JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: Server configuration
PORT=3000
HOST=0.0.0.0
```

**Important**: 
- For production, generate a secure JWT secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit your `.env` file to version control

### Verify Setup

Check if your environment is properly configured:

```bash
npm run setup:verify
```

This will verify that all required environment variables are set and dependencies are installed.

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
- Welcome message" `http://localhost:3000/`
- Health check: `http://localhost:3000/health`
- API Documentation: `http://localhost:3000/docs`

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

## Docker Deployment

### Prerequisites

- Docker-engine installed
- Docker daemon must be running

### Quick Start with Docker

```bash
# Build and start the application
npm run docker:up

# View logs
npm run docker:logs

# Stop the application
npm run docker:down
```

### Manual Docker Commands

```bash
# Build the Docker image
npm run docker:build

# Run a single container
npm run docker:run
```

### Docker Services

When using `docker compose up`, the following services are available:

- **API Server**: `http://localhost:3000`
  - Health check: `http://localhost:3000/health`
  - API documentation: `http://localhost:3000/docs`
- **SQLite Web UI**: `http://localhost:8080` (optional database viewer)

### Production Environment

Copy `.env.production` to `.env.production.local` and update the values:

```bash
cp .env.production .env.production.local
# Edit .env.production.local with your production values
```

**Important**: Change the `JWT_SECRET` in production!

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
scripts/             # Utility scripts (seeding, verification)
.env.example         # Environment variables template
.env                 # Environment variables (not in git)
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
- `npm run setup:verify` - Verify environment and setup configuration
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:up` - Start Docker Compose services
- `npm run docker:down` - Stop Docker Compose services
- `npm run docker:logs` - View Docker container logs

## Development

The project follows a layered architecture:

1. **Routes**: Define API endpoints with OpenAPI schemas
2. **Controllers**: Handle HTTP requests/responses and validation
3. **Services**: Implement business logic and database operations
4. **Database**: Prisma-managed data layer

### Environment Variables

The application uses the following environment variables:

- `DATABASE_URL` - Database connection string (required)
- `JWT_SECRET` - Secret key for JWT token signing (required)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `LOG_LEVEL` - Logging level (default: info)

All endpoints include:
- Input validation with detailed error messages
- Proper HTTP status codes
- Consistent JSON response format
- OpenAPI documentation
- Comprehensive test coverage

## Troubleshooting

### Common Issues

**"Cannot find module" errors**
```bash
# Regenerate Prisma client
npm run db:generate
```

**Database connection errors**
```bash
# Ensure .env file exists and DATABASE_URL is set
cp .env.example .env
# Edit .env with correct DATABASE_URL
```

**JWT errors in authentication endpoints**
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add the generated secret to your .env file as JWT_SECRET
```

**Port already in use**
```bash
# Change PORT in .env file or kill existing process
lsof -ti:3000 | xargs kill -9
``` 