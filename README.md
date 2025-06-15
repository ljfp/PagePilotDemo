# PagePilot Backend

Backend service for PagePilot bookstore platform.

## Overview

PagePilot is a platform designed to help independent bookstores manage their inventory, sales, and operations through a clean and simple digital interface.

This backend service provides REST API endpoints for managing books, authors, and their relationships.

## Features

- CRUD operations for Books and Authors
- Link Books to Authors (many-to-one relationship)
- Fetch all books by a specific author
- RESTful API design
- TypeScript implementation
- Fastify web framework

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
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

### Books
- `POST /books` - Create a new book
- `GET /books` - List all books
- `GET /books/:id` - Get book by ID
- `PUT /books/:id` - Update book by ID
- `DELETE /books/:id` - Delete book by ID

### Authors
- `POST /authors` - Create a new author
- `GET /authors` - List all authors
- `GET /authors/:id` - Get author by ID
- `PUT /authors/:id` - Update author by ID
- `DELETE /authors/:id` - Delete author by ID

### Relationships
- `GET /authors/:id/books` - Get all books by author

## Tech Stack

- TypeScript
- Fastify
- Node.js 