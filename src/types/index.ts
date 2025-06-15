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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
} 