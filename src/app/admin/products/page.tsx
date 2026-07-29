import { redirect } from 'next/navigation';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureDefaultCatalog } from '@/lib/catalog-defaults';
import { AdminProductForm } from '@/components/admin-product-form';
import { AdminCategoryForm } from '@/components/admin-category-form';
import { AdminItemTypeForm } from '@/components/admin-item-type-form';
import { AdminProductList } from '@/components/admin-product-list';
import { AdminNav } from '@/components/admin-nav';

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) redirect('/auth/login?next=/admin/products');

  let categories: Array<{ id: string; name: string; segment: string; slug: string; position: number; isActive: boolean }> = [];
  let itemTypes: Array<{ id: string; name: string; slug: string; position: number; isActive: boolean }> = [];
  let rawProducts: any[] = [];

  try {
    await ensureDefaultCatalog();
    [categories, itemTypes, rawProducts] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true, segment: true, slug: true, position: true, isActive: true }, orderBy: [{ segment: 'asc' }, { position: 'asc' }, { name: 'asc' }] }),
      (prisma as any).itemType.findMany({ select: { id: true, name: true, slug: true, position: true, isActive: true }, orderBy: [{ position: 'asc' }, { name: 'asc' }] }),
      (prisma as any).product.findMany({ include: { category: true, itemType: true, variants: { orderBy: { createdAt: 'asc' } }, images: { orderBy: { position: 'asc' } } }, orderBy: [{ deletedAt: 'asc' }, { createdAt: 'desc' }] }),
    ]);
  } catch (error) {
    console.error('Admin catalog load failed:', error);
  }

  const products = rawProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    segment: product.segment,
    categoryId: product.categoryId,
    category: { name: product.category.name },
    itemTypeId: product.itemTypeId || '',
    itemType: product.itemType ? { name: product.itemType.name } : null,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    sku: product.sku,
    isPublished: product.isPublished,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    deletedAt: product.deletedAt ? product.deletedAt.toISOString() : null,
    images: product.images.length ? product.images.map((image: any) => ({ url: image.url, isCover: image.isCover })) : [{ url: '/images/butterfly-logo-transparent.png', isCover: true }],
    stock: product.variants[0]?.stock || 0,
    sizes: [...new Set(product.variants.map((variant: any) => variant.size))] as string[],
    colors: [...new Set(product.variants.map((variant: any) => variant.color))] as string[],
  }));

  const counts = ['WOMEN', 'MEN', 'CHILDREN'].map((segment) => ({ segment, count: categories.filter((item) => item.segment === segment && item.isActive).length }));

  return (
    <section className="container-shell py-14">
      <p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Admin</p>
      <h1 className="section-title mt-2">Product, Category & Item Type Management</h1>
      <p className="mt-3 max-w-4xl text-stone-500">Manage Bangladesh-focused categories, flexible item types, products, multiple images and Top Sale placement from one page.</p>
      <div className="mt-8"><AdminNav current="/admin/products" /></div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {counts.map((item) => <div key={item.segment} className="rounded-2xl border border-pink-100 bg-white p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{item.segment}</p><p className="mt-2 text-3xl font-black text-stone-900">{item.count}</p><p className="text-sm text-stone-500">active categories</p></div>)}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">ITEM TYPES</p><p className="mt-2 text-3xl font-black text-stone-900">{itemTypes.filter((item) => item.isActive).length}</p><p className="text-sm text-stone-500">active types</p></div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <AdminCategoryForm initialCategories={categories} />
          <AdminItemTypeForm initialItemTypes={itemTypes} />
          <AdminProductForm categories={categories} itemTypes={itemTypes} />
        </div>
        <div><AdminProductList products={products} categories={categories} itemTypes={itemTypes} /></div>
      </div>
    </section>
  );
}
