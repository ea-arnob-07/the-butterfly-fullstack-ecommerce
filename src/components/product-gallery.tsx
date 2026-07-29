'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { StoreProductImage } from '@/lib/types';

export function ProductGallery({ images, name }: { images: StoreProductImage[]; name: string }) {
  const safeImages = images.length ? images : [{ url: '/images/butterfly-logo-transparent.png', alt: name, isCover: true }];
  const [active, setActive] = useState(0);
  const current = safeImages[active] || safeImages[0];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
      {/* Thumbnails — left column on desktop, below on mobile */}
      {safeImages.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
          {safeImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-xl border-2 bg-pink-50 transition-all duration-200 sm:h-[90px] sm:w-[90px] ${
                active === index
                  ? 'border-rose-500 shadow-[0_4px_12px_rgba(212,7,90,0.25)] scale-[1.03]'
                  : 'border-transparent opacity-65 hover:opacity-100 hover:border-rose-200'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="90px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="order-1 relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-50 to-white shadow-[0_24px_64px_rgba(212,7,90,0.15)] sm:order-2" style={{ aspectRatio: '4/5', minHeight: '420px' }}>
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || name}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
        />
      </div>
    </div>
  );
}
