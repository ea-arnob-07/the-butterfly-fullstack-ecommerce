import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'butterflythe710@gmail.com';
  const adminPassword = 'TamannA111';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Update or create the admin user
  await prisma.user.upsert({
    where: { email: 'eaarnob178@gmail.com' }, // find old admin
    update: { email: adminEmail, passwordHash, name: 'The Butterfly Owner', role: 'SUPER_ADMIN' },
    create: { email: adminEmail, passwordHash, name: 'The Butterfly Owner', role: 'SUPER_ADMIN', emailVerifiedAt: new Date() }
  });
  
  // also check if they already exist with the new email
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
     await prisma.user.update({
       where: { email: adminEmail },
       data: { passwordHash, role: 'SUPER_ADMIN' }
     });
  }
  
  console.log('Admin updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
