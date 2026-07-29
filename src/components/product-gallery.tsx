'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { StoreProductImage } from '@/lib/types';

export function ProductGallery({ images, name }: { images: StoreProductImage[]; name: string }) {
  const safeImages = images.length ? images : [{ url: '/images/butterfly-logo-transparent.png', alt: name, isCover: true }];
  const [active, setActive] = useState(0);
  const current = safeImages[active] || safeImages[0];

  return (
    <div className={safeImages.length > 1 ? 'grid gap-3 sm:grid-cols-[88px_1fr]' : 'grid grid-cols-1'}>
      {safeImages.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
          {safeImages.map((image, index) => (
            <button key={`${image.url}-${index}`} type="button" onClick={() => setActive(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-pink-50 transition ${active === index ? 'border-butterfly-500 shadow-soft' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <Image src={image.url} alt={image.alt || `${name} ${index + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="order-1 relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-50 to-white shadow-[0_24px_64px_rgba(212,7,90,0.15)] sm:order-2">
        <Image src={current.url} alt={current.alt || name} fill priority className="object-cover transition-opacity duration-200" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </div>
  );
}
