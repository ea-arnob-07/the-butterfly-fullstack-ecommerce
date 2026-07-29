import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { finalizeStripeOrder } from '@/lib/stripe-orders';
import { ClearCartOnMount } from '@/components/clear-cart-on-mount';

export const metadata = { title: 'Payment Successful' };

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let orderNumber = '';
  let verified = false;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      const orderId = session.metadata?.orderId;
      orderNumber = session.metadata?.orderNumber || '';
      if (orderId && session.payment_status === 'paid') {
        await finalizeStripeOrder(orderId);
        verified = true;
      }
    } catch {}
  }

  return (
    <section className="container-shell py-20">
      {verified && <ClearCartOnMount />}
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-10 text-center shadow-soft">
        <CheckCircle2 className={`mx-auto ${verified ? 'text-emerald-600' : 'text-amber-500'}`} size={52} />
        <h1 className="display-font mt-5 text-4xl font-semibold">{verified ? 'Payment completed successfully' : 'Payment verification pending'}</h1>
        <p className="mt-4 leading-8 text-stone-600">{verified ? `Your order ${orderNumber || ''} is confirmed and will now be processed.` : 'We could not verify this payment yet. Please check your account order history or contact support.'}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="rounded-full bg-butterfly-600 px-6 py-3 font-bold text-white">View My Orders</Link>
          <Link href="/" className="rounded-full bg-stone-950 px-6 py-3 font-bold text-white">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}
