/**
 * Core entity interfaces for the PagePilot backend
 */

// Core entity interfaces (matching Prisma models)
export interface Author {
  id: string;           // UUID
  name: string;         // Author's full name
  bio: string;          // Biography
  birthYear: number;    // Birth year
  createdAt: Date;      // Record creation timestamp
  updatedAt: Date;      // Last update timestamp
}

export interface Book {
  id: string;           // UUID
  title: string;        // Book title
  summary: string;      // Book summary
  publicationYear: number; // Publication year
  authorId: string;     // Reference to Author ID
  createdAt: Date;      // Record creation timestamp
  updatedAt: Date;      // Last update timestamp
}

export interface User {
  id: string;           // UUID
  email: string;        // User email address
  name: string;         // User full name
  createdAt: Date;      // Account creation timestamp
  updatedAt: Date;      // Last update timestamp
  // Note: password is excluded from this interface for security
}

export interface Favorite {
  id: string;           // UUID
  userId: string;       // Reference to User ID
  bookId: string;       // Reference to Book ID
  createdAt: Date;      // Record creation timestamp
}

// Data Transfer Objects for API requests
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

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface AddFavoriteRequest {
  bookId: string;
}

// Extended entities with relationships
export interface BookWithAuthor extends Book {
  author: Author;
}

export interface AuthorWithBooks extends Author {
  books: Book[];
}

export interface UserWithFavorites extends User {
  favorites: (Favorite & { book: Book })[];
} 