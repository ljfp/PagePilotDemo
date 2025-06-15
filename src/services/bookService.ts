import { prisma } from '../database/client.js';
import { CreateBookRequest, UpdateBookRequest } from '../types/index.js';
import { Book } from '../generated/prisma/index.js';

export class BookService {
  async createBook(data: CreateBookRequest): Promise<Book> {
    return await prisma.book.create({
      data: {
        title: data.title,
        summary: data.summary,
        publicationYear: data.publicationYear,
        authorId: data.authorId,
      },
      include: { author: true },
    });
  }

  async getAllBooks(): Promise<Book[]> {
    return await prisma.book.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookById(id: string): Promise<Book | null> {
    return await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async updateBook(id: string, data: UpdateBookRequest): Promise<Book> {
    return await prisma.book.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async deleteBook(id: string): Promise<Book> {
    return await prisma.book.delete({
      where: { id },
    });
  }

  async getBooksByAuthorId(authorId: string): Promise<Book[]> {
    return await prisma.book.findMany({
      where: { authorId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async bookExists(id: string): Promise<boolean> {
    const book = await prisma.book.findUnique({
      where: { id },
    });
    return book !== null;
  }
}

export const bookService = new BookService(); 