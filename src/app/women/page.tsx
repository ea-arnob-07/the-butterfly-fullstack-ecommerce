import { ProductGrid } from '@/components/product-grid';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { CategoryPills } from '@/components/category-pills';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata = { title: "Women's Collection" };

export default async function WomenPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const categorySlug = (await searchParams).category;
  const [allProducts, categories, settings] = await Promise.all([getProducts('WOMEN'), getCategories('WOMEN'), getSiteSettings()]);
  const products = categorySlug ? allProducts.filter((p) => p.categorySlug === categorySlug) : allProducts;
  return (
    <section className="container-shell py-16">
      <div className="mb-10 rounded-[2.2rem] border border-pink-100 bg-gradient-to-r from-[#fff3f8] via-white to-[#fff8fb] p-8 shadow-soft md:p-12">
        <p className="font-bold uppercase tracking-[0.2em] text-butterfly-600">{settings.siteName} Women</p>
        <h1 className="section-title mt-3">Women’s Collection</h1>
        <p className="mt-4 max-w-2xl section-copy">Explore dresses, festive edits, jewellery, handbags, shoes, and accessories selected to express everyday elegance.</p>
      </div>
      <CategoryPills categories={categories} />
      <ProductGrid products={products} />
    </section>
  );
}
