import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatBDT } from '@/lib/money';
import { LogoutButton } from '@/components/logout-button';
import Link from 'next/link';
import { FileDown } from 'lucide-react';
import { paymentProviderLabel } from '@/lib/commerce-config';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const session = await getSession();
  if (!session) return redirect('/auth/login?next=/account');
  const { order } = await searchParams;
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({ where: { userId: session.userId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
  } catch {}

  return (
    <section className="container-shell py-16">
      {order && <div className="mb-8 rounded-2xl bg-emerald-50 p-5 font-semibold text-emerald-800">Order <strong>{order}</strong> was placed successfully.</div>}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Customer Dashboard</p><h1 className="section-title mt-2">Hello, {session.name}</h1><p className="mt-3 text-stone-500">{session.email}</p></div>
        <div className="flex flex-wrap gap-3"><Link href="/wishlist" className="rounded-full bg-pink-50 px-5 py-3 font-bold text-butterfly-700">My Wishlist</Link><LogoutButton /></div>
      </div>
      <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-black">Order History</h2>
        {orders.length === 0 ? <p className="mt-5 text-stone-500">No orders yet. Your completed orders will appear here.</p> : (
          <div className="mt-6 space-y-4">{orders.map((item) => <div key={item.id} className="rounded-2xl border border-pink-100 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="font-black">{item.orderNumber}</p><p className="mt-1 text-sm text-stone-500">{new Date(item.createdAt).toLocaleDateString('en-BD')} · {item.items.length} item(s)</p><a href={`/api/orders/invoice?order=${encodeURIComponent(item.orderNumber)}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-butterfly-700"><FileDown size={16} />Download invoice PDF</a></div><div className="sm:text-right"><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-butterfly-700">{String(item.status).replaceAll('_', ' ')}</span><p className="mt-2 font-black">{formatBDT(Number(item.total))}</p><p className="mt-1 text-xs font-semibold text-stone-500">Payment: {String(item.paymentStatus).replaceAll('_', ' ')}</p></div></div><details className="mt-4 rounded-2xl bg-stone-50 p-4"><summary className="cursor-pointer text-sm font-bold text-butterfly-700">View order details</summary><div className="mt-4 space-y-2 text-sm leading-7 text-stone-600">{item.items.map((product: any) => <p key={product.id}>{product.name} · {product.size} · {product.color} · Qty {product.quantity} · {formatBDT(Number(product.total))}</p>)}<p className="pt-2 font-semibold text-stone-800">Delivery: {item.deliveryAddress}, {item.area}, {item.district}, {item.division}</p><p className="font-semibold text-stone-800">Delivery charge: {formatBDT(Number(item.deliveryFee))} · {String(item.deliveryZone || 'OUTSIDE_DHAKA').replaceAll('_', ' ')}</p>{item.paymentMethod === 'MOBILE_BANKING' && <p className="font-semibold text-stone-800">Payment: {paymentProviderLabel(item.mobileBankingProvider)} · Transaction {item.paymentTransactionId || item.paymentReference}</p>}</div></details></div>)}</div>
        )}
      </div>
    </section>
  );
}
