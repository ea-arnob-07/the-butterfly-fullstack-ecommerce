import Image from 'next/image';
import { ProductGrid } from '@/components/product-grid';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { CategoryPills } from '@/components/category-pills';
import { getSiteSettings } from '@/lib/site-settings';

export const revalidate = 60;
export const metadata = { title: "Men's Collection | The Butterfly" };

export default async function MenPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts('MEN'),
    getCategories('MEN'),
    getSiteSettings(),
  ]);

  return (
    <section className="min-h-screen">
      {/* Premium hero banner */}
      <div className="relative overflow-hidden bg-stone-950" style={{ minHeight: '340px' }}>
        {/* Deep elegant gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-stone-950" />
        {/* Accent orbs for a modern premium feel */}
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d4075a, transparent)' }} />
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />

        <div className="container-shell relative z-10 flex h-full items-center py-16 md:py-20">
          <div>
            <p className="font-bold uppercase tracking-[0.26em] text-rose-400 text-sm">
              {settings.siteName} · Men
            </p>
            <h1 className="display-font mt-3 font-semibold leading-tight text-white"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Men's Collection
            </h1>
            <p className="mt-4 max-w-xl text-base leading-[1.85] text-white/65">
              Discover smart shirts, panjabis, accessories, and elevated essentials built for modern style and confidence.
            </p>
            <div className="mt-6 h-[2px] w-16 rounded-full bg-rose-500 opacity-80" />
          </div>
        </div>
      </div>

      <div className="container-shell py-10">
        <CategoryPills categories={categories} />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
