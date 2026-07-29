import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';
import { InfiniteFashionCarousel } from '@/components/infinite-fashion-carousel';
import { getProducts } from '@/lib/products';
import { getSiteSettings } from '@/lib/site-settings';
import { ShieldCheck, Sparkles, Truck, RefreshCcw, ArrowRight, Star, Crown } from 'lucide-react';

const collectionCards = [
  {
    href: '/women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=90',
    tag: 'Women',
    title: 'Graceful fashion with a luxury edge',
    text: 'Elegant silhouettes, accessories, and confidence-led styling for every moment.',
    overlay: 'from-black/75 via-black/30 to-black/5',
    accent: '#d4075a',
  },
  {
    href: '/men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=90',
    tag: 'Men',
    title: 'Refined essentials for a modern wardrobe',
    text: 'Premium smartwear, versatile staples, and polished fashion for everyday distinction.',
    overlay: 'from-black/80 via-black/35 to-black/5',
    accent: '#1a1118',
  },
  {
    href: '/children',
    image: 'https://images.unsplash.com/photo-1519238359922-989348752efb?auto=format&fit=crop&w=1400&q=90',
    tag: 'Children',
    title: 'Playful charm with elevated comfort',
    text: 'Bright, comfortable looks for kids that balance style and softness perfectly.',
    overlay: 'from-black/70 via-black/25 to-black/5',
    accent: '#c9963a',
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'Premium Selection',
    text: 'Carefully curated styles for women, men, and children — chosen for quality and elegance.',
    color: 'rose',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    text: 'Fast and dependable delivery across Bangladesh — right to your doorstep.',
    color: 'sky',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    text: 'Protected accounts and fully secure order processing for total peace of mind.',
    color: 'emerald',
  },
  {
    icon: RefreshCcw,
    title: 'Professional Support',
    text: 'Responsive assistance and clear communication whenever you need help.',
    color: 'amber',
  },
];

const featureColors: Record<string, { bg: string; icon: string; border: string }> = {
  rose: { bg: 'rgba(212,7,90,0.07)', icon: '#d4075a', border: 'rgba(212,7,90,0.12)' },
  sky: { bg: 'rgba(14,165,233,0.07)', icon: '#0ea5e9', border: 'rgba(14,165,233,0.12)' },
  emerald: { bg: 'rgba(16,185,129,0.07)', icon: '#10b981', border: 'rgba(16,185,129,0.12)' },
  amber: { bg: 'rgba(245,158,11,0.07)', icon: '#f59e0b', border: 'rgba(245,158,11,0.12)' },
};

export default async function HomePage() {
  const [allProducts, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const newArrivals = allProducts.filter(p => p.isNewArrival).slice(0, 4);
  const markedTopSale = allProducts.filter((product) => product.isBestSeller);
  const discountedProducts = allProducts.filter((product) => product.salePrice && product.salePrice < product.basePrice);
  const topSaleProducts = (markedTopSale.length ? markedTopSale : discountedProducts.length ? discountedProducts : allProducts).slice(0, 4);

  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 4);

  return (
    <>
      <Hero settings={settings} />
      <InfiniteFashionCarousel />

      {/* ── New Arrivals ──────────────────────────── */}
      <section className="py-20 md:py-28" id="new-arrivals">
        <div className="container-shell">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-eyebrow">Freshly Selected</p>
              <h2 className="section-title mt-4">
                New <span className="italic text-rose-700">Arrivals</span>
              </h2>
              <p className="mt-4 max-w-xl section-copy">
                Explore the latest trends and standout pieces curated to make a premium first impression.
              </p>
            </div>
            <Link
              href="/women"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_8px_20px_rgba(212,7,90,0.25)]"
            >
              All products <ArrowRight size={15} />
            </Link>
          </div>
          <ProductGrid products={displayNewArrivals} />
        </div>
      </section>

      {/* Divider */}
      <div className="container-shell">
        <div className="divider-rose" />
      </div>

      {/* ── Top Sale ──────────────────────────────── */}
      <section className="py-20 md:py-28 bg-section-alt" id="top-sale">
        <div className="container-shell">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-eyebrow">Most Loved</p>
              <h2 className="section-title mt-4">
                Top <span className="italic text-rose-700">Sale</span>
              </h2>
              <p className="mt-4 max-w-xl section-copy">
                Discover our highlighted sale products and limited-time prices, selected for the best value and style.
              </p>
            </div>
            <Link
              href="/women"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_8px_20px_rgba(212,7,90,0.25)]"
            >
              All products <ArrowRight size={15} />
            </Link>
          </div>

          <ProductGrid products={topSaleProducts} />
        </div>
      </section>

      {/* ── Collections ───────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-shell">
          <div className="mb-12">
            <p className="section-eyebrow">Our Collections</p>
            <h2 className="section-title mt-4 max-w-2xl">
              Choose the world that{' '}
              <span className="italic text-rose-700">fits your style.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {collectionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative min-h-[500px] overflow-hidden rounded-[2rem] shadow-[0_12px_48px_rgba(0,0,0,0.20)] transition-all duration-500 hover:shadow-[0_24px_64px_rgba(0,0,0,0.30)] hover:-translate-y-1.5"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-107"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.overlay} transition-opacity duration-300 group-hover:opacity-90`} />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  {/* Tag */}
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.26em] backdrop-blur-md border border-white/20"
                    style={{ background: `${card.accent}cc` }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="display-font mt-4 text-[2.15rem] font-semibold leading-[1.1]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/75">
                    {card.text}
                  </p>
                  {/* Shop now CTA */}
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/90 transition-all duration-300 group-hover:gap-3 group-hover:text-white">
                    Shop now <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why {settings.siteName} ─────────────────────── */}
      <section className="py-20 md:py-28 bg-section-ivory" id="about">
        <div className="container-shell">
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="section-eyebrow justify-center">Why {settings.siteName}</p>
            <h2 className="section-title mt-4 mx-auto max-w-2xl text-center">
              A more polished way to{' '}
              <span className="italic text-rose-700">shop fashion online.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center section-copy">
              {settings.siteName} is crafted to feel premium — from its visual identity to the customer journey.
              Every detail is designed with intention.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text, color }) => {
              const colors = featureColors[color];
              return (
                <div
                  key={title}
                  className="group rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${colors.icon}18`, color: colors.icon }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-base font-extrabold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-stone-500">{text}</p>
                </div>
              );
            })}
          </div>

          {/* CTA banner */}
          <div
            className="mt-14 relative overflow-hidden rounded-[2rem] p-10 md:p-14 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #1a1118 0%, #2d1a26 40%, #1a1118 100%)' }}
          >
            {/* Orbs */}
            <div className="absolute left-10 top-8 h-40 w-40 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #d4075a, transparent)' }} />
            <div className="absolute right-10 bottom-8 h-40 w-40 rounded-full opacity-15 blur-3xl"
              style={{ background: 'radial-gradient(circle, #c9963a, transparent)' }} />

            <div className="relative">
              <Crown className="mx-auto mb-5 text-rose-400 animate-float" size={36} />
              <h2 className="display-font text-4xl font-semibold text-white md:text-5xl">
                Ready to elevate your style?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-white/60">
                Explore our premium collections and find the perfect look for every occasion.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/women" className="btn-primary">
                  Shop Women's Collection
                </Link>
                <Link
                  href="/men"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Men's Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
