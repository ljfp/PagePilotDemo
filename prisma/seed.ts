import { PrismaClient, Author, Book, User } from '../src/generated/prisma/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.favorite.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  // Create 10 authors
  console.log('👨‍💼 Creating 10 authors...');
  const authors: Author[] = [];
  
  for (let i = 0; i < 10; i++) {
    const author = await prisma.author.create({
      data: {
        name: faker.person.fullName(),
        bio: faker.lorem.paragraphs(2, '\n\n'),
        birthYear: faker.date.between({ from: '1920-01-01', to: '1990-12-31' }).getFullYear(),
      },
    });
    authors.push(author);
  }

  // Create 20 books (5 authors with 3 books each, 5 authors with 1 book each)
  console.log('📚 Creating 20 books...');
  const books: Book[] = [];
  
  // First 5 authors get 3 books each (15 books)
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const book = await prisma.book.create({
        data: {
          title: faker.lorem.words({ min: 2, max: 5 }),
          summary: faker.lorem.paragraphs(3, '\n\n'),
          publicationYear: faker.date.between({ 
            from: `${authors[i].birthYear + 20}-01-01`, 
            to: '2024-12-31' 
          }).getFullYear(),
          authorId: authors[i].id,
        },
      });
      books.push(book);
    }
  }

  // Last 5 authors get 1 book each (5 books)
  for (let i = 5; i < 10; i++) {
    const book = await prisma.book.create({
      data: {
        title: faker.lorem.words({ min: 2, max: 5 }),
        summary: faker.lorem.paragraphs(3, '\n\n'),
        publicationYear: faker.date.between({ 
          from: `${authors[i].birthYear + 20}-01-01`, 
          to: '2024-12-31' 
        }).getFullYear(),
        authorId: authors[i].id,
      },
    });
    books.push(book);
  }

  // Create 10 users
  console.log('👥 Creating 10 users...');
  const users: User[] = [];
  
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
      },
    });
    users.push(user);
  }

  // Create favorites for 5 users (each user gets 1-3 favorite books)
  console.log('❤️ Creating favorites for 5 users...');
  
  for (let i = 0; i < 5; i++) {
    const numFavorites = faker.number.int({ min: 1, max: 3 });
    const selectedBooks = faker.helpers.arrayElements(books, numFavorites);
    
    for (const book of selectedBooks) {
      await prisma.favorite.create({
        data: {
          userId: users[i].id,
          bookId: book.id,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Created:`);
  console.log(`   - ${authors.length} authors`);
  console.log(`   - ${books.length} books`);
  console.log(`   - ${users.length} users`);
  console.log(`   - Favorites for 5 users`);
  console.log(`   - 5 authors with 3 books each`);
  console.log(`   - 5 authors with 1 book each`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 