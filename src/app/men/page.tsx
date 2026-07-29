import { ProductGrid } from '@/components/product-grid';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { CategoryPills } from '@/components/category-pills';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata = { title: "Men's Collection" };

export default async function MenPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const categorySlug = (await searchParams).category;
  const [allProducts, categories, settings] = await Promise.all([getProducts('MEN'), getCategories('MEN'), getSiteSettings()]);
  const products = categorySlug ? allProducts.filter((p) => p.categorySlug === categorySlug) : allProducts;
  return (
    <section className="container-shell py-16">
      <div className="mb-10 rounded-[2.2rem] border border-pink-100 bg-gradient-to-r from-[#fff3f8] via-white to-[#fff8fb] p-8 shadow-soft md:p-12">
        <p className="font-bold uppercase tracking-[0.2em] text-butterfly-600">{settings.siteName} Men</p>
        <h1 className="section-title mt-3">Men’s Collection</h1>
        <p className="mt-4 max-w-2xl section-copy">Discover smart shirts, panjabis, accessories, and elevated essentials built for modern style and confidence.</p>
      </div>
      <CategoryPills categories={categories} />
      <ProductGrid products={products} />
    </section>
  );
}
