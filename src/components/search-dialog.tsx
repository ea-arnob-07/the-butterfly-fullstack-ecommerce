'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles } from 'lucide-react';

const suggestions = ['Kameez', 'Panjabi', 'Dress', 'Saree', 'Kids wear', 'Formal shirt'];

export function SearchDialog() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function pickSuggestion(s: string) {
    setOpen(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(s)}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl p-2.5 text-stone-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
        aria-label="Search products"
      >
        <Search size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-20 backdrop-blur-sm animate-fade-in"
          onMouseDown={() => { setOpen(false); setQuery(''); }}
        >
          <div
            className="w-full max-w-2xl animate-scale-in"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search box */}
            <form
              onSubmit={submit}
              className="flex items-center gap-3 rounded-[1.5rem] bg-white p-3 shadow-[0_24px_64px_rgba(0,0,0,0.25),0_8px_24px_rgba(212,7,90,0.12)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Search size={18} />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dresses, panjabis, kids fashion..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15px] text-stone-800 outline-none placeholder:text-stone-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-600 transition"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="btn-primary shrink-0 py-2.5 px-5 text-sm"
              >
                Search
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-3 rounded-[1.25rem] bg-white/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <p className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-stone-400">
                <Sparkles size={11} className="text-rose-400" />
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="rounded-full border border-rose-100 bg-rose-50/60 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_4px_12px_rgba(212,7,90,0.25)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
