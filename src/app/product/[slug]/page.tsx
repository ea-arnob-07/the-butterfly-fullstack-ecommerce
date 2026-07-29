import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Package, Shield, Star, Truck } from 'lucide-react';
import { AddToCartButton } from '@/components/add-to-cart-button';
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
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* ── Image gallery ─────────────────────── */}
          <div className="relative pb-8">
            <ProductGallery images={product.images} name={product.name} />

            <div className="absolute bottom-0 left-6 right-6 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)]" style={{ background: 'rgba(15,11,13,0.90)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/40">Stock remaining</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
                    <span className={`text-sm font-bold ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
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

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-stone-500">
                  Available Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm transition hover:border-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-stone-500">
                  Available Colours
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm transition hover:border-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="divider-rose my-7" />

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <AddToCartButton product={product} />
              <WishlistButton productId={product.id} />
            </div>

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
