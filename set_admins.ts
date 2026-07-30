import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const p1 = await bcrypt.hash('TamannA111', 12);
  await client.query(`
    INSERT INTO "User" (id, name, email, "passwordHash", role, "isActive", "emailVerifiedAt", "updatedAt")
    VALUES ('cuid_admin1', 'Butterfly', 'butterflythe710@gmail.com', $1, 'SUPER_ADMIN', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET "passwordHash" = $1, role = 'SUPER_ADMIN', "isActive" = true, "emailVerifiedAt" = NOW();
  `, [p1]);

  const p2 = await bcrypt.hash('arnob1234', 12);
  await client.query(`
    INSERT INTO "User" (id, name, email, "passwordHash", role, "isActive", "emailVerifiedAt", "updatedAt")
    VALUES ('cuid_admin2', 'Arnob', 'eaarnob178@gmail.com', $1, 'ADMIN', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET "passwordHash" = $1, role = 'ADMIN', "isActive" = true, "emailVerifiedAt" = NOW();
  `, [p2]);

  console.log('BOTH ADMINS SET PROPERLY VIA PG!');
  await client.end();
}
main().catch(console.error);
