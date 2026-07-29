import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Package, Shield, Truck } from 'lucide-react';
import { ProductSelector } from '@/components/product-selector';
import { WishlistButton } from '@/components/wishlist-button';
import { getProductBySlug } from '@/lib/products';
import { formatBDT } from '@/lib/money';
import { ProductGallery } from '@/components/product-gallery';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const foundProduct = await getProductBySlug(slug);
  if (!foundProduct) return notFound();
  const product = foundProduct;

  const discount = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : null;

  const promises = [
    { icon: Truck,   label: 'Nationwide delivery', desc: 'Fast shipping across Bangladesh' },
    { icon: Shield,  label: 'Secure checkout',      desc: 'Safe & protected payment' },
    { icon: Package, label: 'Careful packaging',    desc: 'Your order handled with care' },
  ];

  return (
    <div className="min-h-screen py-8 md:py-14">
      {/* Breadcrumb */}
      <div className="container-shell mb-8">
        <nav className="flex items-center gap-1.5 text-[13px] text-stone-400">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href={`/${product.segment?.toLowerCase() || 'women'}`} className="hover:text-rose-600 transition-colors capitalize">
            {product.segment || 'Products'}
          </Link>
          <ChevronRight size={14} />
          <span className="text-stone-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">

          {/* ── Image gallery ─────────────────────── */}
          <div>
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* ── Info panel ────────────────────────── */}
          <div className="lg:py-4 pb-8">
            {/* Category */}
            <p className="section-eyebrow">{product.categoryName}</p>

            {/* Name */}
            <h1
              className="display-font mt-4 font-semibold leading-tight tracking-[-0.03em] text-stone-950"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span
                className="text-4xl font-extrabold leading-none"
                style={{
                  background: 'linear-gradient(135deg, #b2054c, #d4075a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatBDT(product.salePrice || product.basePrice)}
              </span>
              {product.salePrice && (
                <>
                  <span className="mb-1 text-xl text-stone-400 line-through">
                    {formatBDT(product.basePrice)}
                  </span>
                  <span className="mb-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-extrabold text-rose-700">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="divider-rose my-6" />

            {/* Description */}
            <p className="text-base leading-[1.9] text-stone-600">{product.description}</p>

            {/* Selector & CTA — includes stock indicator */}
            <ProductSelector product={product} />

            {/* Promises */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {promises.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border border-rose-100/60 bg-rose-50/40 p-3.5"
                >
                  <Icon size={16} className="mt-0.5 shrink-0 text-rose-500" />
                  <div>
                    <p className="text-[12px] font-extrabold text-stone-800">{label}</p>
                    <p className="text-[11px] leading-relaxed text-stone-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta info */}
            <div className="mt-5 rounded-2xl border border-rose-100/60 bg-white p-4 shadow-[0_4px_16px_rgba(212,7,90,0.05)]">
              <div className="grid grid-cols-2 divide-x divide-rose-100">
                <div className="pr-4">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-stone-400">SKU</span>
                  <p className="mt-1 text-sm font-semibold text-stone-700">{product.sku}</p>
                </div>
                <div className="pl-4">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-stone-400">Category</span>
                  <p className="mt-1 text-sm font-semibold capitalize text-stone-700">{product.segment}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
