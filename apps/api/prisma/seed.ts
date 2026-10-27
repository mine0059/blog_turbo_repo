import { faker } from '@faker-js/faker';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

// 1. Create the adapter with your database URL
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

// 2. Pass the adapter to the Prisma Client
const prisma = new PrismaClient({ adapter });

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

async function main() {
  console.log('Seeding users...');
  const usersData = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: `${faker.string.alphanumeric(6)}_${faker.internet.email()}`.toLowerCase(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
  }));

  await prisma.user.createMany({
    data: usersData,
  });

  // Fetch created users to guarantee valid authorIds
  const users = await prisma.user.findMany({ select: { id: true } });
  const userIds = users.map((u) => u.id);

  console.log(`Found ${userIds.length} users. Seeding posts and comments...`);

  for (let i = 0; i < 40; i++) {
    const title = faker.lorem.sentence();
    const slug = `${generateSlug(title)}-${faker.string.alphanumeric(6)}`;
    const randomAuthorId = faker.helpers.arrayElement(userIds);

    await prisma.post.create({
      data: {
        title,
        slug,
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
        authorId: randomAuthorId,
        published: true,
        comments: {
          createMany: {
            data: Array.from({ length: 10 }).map(() => ({
              content: faker.lorem.sentences(2),
              authorId: faker.helpers.arrayElement(userIds),
            })),
          },
        },
      },
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    console.error('Error during seeding:', error);
    process.exit(1);
  });
