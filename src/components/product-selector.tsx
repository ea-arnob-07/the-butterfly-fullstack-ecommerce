'use client';

import { useState, useMemo } from 'react';
import { AddToCartButton } from './add-to-cart-button';
import { WishlistButton } from './wishlist-button';
import type { StoreProduct } from '@/lib/types';

export function ProductSelector({ product }: { product: StoreProduct }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

  // ── Variant-aware stock ─────────────────────────────────────────────────────
  const selectedVariantStock = useMemo(() => {
    const details = product.variantDetails;
    if (!details?.length) return product.stock;
    const match = details.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    if (!match) {
      const bySize = details.filter((v) => v.size === selectedSize);
      if (bySize.length) return bySize.reduce((s, v) => s + v.stock, 0);
      return product.stock;
    }
    return match.stock;
  }, [selectedSize, selectedColor, product.variantDetails, product.stock]);

  // Which sizes have at least some stock for the selected color
  const sizeStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const size of product.sizes) {
      if (!product.variantDetails?.length) { map[size] = product.stock; continue; }
      const variants = product.variantDetails.filter(
        (v) => v.size === size && (!selectedColor || v.color === selectedColor)
      );
      map[size] = variants.reduce((s, v) => s + v.stock, 0);
    }
    return map;
  }, [product.sizes, product.variantDetails, product.stock, selectedColor]);

  const colorStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const color of product.colors) {
      if (!product.variantDetails?.length) { map[color] = product.stock; continue; }
      const variants = product.variantDetails.filter(
        (v) => v.color === color && (!selectedSize || v.size === selectedSize)
      );
      map[color] = variants.reduce((s, v) => s + v.stock, 0);
    }
    return map;
  }, [product.colors, product.variantDetails, product.stock, selectedSize]);

  const isOutOfStock = selectedVariantStock <= 0;

  const stockLabel = isOutOfStock
    ? 'Out of stock'
    : selectedVariantStock <= 5
    ? `Only ${selectedVariantStock} left!`
    : `${selectedVariantStock} in stock`;

  const stockColor = isOutOfStock
    ? 'text-red-500'
    : selectedVariantStock <= 5
    ? 'text-amber-500'
    : 'text-emerald-500';

  const stockDot = isOutOfStock
    ? 'bg-red-400'
    : selectedVariantStock <= 5
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  return (
    <>
      {/* ── Stock indicator ──────────────────────────── */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
        <span className={`relative flex h-2.5 w-2.5 shrink-0`}>
          {!isOutOfStock && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${stockDot} opacity-60`} />
          )}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${stockDot}`} />
        </span>
        <span className={`text-sm font-bold ${stockColor}`}>{stockLabel}</span>
        {!isOutOfStock && (
          <span className="ml-auto text-xs text-stone-400">
            {selectedSize && selectedColor ? `${selectedSize} / ${selectedColor}` : ''}
          </span>
        )}
      </div>

      {/* ── Sizes ───────────────────────────────────── */}
      {product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-stone-500">
            Available Sizes
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const sizeStock = sizeStockMap[size] ?? 0;
              const outOfStock = sizeStock <= 0;
              return (
                <button
                  type="button"
                  key={size}
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`relative rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${
                    outOfStock
                      ? 'cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300 line-through'
                      : selectedSize === size
                      ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                      : 'border-rose-200 bg-white text-stone-700 hover:border-rose-500 hover:text-rose-700'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Colors ──────────────────────────────────── */}
      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-stone-500">
            Available Colours
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const colorStock = colorStockMap[color] ?? 0;
              const outOfStock = colorStock <= 0;
              return (
                <button
                  type="button"
                  key={color}
                  disabled={outOfStock}
                  onClick={() => setSelectedColor(color)}
                  className={`relative rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${
                    outOfStock
                      ? 'cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300 line-through'
                      : selectedColor === color
                      ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                      : 'border-rose-200 bg-white text-stone-700 hover:border-rose-500 hover:text-rose-700'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="divider-rose my-7" />

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          outOfStock={isOutOfStock}
        />
        <WishlistButton productId={product.id} />
      </div>
    </>
  );
}
