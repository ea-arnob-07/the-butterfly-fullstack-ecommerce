import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.union([
  z.object({ action: z.literal('restore') }),
  z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    segment: z.enum(['WOMEN', 'MEN', 'CHILDREN']),
    position: z.coerce.number().int().nonnegative(),
  }),
]);

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

function refresh() {
  revalidatePath('/women'); revalidatePath('/men'); revalidatePath('/children'); revalidatePath('/admin/products');
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const input = schema.parse(await request.json());
    const category = 'action' in input
      ? await prisma.category.update({ where: { id }, data: { isActive: true } })
      : await prisma.category.update({ where: { id }, data: input });
    refresh();
    return NextResponse.json({ category });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid category.' }, { status: 400 });
    return NextResponse.json({ error: 'Could not update category.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const category = await prisma.category.update({ where: { id }, data: { isActive: false } });
    refresh();
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: 'Could not remove category.' }, { status: 500 });
  }
}
