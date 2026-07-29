'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, FileDown } from 'lucide-react';
import { formatBDT } from '@/lib/money';
import { paymentProviderLabel } from '@/lib/commerce-config';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'];
const paymentStatuses = ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export function AdminOrderTable({ orders }: { orders: any[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function update(id: string, payload: { status?: string; paymentStatus?: string }) {
    setUpdating(id);
    setError('');
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setUpdating(null);
    if (!response.ok) {
      setError(data.error || 'Could not update the order.');
      return;
    }
    window.location.reload();
  }

  return (
    <div className="rounded-[2rem] border border-pink-100 bg-white shadow-soft">
      {error && <div className="m-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#fff2f7] text-stone-800">
            <tr>
              <th className="p-4 font-extrabold">Order</th>
              <th className="p-4 font-extrabold">Customer</th>
              <th className="p-4 font-extrabold">Total</th>
              <th className="p-4 font-extrabold">Payment</th>
              <th className="p-4 font-extrabold">Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-pink-50 align-top">
                <td className="min-w-[250px] p-4">
                  <p className="font-bold text-stone-900">{order.orderNumber}</p>
                  <div className="mt-1 text-xs text-stone-500">{new Date(order.createdAt).toLocaleString('en-BD')}</div>
                  <a href={`/api/orders/invoice?order=${encodeURIComponent(order.orderNumber)}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-butterfly-700"><FileDown size={13} />Download invoice</a>
                  <details className="mt-3 rounded-xl bg-stone-50 p-3">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-bold text-butterfly-700"><ChevronDown size={14} />View full order</summary>
                    <div className="mt-3 space-y-3 text-xs leading-6 text-stone-600">
                      <div><p className="font-bold text-stone-900">Products</p>{order.items.map((item: any) => <p key={item.id}>{item.name} · {item.size} · {item.color} · Qty {item.quantity} · {formatBDT(Number(item.total))}</p>)}</div>
                      <div><p className="font-bold text-stone-900">Delivery address</p><p>{order.deliveryAddress}, {order.area}, {order.district}, {order.division}{order.postalCode ? ` - ${order.postalCode}` : ''}</p><p className="mt-1 font-semibold text-butterfly-700">{String(order.deliveryZone || 'OUTSIDE_DHAKA').replaceAll('_', ' ')} · {formatBDT(Number(order.deliveryFee))}</p></div>
                      {order.notes && <div><p className="font-bold text-stone-900">Customer note</p><p>{order.notes}</p></div>}
                      {order.paymentMethod === 'MOBILE_BANKING' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="font-bold text-amber-950">Manual payment verification</p><p>Provider: {paymentProviderLabel(order.mobileBankingProvider)}</p><p>Sender number: {order.paymentSenderNumber || '-'}</p><p>Transaction ID: <strong>{order.paymentTransactionId || order.paymentReference || '-'}</strong></p>{order.paymentScreenshotUrl && <a href={order.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-bold text-butterfly-700"><ExternalLink size={12} />Open payment screenshot</a>}</div>}
                      {order.paymentMethod !== 'MOBILE_BANKING' && order.paymentReference && <div><p className="font-bold text-stone-900">Payment reference</p><p>{order.paymentReference}</p></div>}
                    </div>
                  </details>
                </td>
                <td className="min-w-[210px] p-4">
                  <p className="font-semibold text-stone-900">{order.customerName}</p>
                  <div className="mt-1 text-xs text-stone-500">{order.customerPhone}</div>
                  <div className="text-xs text-stone-500">{order.customerEmail}</div>
                  <div className="mt-2 text-xs text-stone-500">{order.userId ? 'Registered customer' : 'Guest checkout'}</div>
                </td>
                <td className="min-w-[130px] p-4"><p className="font-bold text-stone-900">{formatBDT(Number(order.total))}</p><p className="mt-1 text-xs text-stone-500">Delivery {formatBDT(Number(order.deliveryFee))}</p></td>
                <td className="min-w-[230px] p-4">
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-butterfly-700">{order.paymentMethod === 'MOBILE_BANKING' ? paymentProviderLabel(order.mobileBankingProvider) : String(order.paymentMethod).replaceAll('_', ' ')}</span>
                  {order.paymentMethod === 'MOBILE_BANKING' && order.paymentTransactionId && <p className="mt-2 text-xs font-semibold text-stone-600">Txn: {order.paymentTransactionId}</p>}
                  <select disabled={updating === order.id} value={order.paymentStatus} onChange={(event) => update(order.id, { paymentStatus: event.target.value })} className="mt-3 block rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-butterfly-400">
                    {paymentStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  {order.paymentMethod === 'MOBILE_BANKING' && order.paymentStatus === 'PENDING' && <p className="mt-2 text-xs font-semibold text-amber-700">Verify transaction before marking PAID.</p>}
                </td>
                <td className="min-w-[210px] p-4">
                  <select disabled={updating === order.id} value={order.status} onChange={(event) => update(order.id, { status: event.target.value })} className="rounded-xl border border-stone-200 bg-white px-3 py-2 font-semibold outline-none focus:border-butterfly-400">
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  {order.stockRestored && <p className="mt-2 text-xs font-semibold text-emerald-700">Stock restored</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
