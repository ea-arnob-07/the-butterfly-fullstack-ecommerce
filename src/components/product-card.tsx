import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import { WishlistButton } from './wishlist-button';
import { formatBDT } from '@/lib/money';
import type { StoreProduct } from '@/lib/types';

export function ProductCard({ product }: { product: StoreProduct }) {
  const discount = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : null;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-rose-100/70 bg-white shadow-[0_4px_24px_rgba(212,7,90,0.07)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(212,7,90,0.15)]">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50/50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Hover overlay with View button */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/35 translate-y-3 group-hover:translate-y-0 duration-400"
          >
            <Eye size={15} /> View Product
          </Link>
        </div>

        {/* Top badges row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="rounded-full border border-white/30 bg-white/85 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-rose-700 backdrop-blur-md shadow-sm">
            {product.categoryName}
          </span>
          <div className="flex gap-2">
            <WishlistButton productId={product.id} compact />
            <AddToCartButton product={product} compact />
          </div>
        </div>

        {/* Sale / New badges bottom-left */}
        <div className="absolute bottom-3.5 left-3.5 flex gap-2">
          {product.salePrice && (
            <span className="badge-sale shadow-[0_4px_12px_rgba(146,6,64,0.45)]">
              -{discount}% OFF
            </span>
          )}
          {product.isNewArrival && !product.salePrice && (
            <span className="badge-new">New</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <Link
          href={`/product/${product.slug}`}
          className="display-font block text-[1.45rem] font-semibold leading-tight text-stone-900 transition-colors duration-200 hover:text-rose-700"
        >
          {product.name}
        </Link>

        {/* Price row */}
        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="text-[1.1rem] font-extrabold"
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
            <span className="text-sm text-stone-400 line-through">
              {formatBDT(product.basePrice)}
            </span>
          )}
        </div>

        {/* Short description */}
        {(product.shortDescription || product.description) && (
          <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.7] text-stone-500">
            {product.shortDescription || product.description}
          </p>
        )}

        {/* Bottom accent line */}
        <div className="mt-4 h-[1px] w-full rounded-full bg-gradient-to-r from-rose-100 via-rose-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </article>
  );
}
