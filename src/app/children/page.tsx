import Image from 'next/image';
import { ProductGrid } from '@/components/product-grid';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { CategoryPills } from '@/components/category-pills';
import { getSiteSettings } from '@/lib/site-settings';

export const revalidate = 60;
export const metadata = { title: "Children's Collection | The Butterfly" };

export default async function ChildrenPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts('CHILDREN'),
    getCategories('CHILDREN'),
    getSiteSettings(),
  ]);

  return (
    <section className="min-h-screen">
      {/* Premium hero banner */}
      <div className="relative overflow-hidden bg-violet-950" style={{ minHeight: '340px' }}>
        {/* Deep elegant gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900 via-violet-950 to-stone-950" />
        {/* Accent orbs for a modern premium feel */}
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }} />

        <div className="container-shell relative z-10 flex h-full items-center py-16 md:py-20">
          <div>
            <p className="font-bold uppercase tracking-[0.26em] text-amber-300 text-sm">
              {settings.siteName} · Children
            </p>
            <h1 className="display-font mt-3 font-semibold leading-tight text-white"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Children's Collection
            </h1>
            <p className="mt-4 max-w-xl text-base leading-[1.85] text-white/65">
              Discover playful fashion, comfortable occasionwear, and adorable statement looks thoughtfully selected for children.
            </p>
            <div className="mt-6 h-[2px] w-16 rounded-full bg-amber-400 opacity-80" />
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
