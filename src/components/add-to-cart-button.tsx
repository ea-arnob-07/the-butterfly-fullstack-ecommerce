'use client';

import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { StoreProduct, CartItem } from '@/lib/types';

export function AddToCartButton({ product, compact = false }: { product: StoreProduct; compact?: boolean }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const size = product.sizes[0] || 'Standard';
    const color = product.colors[0] || 'Default';
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

  return (
    <button onClick={addToCart} className={compact ? 'grid h-11 w-11 place-items-center rounded-full bg-stone-950 text-white hover:bg-butterfly-600' : 'inline-flex items-center justify-center gap-2 rounded-full bg-butterfly-600 px-6 py-3.5 font-bold text-white transition hover:bg-butterfly-700'}>
      <ShoppingBag size={18} /> {compact ? null : added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}
