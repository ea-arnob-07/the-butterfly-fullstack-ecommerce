import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureDefaultCatalog } from '@/lib/catalog-defaults';

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  segment: z.enum(['WOMEN', 'MEN', 'CHILDREN']),
  position: z.coerce.number().int().nonnegative().optional(),
});

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

export async function GET() {
  await ensureDefaultCatalog();
  const categories = await prisma.category.findMany({ orderBy: [{ segment: 'asc' }, { position: 'asc' }, { name: 'asc' }] });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const input = schema.parse(await request.json());
    const category = await prisma.category.create({ data: { ...input, position: input.position ?? 0 } });
    revalidatePath('/women'); revalidatePath('/men'); revalidatePath('/children'); revalidatePath('/admin/products');
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid category.' }, { status: 400 });
    return NextResponse.json({ error: 'Could not create category. Make sure the slug is unique.' }, { status: 500 });
  }
}
