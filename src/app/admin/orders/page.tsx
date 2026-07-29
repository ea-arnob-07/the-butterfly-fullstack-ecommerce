import { redirect } from 'next/navigation';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminOrderTable } from '@/components/admin-order-table';
import { AdminNav } from '@/components/admin-nav';

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) redirect('/auth/login?next=/admin/orders');
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 200 });
  } catch {}
  return (
    <section className="container-shell py-14">
      <p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Admin</p>
      <h1 className="section-title mt-2">Customer Orders</h1>
      <p className="mt-3 text-stone-500">View customer details and update the delivery status of every order.</p>
      <div className="mt-8"><AdminNav current="/admin/orders" /></div>
      <div className="mt-8">{orders.length ? <AdminOrderTable orders={orders} /> : <div className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-soft text-stone-500">No customer orders yet.</div>}</div>
    </section>
  );
}
