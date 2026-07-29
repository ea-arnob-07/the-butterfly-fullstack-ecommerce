'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function CategoryPills({ categories }: { categories: Array<{ id: string; name: string; slug?: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCategory = searchParams.get('category');

  if (!categories.length) return null;
  return (
    <div className="mb-10 flex flex-wrap gap-2.5">
      <button 
        onClick={() => router.push(pathname)} 
        className={`rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${!activeCategory ? 'border-butterfly-500 bg-butterfly-50 text-butterfly-700 ring-2 ring-butterfly-200' : 'border-pink-100 bg-white text-stone-700 hover:border-pink-300'}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button 
          key={category.id} 
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            if (category.slug) params.set('category', category.slug);
            else params.set('category', category.id);
            router.push(pathname + '?' + params.toString());
          }} 
          className={`rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${activeCategory === (category.slug || category.id) ? 'border-butterfly-500 bg-butterfly-50 text-butterfly-700 ring-2 ring-butterfly-200' : 'border-pink-100 bg-white text-stone-700 hover:border-pink-300'}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
