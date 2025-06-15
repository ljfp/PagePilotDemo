import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BookService } from '../src/services/bookService.js';
import { AuthorService } from '../src/services/authorService.js';
import { prisma } from '../src/database/client.js';

describe('BookService', () => {
  const bookService = new BookService();
  const authorService = new AuthorService();
  let testAuthor: any;

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    
    testAuthor = await authorService.createAuthor({
      name: 'Test Author',
      bio: 'Test Bio',
      birthYear: 1980,
    });
  });

  afterEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
  });

  test('should create a new book', async () => {
    const bookData = {
      title: 'Test Book',
      summary: 'A test book for testing purposes',
      publicationYear: 2023,
      authorId: testAuthor.id,
    };

    const book = await bookService.createBook(bookData);

    expect(book).toBeDefined();
    expect(book.title).toBe(bookData.title);
    expect(book.summary).toBe(bookData.summary);
    expect(book.publicationYear).toBe(bookData.publicationYear);
    expect(book.authorId).toBe(bookData.authorId);
    expect(book.id).toBeDefined();
    expect(book.author).toBeDefined();
  });

  test('should get all books', async () => {
    const book1 = await bookService.createBook({
      title: 'Book 1',
      summary: 'Summary 1',
      publicationYear: 2020,
      authorId: testAuthor.id,
    });

    const book2 = await bookService.createBook({
      title: 'Book 2',
      summary: 'Summary 2',
      publicationYear: 2021,
      authorId: testAuthor.id,
    });

    const books = await bookService.getAllBooks();

    expect(books).toHaveLength(2);
    expect(books[1].id).toBe(book1.id);
    expect(books[0].id).toBe(book2.id);
    expect(books[0].author).toBeDefined();
  });

  test('should get book by id', async () => {
    const bookData = {
      title: 'Specific Book',
      summary: 'A specific book for testing',
      publicationYear: 2022,
      authorId: testAuthor.id,
    };

    const createdBook = await bookService.createBook(bookData);
    const foundBook = await bookService.getBookById(createdBook.id);

    expect(foundBook).toBeDefined();
    expect(foundBook?.title).toBe(bookData.title);
    expect(foundBook?.summary).toBe(bookData.summary);
    expect(foundBook?.publicationYear).toBe(bookData.publicationYear);
    expect(foundBook?.author).toBeDefined();
  });

  test('should update a book', async () => {
    const book = await bookService.createBook({
      title: 'Original Title',
      summary: 'Original Summary',
      publicationYear: 2020,
      authorId: testAuthor.id,
    });

    const updateData = {
      title: 'Updated Title',
      summary: 'Updated Summary',
    };

    const updatedBook = await bookService.updateBook(book.id, updateData);

    expect(updatedBook.title).toBe(updateData.title);
    expect(updatedBook.summary).toBe(updateData.summary);
    expect(updatedBook.publicationYear).toBe(2020);
    expect(updatedBook.author).toBeDefined();
  });

  test('should delete a book', async () => {
    const book = await bookService.createBook({
      title: 'To Delete',
      summary: 'Will be deleted',
      publicationYear: 2021,
      authorId: testAuthor.id,
    });

    await bookService.deleteBook(book.id);

    const foundBook = await bookService.getBookById(book.id);
    expect(foundBook).toBeNull();
  });

  test('should get books by author id', async () => {
    const anotherAuthor = await authorService.createAuthor({
      name: 'Another Author',
      bio: 'Another Bio',
      birthYear: 1985,
    });

    await bookService.createBook({
      title: 'Book by Test Author 1',
      summary: 'Summary 1',
      publicationYear: 2020,
      authorId: testAuthor.id,
    });

    await bookService.createBook({
      title: 'Book by Test Author 2',
      summary: 'Summary 2',
      publicationYear: 2021,
      authorId: testAuthor.id,
    });

    await bookService.createBook({
      title: 'Book by Another Author',
      summary: 'Summary 3',
      publicationYear: 2022,
      authorId: anotherAuthor.id,
    });

    const booksByTestAuthor = await bookService.getBooksByAuthorId(testAuthor.id);
    const booksByAnotherAuthor = await bookService.getBooksByAuthorId(anotherAuthor.id);

    expect(booksByTestAuthor).toHaveLength(2);
    expect(booksByAnotherAuthor).toHaveLength(1);
    expect(booksByTestAuthor[0].author).toBeDefined();
  });

  test('should check if book exists', async () => {
    const book = await bookService.createBook({
      title: 'Exists',
      summary: 'This book exists',
      publicationYear: 2023,
      authorId: testAuthor.id,
    });

    const exists = await bookService.bookExists(book.id);
    const notExists = await bookService.bookExists('non-existent-id');

    expect(exists).toBe(true);
    expect(notExists).toBe(false);
  });
}); 