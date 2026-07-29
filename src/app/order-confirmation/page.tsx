import Link from 'next/link';
import { CheckCircle2, MapPin, PackageCheck, ShieldCheck } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings';
import { prisma } from '@/lib/prisma';
import { verifyOrderAccessToken } from '@/lib/order-access';
import { formatBDT } from '@/lib/money';
import { paymentProviderLabel } from '@/lib/commerce-config';
import { InvoiceActions } from '@/components/invoice-actions';

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string; token?: string }> }) {
  const [{ order: orderNumber, token }, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const order = orderNumber
    ? await (prisma as any).order.findUnique({ where: { orderNumber }, include: { items: true } }).catch(() => null)
    : null;
  const canViewInvoice = Boolean(order && verifyOrderAccessToken(order, token));

  return (
    <section className="container-shell py-16 md:py-24">
      <div className="no-print mx-auto mb-8 max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-soft md:p-12">
        <CheckCircle2 className="mx-auto text-emerald-600" size={64} />
        <p className="mt-6 font-bold uppercase tracking-[0.18em] text-butterfly-600">Order Received</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Thank you for shopping with us</h1>
        <p className="mt-5 leading-7 text-stone-600">Your order has been saved and is now visible to {settings.siteName}’s owner in the admin dashboard. Confirmation emails are sent to the customer and store email when Resend is configured.</p>
        {orderNumber && <div className="mt-7 rounded-2xl bg-pink-50 p-5"><span className="text-sm font-semibold text-stone-500">Order number</span><p className="mt-1 text-2xl font-black text-butterfly-700">{orderNumber}</p></div>}
      </div>

      {canViewInvoice && order ? (
        <div className="invoice-print mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:p-10">
          <div className="flex flex-col justify-between gap-6 border-b border-pink-100 pb-7 sm:flex-row sm:items-start">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-butterfly-600">{settings.siteName}</p><h2 className="display-font mt-1 text-3xl font-semibold">Order Invoice</h2><p className="mt-2 text-sm text-stone-500">{settings.tagline}</p></div>
            <div className="sm:text-right"><p className="font-black text-stone-950">{order.orderNumber}</p><p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleString('en-BD')}</p><span className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{String(order.status).replaceAll('_', ' ')}</span></div>
          </div>

          <div className="grid gap-6 border-b border-pink-100 py-7 md:grid-cols-2">
            <div><p className="flex items-center gap-2 font-black"><PackageCheck size={18} className="text-butterfly-600" />Customer</p><p className="mt-3 font-semibold">{order.customerName}</p><p className="mt-1 text-sm text-stone-500">{order.customerEmail}</p><p className="mt-1 text-sm text-stone-500">{order.customerPhone}</p></div>
            <div><p className="flex items-center gap-2 font-black"><MapPin size={18} className="text-butterfly-600" />Delivery Address</p><p className="mt-3 text-sm leading-6 text-stone-600">{order.deliveryAddress}, {order.area}, {order.district}, {order.division}{order.postalCode ? ` - ${order.postalCode}` : ''}</p><p className="mt-2 text-xs font-bold uppercase tracking-wide text-butterfly-700">{String(order.deliveryZone).replaceAll('_', ' ')}</p></div>
          </div>

          <div className="py-7">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-pink-50"><tr><th className="rounded-l-xl p-3">Product</th><th className="p-3">Variant</th><th className="p-3 text-center">Qty</th><th className="rounded-r-xl p-3 text-right">Amount</th></tr></thead>
                <tbody>{order.items.map((item: any) => <tr key={item.id} className="border-b border-pink-50"><td className="p-3 font-semibold">{item.name}</td><td className="p-3 text-stone-500">{item.size} · {item.color}</td><td className="p-3 text-center">{item.quantity}</td><td className="p-3 text-right font-semibold">{formatBDT(Number(item.total))}</td></tr>)}</tbody>
              </table>
            </div>

            <div className="ml-auto mt-6 max-w-sm space-y-3 rounded-2xl bg-stone-50 p-5 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><strong>{formatBDT(Number(order.subtotal))}</strong></div>
              <div className="flex justify-between"><span className="text-stone-500">Delivery charge</span><strong>{formatBDT(Number(order.deliveryFee))}</strong></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-lg"><span className="font-black">Grand total</span><strong>{formatBDT(Number(order.total))}</strong></div>
            </div>
          </div>

          <div className="grid gap-5 rounded-2xl border border-pink-100 bg-pink-50/50 p-5 md:grid-cols-2">
            <div><p className="font-black">Payment Information</p><p className="mt-2 text-sm text-stone-600">Method: {String(order.paymentMethod).replaceAll('_', ' ')}</p>{order.mobileBankingProvider && <><p className="mt-1 text-sm text-stone-600">Provider: {paymentProviderLabel(order.mobileBankingProvider)}</p><p className="mt-1 text-sm text-stone-600">Sender: {order.paymentSenderNumber}</p><p className="mt-1 text-sm text-stone-600">Transaction ID: {order.paymentTransactionId}</p></>}<p className="mt-2 text-sm font-bold text-butterfly-700">Payment status: {String(order.paymentStatus).replaceAll('_', ' ')}</p></div>
            <div className="flex gap-3 text-sm leading-6 text-stone-600"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={20} /><p>Manual mobile banking payments remain pending until the admin verifies the transaction. Keep this invoice for your records.</p></div>
          </div>

          {order.notes && <div className="mt-5 rounded-2xl bg-stone-50 p-5"><p className="font-black">Customer note</p><p className="mt-2 text-sm leading-6 text-stone-600">{order.notes}</p></div>}
          <div className="mt-8"><InvoiceActions orderNumber={order.orderNumber} token={token} /></div>
        </div>
      ) : orderNumber ? (
        <div className="no-print mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-semibold text-amber-900">The order was created, but this browser does not have permission to display the private invoice details. Check the confirmation email or sign in to the customer account.</div>
      ) : null}

      <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-butterfly-600 px-6 py-3 font-bold text-white">Continue Shopping</Link>
        <Link href="/account" className="rounded-full bg-stone-950 px-6 py-3 font-bold text-white">View My Account</Link>
      </div>
    </section>
  );
}
