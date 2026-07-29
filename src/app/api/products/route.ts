import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getProducts } from '@/lib/products';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const imageSchema = z.object({ url: z.string().url(), isCover: z.boolean().optional() });
const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  segment: z.enum(['WOMEN', 'MEN', 'CHILDREN', 'UNISEX']),
  categoryId: z.string().min(1),
  itemTypeId: z.string().min(1).optional().nullable(),
  basePrice: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().min(2),
  images: z.array(imageSchema).min(1).max(20),
  sizes: z.array(z.string()).min(1),
  colors: z.array(z.string()).min(1),
  stock: z.coerce.number().int().nonnegative(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
});

function refreshStore() {
  revalidatePath('/'); revalidatePath('/women'); revalidatePath('/men'); revalidatePath('/children'); revalidatePath('/admin/products');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const segment = searchParams.get('segment');
  const allowed = ['WOMEN', 'MEN', 'CHILDREN', 'UNISEX'] as const;
  const products = await getProducts(allowed.includes(segment as any) ? (segment as any) : undefined);
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const input = createSchema.parse(await request.json());
    const coverIndex = Math.max(0, input.images.findIndex((image) => image.isCover));
    const product = await (prisma as any).product.create({
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
        isBestSeller: input.isBestSeller,
        isNewArrival: input.isNewArrival,
        images: {
          create: input.images.map((image, index) => ({
            url: image.url,
            alt: `${input.name} image ${index + 1}`,
            position: index,
            isCover: index === coverIndex,
          })),
        },
        variants: {
          create: input.sizes.flatMap((size) => input.colors.map((color) => ({
            size,
            color,
            stock: input.stock,
            sku: `${input.sku}-${size}-${color}`.replace(/\s+/g, '-').toUpperCase(),
          }))),
        },
      },
      include: { category: true, itemType: true, images: true, variants: true },
    });
    refreshStore();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid product.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: 'Could not create product. Check unique slug and SKU.' }, { status: 500 });
  }
}
