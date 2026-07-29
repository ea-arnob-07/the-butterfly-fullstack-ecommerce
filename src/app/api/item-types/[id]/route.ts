import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.union([
  z.object({ action: z.literal('restore') }),
  z.object({
    name: z.string().min(2).max(60),
    slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
    position: z.coerce.number().int().nonnegative(),
  }),
]);

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

function refresh() {
  revalidatePath('/');
  revalidatePath('/admin/products');
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const input = schema.parse(await request.json());
    const itemType = 'action' in input
      ? await (prisma as any).itemType.update({ where: { id }, data: { isActive: true } })
      : await (prisma as any).itemType.update({ where: { id }, data: input });
    refresh();
    return NextResponse.json({ itemType });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid item type.' }, { status: 400 });
    return NextResponse.json({ error: 'Could not update item type.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const itemType = await (prisma as any).itemType.update({ where: { id }, data: { isActive: false } });
    refresh();
    return NextResponse.json({ itemType });
  } catch {
    return NextResponse.json({ error: 'Could not remove item type.' }, { status: 500 });
  }
}
