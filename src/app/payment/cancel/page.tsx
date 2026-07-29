import Link from 'next/link';
import { XCircle } from 'lucide-react';

export const metadata = { title: 'Payment Cancelled' };

export default async function PaymentCancelPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order = '' } = await searchParams;
  return (
    <section className="container-shell py-20">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-10 text-center shadow-soft">
        <XCircle className="mx-auto text-red-500" size={52} />
        <h1 className="display-font mt-5 text-4xl font-semibold">Card payment was cancelled</h1>
        <p className="mt-4 leading-8 text-stone-600">No successful card charge was recorded for {order ? `order ${order}` : 'this order'}. Your cart is still available, so you can try again or choose another payment method.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="rounded-full bg-butterfly-600 px-6 py-3 font-bold text-white">Return to Checkout</Link>
          <Link href="/cart" className="rounded-full bg-stone-950 px-6 py-3 font-bold text-white">View Cart</Link>
        </div>
      </div>
    </section>
  );
}
