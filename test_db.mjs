import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.review.findMany({
    include: { user: true, product: true }
  });
  console.log('Reviews in DB:', reviews.length);
  if (reviews.length > 0) console.log(reviews[0]);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
