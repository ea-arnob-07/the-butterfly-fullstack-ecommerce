import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateSchema = z.union([
  z.object({ action: z.literal('restore') }),
  z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    description: z.string().min(10),
    segment: z.enum(['WOMEN', 'MEN', 'CHILDREN', 'UNISEX']),
    categoryId: z.string().min(1),
    itemTypeId: z.string().min(1).optional().nullable(),
    basePrice: z.coerce.number().positive(),
    salePrice: z.coerce.number().positive().optional().nullable(),
    sku: z.string().min(2),
    stock: z.coerce.number().int().nonnegative(),
    sizes: z.array(z.string()).min(1),
    colors: z.array(z.string()).min(1),
    images: z.array(z.object({ url: z.string().url(), isCover: z.boolean().optional() })).min(1).max(20),
    isPublished: z.boolean(),
    isNewArrival: z.boolean(),
    isBestSeller: z.boolean(),
  }),
]);

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

function refreshStore(slug?: string) {
  revalidatePath('/'); revalidatePath('/women'); revalidatePath('/men'); revalidatePath('/children'); revalidatePath('/admin/products');
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const input = updateSchema.parse(await request.json());
    if ('action' in input) {
      const product = await (prisma as any).product.update({ where: { id }, data: { deletedAt: null, isPublished: true } });
      refreshStore(product.slug);
      return NextResponse.json({ product });
    }
    const coverIndex = Math.max(0, input.images.findIndex((image) => image.isCover));
    const product = await (prisma as any).product.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        shortDescription: input.description.slice(0, 150),
        segment: input.segment,
        categoryId: input.categoryId,
        itemTypeId: input.itemTypeId || null,
        basePrice: input.basePrice,
        salePrice: input.salePrice || null,
        sku: input.sku,
        isPublished: input.isPublished,
        isNewArrival: input.isNewArrival,
        isBestSeller: input.isBestSeller,
        images: {
          deleteMany: {},
          create: input.images.map((image, index) => ({ url: image.url, alt: `${input.name} image ${index + 1}`, position: index, isCover: index === coverIndex })),
        },
        variants: {
          deleteMany: {},
          create: input.sizes.flatMap((size) => input.colors.map((color) => ({
            size,
            color,
            stock: input.stock,
            sku: `${input.sku}-${size}-${color}`.replace(/\s+/g, '-').toUpperCase(),
          }))),
        },
      },
      include: { category: true, itemType: true, images: { orderBy: { position: 'asc' } }, variants: true },
    });
    refreshStore(product.slug);
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid product information.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: 'Could not update product.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { id } = await params;
    const url = new URL(request.url);
    if (url.searchParams.get('permanent') === 'true') {
      await (prisma as any).orderItem.deleteMany({ where: { productId: id } });
      await (prisma as any).product.delete({ where: { id } });
      refreshStore();
      return NextResponse.json({ success: true });
    }
    const product = await (prisma as any).product.update({ where: { id }, data: { deletedAt: new Date(), isPublished: false } });
    refreshStore(product.slug);
    return NextResponse.json({ product });
  } catch (error) {
    console.error('DELETE ERROR:', error);
    return NextResponse.json({ error: 'Could not archive or delete product.' }, { status: 500 });
  }
}
