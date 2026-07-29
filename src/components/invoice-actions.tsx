'use client';

import { Download, Printer } from 'lucide-react';

export function InvoiceActions({ orderNumber, token }: { orderNumber: string; token?: string | null }) {
  const params = new URLSearchParams({ order: orderNumber });
  if (token) params.set('token', token);
  return (
    <div className="no-print flex flex-wrap justify-center gap-3">
      <a href={`/api/orders/invoice?${params.toString()}`} className="inline-flex items-center gap-2 rounded-full bg-butterfly-600 px-6 py-3 font-bold text-white"><Download size={17} />Download Invoice PDF</a>
      <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-bold text-white"><Printer size={17} />Print Invoice</button>
    </div>
  );
}
