import { prisma } from './prisma';
import { demoProducts } from './demo-products';
import type { StoreProduct } from './types';

export function serializeProduct(product: any): StoreProduct {
  const sizes = [...new Set(product.variants.map((v: any) => v.size))] as string[];
  const colors = [...new Set(product.variants.map((v: any) => v.color))] as string[];
  const sortedImages = [...product.images].sort((a: any, b: any) => Number(b.isCover) - Number(a.isCover) || a.position - b.position);
  const images = sortedImages.map((image: any) => ({ url: image.url, alt: image.alt, isCover: image.isCover }));
  const imageUrl = images[0]?.url || '/images/butterfly-logo-transparent.png';
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    segment: product.segment,
    categoryName: product.category.name,
    itemTypeName: product.itemType?.name || null,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    sku: product.sku,
    imageUrl,
    images: images.length ? images : [{ url: imageUrl, alt: product.name, isCover: true }],
    sizes,
    colors,
    stock: Number(product.variants[0]?.stock) || 0,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
  };
}

function normalizeDemo(product: any): StoreProduct {
  return { ...product, images: product.images || [{ url: product.imageUrl, alt: product.name, isCover: true }] };
}

export async function getProducts(segment?: 'WOMEN' | 'MEN' | 'CHILDREN' | 'UNISEX'): Promise<StoreProduct[]> {
  try {
    const products = await (prisma as any).product.findMany({
      where: { isPublished: true, deletedAt: null, category: { isActive: true }, ...(segment ? { segment } : {}) },
      include: { category: true, itemType: true, images: { orderBy: { position: 'asc' } }, variants: { orderBy: { createdAt: 'asc' } } },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
    return products.length ? products.map(serializeProduct) : demoProducts.filter((p) => !segment || p.segment === segment).map(normalizeDemo);
  } catch {
    return demoProducts.filter((p) => !segment || p.segment === segment).map(normalizeDemo);
  }
}

export async function searchProducts(query: string): Promise<StoreProduct[]> {
  const normalized = query.trim();
  if (!normalized) return [];
  try {
    const products = await (prisma as any).product.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        category: { isActive: true },
        OR: [
          { name: { contains: normalized, mode: 'insensitive' } },
          { description: { contains: normalized, mode: 'insensitive' } },
          { sku: { contains: normalized, mode: 'insensitive' } },
          { brand: { contains: normalized, mode: 'insensitive' } },
          { category: { name: { contains: normalized, mode: 'insensitive' } } },
          { itemType: { name: { contains: normalized, mode: 'insensitive' } } },
        ],
      },
      include: { category: true, itemType: true, images: { orderBy: { position: 'asc' } }, variants: { orderBy: { createdAt: 'asc' } } },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 48,
    });
    if (products.length) return products.map(serializeProduct);
  } catch {}

  const needle = normalized.toLowerCase();
  return demoProducts.filter((product) => [product.name, product.description, product.categoryName, product.itemTypeName, product.sku, product.segment].join(' ').toLowerCase().includes(needle)).map(normalizeDemo);
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  try {
    const product = await (prisma as any).product.findFirst({
      where: { slug, deletedAt: null, isPublished: true, category: { isActive: true } },
      include: { category: true, itemType: true, images: { orderBy: { position: 'asc' } }, variants: { orderBy: { createdAt: 'asc' } } },
    });
    if (product) return serializeProduct(product);
    const fallback = demoProducts.find((p) => p.slug === slug);
    return fallback ? normalizeDemo(fallback) : null;
  } catch {
    const found = demoProducts.find((p) => p.slug === slug);
    return found ? normalizeDemo(found) : null;
  }
}
