import { ProductGrid } from '@/components/product-grid';
import { searchProducts } from '@/lib/products';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata = { title: 'Search Products' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q = '' }, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const products = await searchProducts(q);
  return (
    <section className="container-shell py-16">
      <p className="font-bold uppercase tracking-[0.2em] text-butterfly-600">Product Search</p>
      <h1 className="section-title mt-3">{q ? `Results for “${q}”` : `Search ${settings.siteName}`}</h1>
      <p className="mt-4 text-stone-500">{q ? `${products.length} matching product${products.length === 1 ? '' : 's'} found.` : 'Enter a keyword using the search icon in the header.'}</p>
      <div className="mt-10">
        {products.length ? <ProductGrid products={products} /> : (
          <div className="rounded-[2rem] border border-pink-100 bg-white p-10 text-center shadow-soft">
            <h2 className="display-font text-3xl font-semibold">No matching products yet</h2>
            <p className="mt-3 text-stone-500">Try a different product name, category, segment, or SKU.</p>
          </div>
        )}
      </div>
    </section>
  );
}
