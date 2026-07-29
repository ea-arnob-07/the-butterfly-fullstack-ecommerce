'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, LoaderCircle, X } from 'lucide-react';

export function PaymentProofUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
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
      const response = await fetch('/api/uploads/payment-proof', { method: 'POST', body });
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
    <div className="rounded-2xl border border-dashed border-amber-300 bg-white/70 p-4">
      <input ref={inputRef} type="file" accept="image/*" onChange={upload} className="hidden" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {value ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-emerald-200 bg-white">
            <Image src={value} alt="Payment screenshot" fill className="object-cover" />
          </div>
        ) : (
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700"><ImagePlus size={28} /></div>
        )}
        <div className="flex-1">
          <p className="text-sm font-bold text-stone-900">Payment screenshot <span className="font-medium text-stone-500">(optional)</span></p>
          <p className="mt-1 text-xs leading-5 text-stone-500">Upload a clear screenshot to help the admin verify your payment faster. Maximum 4 MB.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
              {loading ? <LoaderCircle size={15} className="animate-spin" /> : value ? <CheckCircle2 size={15} /> : <ImagePlus size={15} />}
              {loading ? 'Uploading...' : value ? 'Replace screenshot' : 'Upload screenshot'}
            </button>
            {value && <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-700"><X size={14} />Remove</button>}
          </div>
          {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
