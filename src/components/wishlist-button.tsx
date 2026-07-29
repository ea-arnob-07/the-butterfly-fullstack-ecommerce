'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

// ── Module-level wishlist cache (shared across all WishlistButton instances) ──
// Avoids N individual API calls by batching product IDs per render cycle.
let pendingIds: Set<string> = new Set();
let cachedActive: Map<string, boolean> = new Map();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let resolvers: Map<string, Array<(active: boolean) => void>> = new Map();
let isLoggedOut = false; // skip all fetches if user is not logged in

function queueBatchFetch(productId: string): Promise<boolean> {
  // If we already know user is logged out, skip immediately
  if (isLoggedOut) return Promise.resolve(false);
  // If already in cache return immediately
  if (cachedActive.has(productId)) return Promise.resolve(cachedActive.get(productId)!);

  return new Promise((resolve) => {
    pendingIds.add(productId);
    if (!resolvers.has(productId)) resolvers.set(productId, []);
    resolvers.get(productId)!.push(resolve);

    // Debounce: collect all IDs for 20ms then fire one batch request
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(async () => {
      const ids = [...pendingIds];
      pendingIds = new Set();
      batchTimer = null;

      try {
        const res = await fetch(`/api/wishlist?productIds=${encodeURIComponent(ids.join(','))}`);
        if (res.status === 401) {
          isLoggedOut = true;
          ids.forEach((id) => resolvers.get(id)?.forEach((fn) => fn(false)));
        } else if (res.ok) {
          const data: { active: Record<string, boolean> } = await res.json();
          for (const id of ids) {
            const active = Boolean(data.active?.[id]);
            cachedActive.set(id, active);
            resolvers.get(id)?.forEach((fn) => fn(active));
          }
        }
      } catch {
        ids.forEach((id) => resolvers.get(id)?.forEach((fn) => fn(false)));
      }

      // Cleanup resolvers
      for (const id of ids) resolvers.delete(id);
    }, 20);
  });
}

export function WishlistButton({ productId, compact = false }: { productId: string; compact?: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    queueBatchFetch(productId).then((result) => {
      if (mounted) {
        setActive(result);
        setChecked(true);
      }
    });
    return () => { mounted = false; };
  }, [productId]);

  const toggle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        active ? `/api/wishlist?productId=${encodeURIComponent(productId)}` : '/api/wishlist',
        {
          method: active ? 'DELETE' : 'POST',
          headers: active ? undefined : { 'Content-Type': 'application/json' },
          body: active ? undefined : JSON.stringify({ productId }),
        }
      );
      if (res.status === 401) {
        router.push(`/auth/login?next=${encodeURIComponent('/wishlist')}`);
        return;
      }
      if (res.ok) {
        const newState = !active;
        setActive(newState);
        cachedActive.set(productId, newState); // update cache immediately
      }
    } finally {
      setLoading(false);
    }
  }, [active, productId, router]);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${
        compact ? 'grid h-10 w-10 place-items-center' : 'inline-flex items-center gap-2 px-5 py-3'
      } rounded-full border border-pink-200 bg-white/95 font-bold text-butterfly-700 shadow-sm transition hover:bg-pink-50 disabled:opacity-60 ${
        !checked ? 'opacity-70' : ''
      }`}
    >
      <Heart
        size={compact ? 17 : 19}
        className={`transition-all duration-200 ${active ? 'fill-current text-rose-600 scale-110' : ''}`}
      />
      {!compact && <span>{active ? 'Saved' : 'Add to Wishlist'}</span>}
    </button>
  );
}
