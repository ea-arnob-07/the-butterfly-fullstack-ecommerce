'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, LoaderCircle, Star, Trash2 } from 'lucide-react';

export type ManagedImage = { url: string; isCover: boolean };

export function MultiImageUploader({ value, onChange }: { value: ManagedImage[]; onChange: (images: ManagedImage[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setLoading(true);
    setError('');
    try {
      const uploaded = await Promise.all(files.map(async (file): Promise<ManagedImage> => {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/uploads', { method: 'POST', body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Could not upload ${file.name}.`);
        return { url: data.url, isCover: false };
      }));
      const next = [...value, ...uploaded];
      if (next.length && !next.some((image) => image.isCover)) next[0] = { ...next[0], isCover: true };
      onChange(next);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function makeCover(index: number) {
    onChange(value.map((image, i) => ({ ...image, isCover: i === index })));
  }

  function remove(index: number) {
    const next = value.filter((_, i) => i !== index);
    if (next.length && !next.some((image) => image.isCover)) next[0] = { ...next[0], isCover: true };
    onChange(next);
  }

  return (
    <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-4">
      <input ref={inputRef} type="file" multiple accept="image/*" onChange={upload} className="hidden" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-stone-800">Product image gallery</p>
          <p className="mt-1 text-xs text-stone-500">Upload multiple colour/view photos, then choose one cover image.</p>
        </div>
        <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {loading ? 'Uploading...' : 'Add images'}
        </button>
      </div>

      {value.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((image, index) => (
            <div key={`${image.url}-${index}`} className={`relative overflow-hidden rounded-2xl border bg-white p-2 ${image.isCover ? 'border-butterfly-500 ring-2 ring-pink-100' : 'border-stone-200'}`}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-pink-50"><Image src={image.url} alt={`Product image ${index + 1}`} fill className="object-cover" /></div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <button type="button" onClick={() => makeCover(index)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${image.isCover ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-butterfly-700'}`}>
                  {image.isCover ? <CheckCircle2 size={12} /> : <Star size={12} />}{image.isCover ? 'Cover' : 'Set cover'}
                </button>
                <button type="button" onClick={() => remove(index)} className="rounded-full bg-red-50 p-1.5 text-red-600" aria-label="Remove image"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 grid min-h-32 w-full place-items-center rounded-2xl border border-dashed border-pink-200 bg-white text-butterfly-500"><span className="flex items-center gap-2 text-sm font-bold"><ImagePlus size={20} />Upload one or more images</span></button>
      )}
      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
