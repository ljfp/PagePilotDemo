import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { AuthorService } from '../src/services/authorService.js';
import { prisma } from '../src/database/client.js';

describe('AuthorService', () => {
  const authorService = new AuthorService();

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
  });

  afterEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
  });

  test('should create a new author', async () => {
    const authorData = {
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series',
      birthYear: 1965,
    };

    const author = await authorService.createAuthor(authorData);

    expect(author).toBeDefined();
    expect(author.name).toBe(authorData.name);
    expect(author.bio).toBe(authorData.bio);
    expect(author.birthYear).toBe(authorData.birthYear);
    expect(author.id).toBeDefined();
  });

  test('should get all authors', async () => {
    const author1 = await authorService.createAuthor({
      name: 'Author 1',
      bio: 'Bio 1',
      birthYear: 1980,
    });

    const author2 = await authorService.createAuthor({
      name: 'Author 2',
      bio: 'Bio 2',
      birthYear: 1990,
    });

    const authors = await authorService.getAllAuthors();

    expect(authors).toHaveLength(2);
    expect(authors[1].id).toBe(author1.id);
    expect(authors[0].id).toBe(author2.id);
  });

  test('should get author by id', async () => {
    const authorData = {
      name: 'Stephen King',
      bio: 'American author of horror, supernatural fiction, and fantasy',
      birthYear: 1947,
    };

    const createdAuthor = await authorService.createAuthor(authorData);
    const foundAuthor = await authorService.getAuthorById(createdAuthor.id);

    expect(foundAuthor).toBeDefined();
    expect(foundAuthor?.name).toBe(authorData.name);
    expect(foundAuthor?.bio).toBe(authorData.bio);
    expect(foundAuthor?.birthYear).toBe(authorData.birthYear);
  });

  test('should update an author', async () => {
    const author = await authorService.createAuthor({
      name: 'Original Name',
      bio: 'Original Bio',
      birthYear: 1975,
    });

    const updateData = {
      name: 'Updated Name',
      bio: 'Updated Bio',
    };

    const updatedAuthor = await authorService.updateAuthor(author.id, updateData);

    expect(updatedAuthor.name).toBe(updateData.name);
    expect(updatedAuthor.bio).toBe(updateData.bio);
    expect(updatedAuthor.birthYear).toBe(1975);
  });

  test('should delete an author', async () => {
    const author = await authorService.createAuthor({
      name: 'To Delete',
      bio: 'Will be deleted',
      birthYear: 1980,
    });

    await authorService.deleteAuthor(author.id);

    const foundAuthor = await authorService.getAuthorById(author.id);
    expect(foundAuthor).toBeNull();
  });

  test('should check if author exists', async () => {
    const author = await authorService.createAuthor({
      name: 'Exists',
      bio: 'This author exists',
      birthYear: 1985,
    });

    const exists = await authorService.authorExists(author.id);
    const notExists = await authorService.authorExists('non-existent-id');

    expect(exists).toBe(true);
    expect(notExists).toBe(false);
  });
}); 