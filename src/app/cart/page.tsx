'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatBDT } from '@/lib/money';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('butterfly_cart') || '[]')); } catch { setItems([]); }
  }, []);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem('butterfly_cart', JSON.stringify(next));
    window.dispatchEvent(new Event('butterfly-cart-updated'));
  }

  function changeQuantity(index: number, amount: number) {
    const next = [...items];
    next[index].quantity = Math.max(1, next[index].quantity + amount);
    save(next);
  }

  function remove(index: number) {
    save(items.filter((_, itemIndex) => itemIndex !== index));
  }

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <section className="container-shell py-16">
      <h1 className="section-title">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-white p-12 text-center shadow-soft">
          <h2 className="text-2xl font-black">Your cart is empty</h2>
          <p className="mt-3 text-stone-500">Add something beautiful from our women’s or men’s collection.</p>
          <Link href="/women" className="mt-7 inline-flex rounded-full bg-butterfly-600 px-6 py-3 font-bold text-white">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="grid grid-cols-[90px_1fr] gap-4 rounded-3xl bg-white p-4 shadow-soft sm:grid-cols-[110px_1fr_auto] sm:items-center">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-pink-50"><Image src={item.imageUrl} alt={item.name} fill className="object-cover" /></div>
                <div>
                  <Link href={`/product/${item.slug}`} className="font-extrabold text-stone-900 hover:text-butterfly-600">{item.name}</Link>
                  <p className="mt-1 text-sm text-stone-500">{item.size} · {item.color}</p>
                  <p className="mt-2 font-black text-butterfly-700">{formatBDT(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2 sm:hidden">
                    <button onClick={() => changeQuantity(index, -1)} className="rounded-full border p-2"><Minus size={15} /></button>
                    <span className="min-w-6 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => changeQuantity(index, 1)} className="rounded-full border p-2"><Plus size={15} /></button>
                    <button onClick={() => remove(index)} className="ml-2 rounded-full p-2 text-red-600"><Trash2 size={17} /></button>
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <button onClick={() => changeQuantity(index, -1)} className="rounded-full border p-2"><Minus size={15} /></button>
                  <span className="min-w-6 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => changeQuantity(index, 1)} className="rounded-full border p-2"><Plus size={15} /></button>
                  <button onClick={() => remove(index)} className="ml-2 rounded-full p-2 text-red-600"><Trash2 size={17} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-stone-950 p-7 text-white">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-6 flex justify-between text-stone-300"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            <div className="mt-3 flex justify-between text-stone-300"><span>Delivery</span><span>Calculated at checkout</span></div>
            <div className="mt-6 border-t border-stone-700 pt-5 text-xl font-black"><div className="flex justify-between"><span>Total</span><span>{formatBDT(subtotal)}</span></div></div>
            <Link href="/checkout" className="mt-7 block rounded-full bg-butterfly-600 px-6 py-3.5 text-center font-bold text-white hover:bg-butterfly-500">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
