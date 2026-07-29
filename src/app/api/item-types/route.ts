import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureDefaultCatalog } from '@/lib/catalog-defaults';

const schema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  position: z.coerce.number().int().nonnegative().optional(),
});

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

function refresh() {
  revalidatePath('/');
  revalidatePath('/admin/products');
}

export async function GET() {
  try {
    await ensureDefaultCatalog();
    const itemTypes = await (prisma as any).itemType.findMany({ orderBy: [{ position: 'asc' }, { name: 'asc' }] });
    return NextResponse.json({ itemTypes });
  } catch {
    return NextResponse.json({ itemTypes: [] });
  }
}

export async function POST(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const input = schema.parse(await request.json());
    const itemType = await (prisma as any).itemType.create({ data: { ...input, position: input.position ?? 0 } });
    refresh();
    return NextResponse.json({ itemType }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid item type.' }, { status: 400 });
    return NextResponse.json({ error: 'Could not create item type. Make sure the slug is unique.' }, { status: 500 });
  }
}
