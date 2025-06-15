import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying seeded data...\n');

  // Count records
  const authorCount = await prisma.author.count();
  const bookCount = await prisma.book.count();
  const userCount = await prisma.user.count();
  const favoriteCount = await prisma.favorite.count();

  console.log('📊 Record counts:');
  console.log(`   - Authors: ${authorCount}`);
  console.log(`   - Books: ${bookCount}`);
  console.log(`   - Users: ${userCount}`);
  console.log(`   - Favorites: ${favoriteCount}\n`);

  // Check author-book distribution
  console.log('📚 Author-book distribution:');
  const authorsWithBooks = await prisma.author.findMany({
    include: {
      _count: {
        select: { books: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  authorsWithBooks.forEach((author, index) => {
    console.log(`   ${index + 1}. ${author.name} (${author.birthYear}) - ${author._count.books} book(s)`);
  });

  // Check users with favorites
  console.log('\n❤️ Users with favorites:');
  const usersWithFavorites = await prisma.user.findMany({
    include: {
      _count: {
        select: { favorites: true }
      }
    },
    where: {
      favorites: {
        some: {}
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  usersWithFavorites.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user._count.favorites} favorite(s)`);
  });

  console.log('\n✅ Verification completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during verification:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 