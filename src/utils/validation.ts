export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationErrors extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.errors = errors;
    this.name = 'ValidationErrors';
  }
}

export function validateCreateAuthor(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!data.bio || typeof data.bio !== 'string' || data.bio.trim().length === 0) {
    errors.push({ field: 'bio', message: 'Bio is required and must be a non-empty string' });
  }

  if (!data.birthYear || typeof data.birthYear !== 'number' || data.birthYear < 0 || data.birthYear > new Date().getFullYear()) {
    errors.push({ field: 'birthYear', message: 'Birth year must be a valid year' });
  }

  return errors;
}

export function validateUpdateAuthor(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name must be a non-empty string' });
    }
  }

  if (data.bio !== undefined) {
    if (typeof data.bio !== 'string' || data.bio.trim().length === 0) {
      errors.push({ field: 'bio', message: 'Bio must be a non-empty string' });
    }
  }

  if (data.birthYear !== undefined) {
    if (typeof data.birthYear !== 'number' || data.birthYear < 0 || data.birthYear > new Date().getFullYear()) {
      errors.push({ field: 'birthYear', message: 'Birth year must be a valid year' });
    }
  }

  return errors;
}

export function validateCreateBook(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  if (!data.summary || typeof data.summary !== 'string' || data.summary.trim().length === 0) {
    errors.push({ field: 'summary', message: 'Summary is required and must be a non-empty string' });
  }

  if (!data.publicationYear || typeof data.publicationYear !== 'number' || data.publicationYear < 0 || data.publicationYear > new Date().getFullYear()) {
    errors.push({ field: 'publicationYear', message: 'Publication year must be a valid year' });
  }

  if (!data.authorId || typeof data.authorId !== 'string' || data.authorId.trim().length === 0) {
    errors.push({ field: 'authorId', message: 'Author ID is required and must be a non-empty string' });
  }

  return errors;
}

export function validateUpdateBook(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title must be a non-empty string' });
    }
  }

  if (data.summary !== undefined) {
    if (typeof data.summary !== 'string' || data.summary.trim().length === 0) {
      errors.push({ field: 'summary', message: 'Summary must be a non-empty string' });
    }
  }

  if (data.publicationYear !== undefined) {
    if (typeof data.publicationYear !== 'number' || data.publicationYear < 0 || data.publicationYear > new Date().getFullYear()) {
      errors.push({ field: 'publicationYear', message: 'Publication year must be a valid year' });
    }
  }

  if (data.authorId !== undefined) {
    if (typeof data.authorId !== 'string' || data.authorId.trim().length === 0) {
      errors.push({ field: 'authorId', message: 'Author ID must be a non-empty string' });
    }
  }

  return errors;
}

export function validateId(id: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    errors.push({ field: 'id', message: 'ID is required and must be a non-empty string' });
  }

  return errors;
} 