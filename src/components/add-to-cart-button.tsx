'use client';

import { ShoppingBag, CheckCircle2, Ban } from 'lucide-react';
import { useState } from 'react';
import type { StoreProduct, CartItem } from '@/lib/types';

export function AddToCartButton({
  product,
  compact = false,
  selectedSize,
  selectedColor,
  outOfStock = false,
}: {
  product: StoreProduct;
  compact?: boolean;
  selectedSize?: string;
  selectedColor?: string;
  outOfStock?: boolean;
}) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (outOfStock) return;
    const size = selectedSize || product.sizes[0] || 'Standard';
    const color = selectedColor || product.colors[0] || 'Default';
    const price = product.salePrice || product.basePrice;
    const cart: CartItem[] = JSON.parse(localStorage.getItem('butterfly_cart') || '[]');
    const index = cart.findIndex((item) => item.productId === product.id && item.size === size && item.color === color);
    if (index >= 0) cart[index].quantity += 1;
    else cart.push({ productId: product.id, slug: product.slug, name: product.name, imageUrl: product.imageUrl, price, quantity: 1, size, color });
    localStorage.setItem('butterfly_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('butterfly-cart-updated'));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  if (compact) {
    return (
      <button
        onClick={addToCart}
        disabled={outOfStock}
        title={outOfStock ? 'Out of stock' : 'Add to cart'}
        className={`grid h-11 w-11 place-items-center rounded-full transition ${
          outOfStock
            ? 'cursor-not-allowed bg-stone-200 text-stone-400'
            : 'bg-stone-950 text-white hover:bg-butterfly-600'
        }`}
      >
        {outOfStock ? <Ban size={16} /> : <ShoppingBag size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={addToCart}
      disabled={outOfStock}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 ${
        outOfStock
          ? 'cursor-not-allowed bg-stone-300 text-stone-500'
          : added
          ? 'bg-emerald-600 shadow-[0_8px_24px_rgba(16,185,129,0.35)] scale-[0.98]'
          : 'bg-butterfly-600 shadow-[0_8px_24px_rgba(212,7,90,0.30)] hover:bg-butterfly-700 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,7,90,0.40)]'
      }`}
    >
      {outOfStock ? (
        <><Ban size={18} /> Out of Stock</>
      ) : added ? (
        <><CheckCircle2 size={18} /> Added to Cart</>
      ) : (
        <><ShoppingBag size={18} /> Add to Cart</>
      )}
    </button>
  );
}
