'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

export function WishlistButton({ productId, compact = false }: { productId: string; compact?: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (mounted && data) setActive(Boolean(data.active)); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [productId]);

  async function toggle() {
    setLoading(true);
    const response = await fetch(`/api/wishlist${active ? `?productId=${encodeURIComponent(productId)}` : ''}`, {
      method: active ? 'DELETE' : 'POST',
      headers: active ? undefined : { 'Content-Type': 'application/json' },
      body: active ? undefined : JSON.stringify({ productId })
    });
    if (response.status === 401) {
      router.push(`/auth/login?next=${encodeURIComponent('/wishlist')}`);
      return;
    }
    if (response.ok) setActive(!active);
    setLoading(false);
  }

  return (
    <button type="button" onClick={toggle} disabled={loading} aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'} className={`${compact ? 'grid h-10 w-10 place-items-center' : 'inline-flex items-center gap-2 px-5 py-3'} rounded-full border border-pink-200 bg-white/95 font-bold text-butterfly-700 shadow-sm transition hover:bg-pink-50 disabled:opacity-60`}>
      <Heart size={compact ? 17 : 19} className={active ? 'fill-current' : ''} />
      {!compact && <span>{active ? 'Saved' : 'Add to Wishlist'}</span>}
    </button>
  );
}
