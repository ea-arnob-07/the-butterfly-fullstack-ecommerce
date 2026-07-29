'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';

export function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    const body = new FormData();
    body.append('file', file);
    try {
      const response = await fetch('/api/uploads', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed.');
      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-4">
      <input ref={inputRef} type="file" accept="image/*" onChange={upload} className="hidden" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {value ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white">
            <Image src={value} alt="Uploaded product" fill className="object-cover" />
          </div>
        ) : (
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white text-butterfly-500"><ImagePlus size={28} /></div>
        )}
        <div>
          <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {loading ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}
          </button>
          <p className="mt-2 text-xs leading-5 text-stone-500">JPG, PNG, or WebP. Maximum 10 MB. Cloudinary credentials are required.</p>
          {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
