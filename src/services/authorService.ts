import { prisma } from '../database/client.js';
import { CreateAuthorRequest, UpdateAuthorRequest } from '../types/index.js';
import { Author } from '../generated/prisma/index.js';

export class AuthorService {
  async createAuthor(data: CreateAuthorRequest): Promise<Author> {
    return await prisma.author.create({
      data: {
        name: data.name,
        bio: data.bio,
        birthYear: data.birthYear,
      },
    });
  }

  async getAllAuthors(): Promise<Author[]> {
    return await prisma.author.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuthorById(id: string): Promise<Author | null> {
    return await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async updateAuthor(id: string, data: UpdateAuthorRequest): Promise<Author> {
    return await prisma.author.update({
      where: { id },
      data,
    });
  }

  async deleteAuthor(id: string): Promise<Author> {
    return await prisma.author.delete({
      where: { id },
    });
  }

  async authorExists(id: string): Promise<boolean> {
    const author = await prisma.author.findUnique({
      where: { id },
    });
    return author !== null;
  }
}

export const authorService = new AuthorService(); 