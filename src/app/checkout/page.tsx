'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Clipboard, CreditCard, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { formatBDT } from '@/lib/money';
import type { CartItem } from '@/lib/types';
import {
  deliveryFeeForZone,
  MOBILE_BANKING_NUMBER,
  MOBILE_BANKING_PROVIDERS,
  type DeliveryZoneValue,
  type MobileBankingProviderValue,
} from '@/lib/commerce-config';
import { PaymentProofUploader } from '@/components/payment-proof-uploader';

const stripeEnabled = process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true';
const inputClass = 'w-full rounded-2xl border border-pink-100 bg-white px-4 py-3.5 outline-none transition focus:border-butterfly-400 focus:ring-4 focus:ring-pink-100';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'MOBILE_BANKING' | 'CARD'>('CASH_ON_DELIVERY');
  const [provider, setProvider] = useState<MobileBankingProviderValue | ''>('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneValue>('INSIDE_DHAKA');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('butterfly_cart') || '[]')); } catch {} }, []);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const deliveryFee = deliveryFeeForZone(deliveryZone);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(MOBILE_BANKING_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(`Copy failed. Please copy this number manually: ${MOBILE_BANKING_NUMBER}`);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (paymentMethod === 'MOBILE_BANKING' && !provider) {
      setError('Select bKash, Nagad, or Rocket before placing the order.');
      return;
    }
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: form.get('customerName'), customerEmail: form.get('customerEmail'), customerPhone: form.get('customerPhone'),
      division: form.get('division'), district: form.get('district'), area: form.get('area'),
      deliveryAddress: form.get('deliveryAddress'), notes: form.get('notes'), paymentMethod, deliveryZone,
      mobileBankingProvider: paymentMethod === 'MOBILE_BANKING' ? provider : null,
      paymentSenderNumber: paymentMethod === 'MOBILE_BANKING' ? form.get('paymentSenderNumber') : null,
      paymentTransactionId: paymentMethod === 'MOBILE_BANKING' ? form.get('paymentTransactionId') : null,
      paymentScreenshotUrl: paymentMethod === 'MOBILE_BANKING' ? paymentScreenshotUrl || null : null,
      items,
    };
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not place order');
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      localStorage.removeItem('butterfly_cart');
      window.dispatchEvent(new Event('butterfly-cart-updated'));
      const query = new URLSearchParams({ order: data.orderNumber });
      if (data.invoiceToken) query.set('token', data.invoiceToken);
      router.push(`/order-confirmation?${query.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally { setLoading(false); }
  }

  return (
    <section className="container-shell py-16">
      <div className="max-w-3xl"><p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Final step</p><h1 className="section-title mt-2">Secure Checkout</h1><p className="mt-3 text-stone-500">Choose your delivery area and preferred payment method. Mobile banking payments are verified manually by the admin.</p></div>
      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            <h2 className="flex items-center gap-3 text-xl font-black"><MapPin className="text-butterfly-600" />Customer & Delivery Information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className={inputClass} name="customerName" placeholder="Full name" required />
              <input className={inputClass} name="customerPhone" placeholder="Phone number" required />
              <input className={inputClass} name="customerEmail" type="email" placeholder="Email address" required />
              <input className={inputClass} name="division" placeholder="Division" required />
              <input className={inputClass} name="district" placeholder="District" required />
              <input className={inputClass} name="area" placeholder="Area / Thana" required />
            </div>
            <textarea className={`${inputClass} mt-4 min-h-28`} name="deliveryAddress" placeholder="Full delivery address" required />
            <textarea className={`${inputClass} mt-4 min-h-24`} name="notes" placeholder="Order notes (optional)" />
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            <h2 className="flex items-center gap-3 text-xl font-black"><Truck className="text-butterfly-600" />Delivery Area</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { value: 'INSIDE_DHAKA' as const, title: 'Inside Dhaka', fee: 60 },
                { value: 'OUTSIDE_DHAKA' as const, title: 'Outside Dhaka', fee: 120 },
              ].map((zone) => (
                <button key={zone.value} type="button" onClick={() => setDeliveryZone(zone.value)} className={`relative rounded-2xl border p-5 text-left transition ${deliveryZone === zone.value ? 'border-butterfly-500 bg-pink-50 ring-4 ring-pink-100' : 'border-stone-200 bg-white hover:border-pink-200'}`}>
                  {deliveryZone === zone.value && <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-butterfly-600 text-white"><Check size={14} /></span>}
                  <p className="font-black text-stone-900">{zone.title}</p><p className="mt-1 text-sm text-stone-500">Delivery charge {formatBDT(zone.fee)}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            <h2 className="flex items-center gap-3 text-xl font-black"><CreditCard className="text-butterfly-600" />Payment Method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setPaymentMethod('CASH_ON_DELIVERY')} className={`rounded-2xl border p-5 text-left transition ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-butterfly-500 bg-pink-50 ring-4 ring-pink-100' : 'border-stone-200'}`}>
                <p className="font-black">Cash on Delivery</p><p className="mt-1 text-sm text-stone-500">Pay when your order is delivered.</p>
              </button>
              <button type="button" onClick={() => setPaymentMethod('MOBILE_BANKING')} className={`rounded-2xl border p-5 text-left transition ${paymentMethod === 'MOBILE_BANKING' ? 'border-butterfly-500 bg-pink-50 ring-4 ring-pink-100' : 'border-stone-200'}`}>
                <p className="font-black">bKash / Nagad / Rocket</p><p className="mt-1 text-sm text-stone-500">Manual payment with transaction verification.</p>
              </button>
              {stripeEnabled && <button type="button" onClick={() => setPaymentMethod('CARD')} className={`rounded-2xl border p-5 text-left transition ${paymentMethod === 'CARD' ? 'border-butterfly-500 bg-pink-50 ring-4 ring-pink-100' : 'border-stone-200'}`}><p className="font-black">Secure Card Payment</p><p className="mt-1 text-sm text-stone-500">Continue to Stripe Checkout.</p></button>}
            </div>

            {paymentMethod === 'MOBILE_BANKING' && (
              <div className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 md:p-6">
                <p className="text-sm font-black text-amber-950">Select your payment provider</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {MOBILE_BANKING_PROVIDERS.map((item) => (
                    <button key={item.value} type="button" onClick={() => setProvider(item.value)} className={`relative overflow-hidden rounded-2xl border bg-white p-2 transition ${provider === item.value ? 'border-amber-600 ring-4 ring-amber-200' : 'border-amber-100 hover:border-amber-300'}`}>
                      {provider === item.value && <span className="absolute right-1.5 top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white"><Check size={12} /></span>}
                      <Image src={item.logo} width={240} height={96} alt={`${item.label} logo`} className="h-auto w-full rounded-xl" />
                    </button>
                  ))}
                </div>

                {provider && (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Send Money number</p>
                      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xl font-black tracking-wide text-stone-950">{MOBILE_BANKING_NUMBER}</p>
                        <button type="button" onClick={copyNumber} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-xs font-bold text-white"><Clipboard size={15} />{copied ? 'Copied!' : 'Copy Number'}</button>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-amber-900">SEND MONEY exactly {formatBDT(subtotal + deliveryFee)} using the selected service. Then enter the sender number and transaction ID below.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input className={inputClass} name="paymentSenderNumber" placeholder="Sender mobile number" required />
                      <input className={inputClass} name="paymentTransactionId" placeholder="Transaction ID" required />
                    </div>
                    <PaymentProofUploader value={paymentScreenshotUrl} onChange={setPaymentScreenshotUrl} />
                    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-100/60 p-4 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-0.5 shrink-0" size={19} /><p>Your order will remain <strong>Payment Verification Pending</strong> until the admin confirms the transaction. Never share your PIN or OTP.</p></div>
                  </div>
                )}
              </div>
            )}
          </section>
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        </div>

        <aside className="h-fit rounded-[2rem] bg-stone-950 p-7 text-white lg:sticky lg:top-28">
          <h2 className="text-xl font-black">Your Order</h2>
          <div className="mt-5 space-y-3 text-sm text-stone-300">{items.map((item) => <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-3"><span>{item.name} × {item.quantity}</span><span>{formatBDT(item.price * item.quantity)}</span></div>)}</div>
          <div className="mt-6 border-t border-stone-700 pt-5 text-sm">
            <div className="flex justify-between text-stone-300"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            <div className="mt-3 flex justify-between text-stone-300"><span>{deliveryZone === 'INSIDE_DHAKA' ? 'Inside Dhaka delivery' : 'Outside Dhaka delivery'}</span><span>{formatBDT(deliveryFee)}</span></div>
            <div className="mt-5 flex justify-between text-xl font-black"><span>Total</span><span>{formatBDT(subtotal + deliveryFee)}</span></div>
          </div>
          <button disabled={loading || items.length === 0} className="mt-7 w-full rounded-full bg-butterfly-600 px-6 py-3.5 font-bold disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Processing...' : paymentMethod === 'CARD' ? 'Continue to Secure Payment' : 'Place Order'}</button>
          <p className="mt-4 text-center text-xs leading-5 text-stone-400">By placing the order, you confirm that the delivery and payment information is correct.</p>
        </aside>
      </form>
    </section>
  );
}
