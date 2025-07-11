import { prisma } from '../server';

beforeAll(async () => {
  // Setup test database
});

afterAll(async () => {
  await prisma.$disconnect();
});