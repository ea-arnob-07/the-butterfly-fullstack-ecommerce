import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ productId: z.string().min(1) });

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ active: false, items: [] }, { status: 401 });
  const productId = new URL(request.url).searchParams.get('productId');
  if (productId) {
    const item = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: session.userId, productId } } });
    return NextResponse.json({ active: Boolean(item) });
  }
  const items = await prisma.wishlistItem.findMany({ where: { userId: session.userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Login required.' }, { status: 401 });
  try {
    const { productId } = schema.parse(await request.json());
    const product = await prisma.product.findFirst({ where: { id: productId, deletedAt: null, isPublished: true } });
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: session.userId, productId } },
      update: {},
      create: { userId: session.userId, productId }
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
    return NextResponse.json({ error: 'Could not update wishlist.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Login required.' }, { status: 401 });
  const productId = new URL(request.url).searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'Product is required.' }, { status: 400 });
  await prisma.wishlistItem.deleteMany({ where: { userId: session.userId, productId } });
  return NextResponse.json({ success: true });
}
