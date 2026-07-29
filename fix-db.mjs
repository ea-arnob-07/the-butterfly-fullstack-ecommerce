import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "OtpCode";`);
    console.log("Deleted all rows from OtpCode table");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
