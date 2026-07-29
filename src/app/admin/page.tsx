import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Boxes, CircleDollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatBDT } from '@/lib/money';
import { AdminNav } from '@/components/admin-nav';
import { ensureDefaultCatalog } from '@/lib/catalog-defaults';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) redirect('/auth/login?next=/admin');
  let stats = { products: 0, orders: 0, customers: 0, pending: 0, revenue: 0, categories: 0 };
  let recent: any[] = [];
  let catalogCategories: Array<{ id: string; name: string; segment: string }> = [];
  try {
    await ensureDefaultCatalog();
    const [products, orders, customers, pending, revenue, recentOrders, categories, categoryList] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: 'DELIVERED' } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.category.findMany({ where: { isActive: true }, select: { id: true, name: true, segment: true }, orderBy: [{ segment: 'asc' }, { position: 'asc' }, { name: 'asc' }] })
    ]);
    stats = { products, orders, customers, pending, revenue: Number(revenue._sum.total || 0), categories };
    recent = recentOrders;
    catalogCategories = categoryList;
  } catch {}

  const cards = [
    { label: 'Total Revenue', value: formatBDT(stats.revenue), icon: CircleDollarSign },
    { label: 'Products', value: stats.products, icon: Package },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Pending Orders', value: stats.pending, icon: Boxes },
    { label: 'Customers', value: stats.customers, icon: Users },
    { label: 'Categories', value: stats.categories, icon: Boxes }
  ];

  return (
    <section className="container-shell py-14">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Owner Control Center</p>
          <h1 className="section-title mt-2">Admin Dashboard</h1>
          <p className="mt-3 text-stone-500">Signed in as {session.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="rounded-full bg-butterfly-600 px-5 py-3 font-bold text-white">Manage Products</Link>
          <Link href="/admin/orders" className="rounded-full bg-stone-950 px-5 py-3 font-bold text-white">Manage Orders</Link>
          <Link href="/admin/page-management" className="rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-butterfly-700">Page Management</Link>
        </div>
      </div>

      <div className="mt-8"><AdminNav current="/admin" /></div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-500">{label}</p>
                <p className="mt-3 text-3xl font-black text-stone-900">{value}</p>
              </div>
              <div className="rounded-2xl bg-pink-50 p-3 text-butterfly-700"><Icon size={24} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-butterfly-600">Catalog Overview</p>
            <h2 className="display-font mt-2 text-3xl font-semibold text-stone-900">Active Categories</h2>
            <p className="mt-2 text-sm text-stone-500">The default Bangladesh-focused categories are visible here and fully editable from Products, Categories & Types.</p>
          </div>
          <Link href="/admin/products" className="rounded-full bg-pink-50 px-5 py-3 text-sm font-bold text-butterfly-700">Manage catalog</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {['WOMEN', 'MEN', 'CHILDREN'].map((segment) => (
            <div key={segment} className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">{segment}</p>
              <div className="mt-3 space-y-2">
                {catalogCategories.filter((category) => category.segment === segment).map((category) => (
                  <div key={category.id} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm">{category.name}</div>
                ))}
                {catalogCategories.filter((category) => category.segment === segment).length === 0 && <p className="text-sm text-stone-400">No active categories.</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="display-font text-3xl font-semibold text-stone-900">Recent Orders</h2>
              <p className="mt-2 text-sm text-stone-500">Latest customer activity at a glance.</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-bold text-butterfly-700">View all</Link>
          </div>
          {recent.length === 0 ? <p className="mt-6 text-stone-500">No orders yet.</p> : <div className="mt-6 space-y-3">{recent.map((order) => <div key={order.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-pink-100 p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-stone-900">{order.orderNumber}</p><p className="text-sm text-stone-500">{order.customerName}</p></div><div className="sm:text-right"><p className="font-black text-stone-900">{formatBDT(Number(order.total))}</p><p className="text-xs font-bold text-butterfly-700">{String(order.status).replaceAll('_', ' ')}</p></div></div>)}</div>}
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-gradient-to-br from-[#fff6fa] to-white p-6 shadow-soft">
          <h2 className="display-font text-3xl font-semibold text-stone-900">Quick Admin Notes</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600">
            <p>• You can now manage <span className="font-semibold text-stone-900">Women, Men, and Children</span> collections from the admin area.</p>
            <p>• Create a category first, then add products under the correct segment for a cleaner catalog.</p>
            <p>• Use the Orders page to track payments and delivery status updates professionally.</p>
            <p>• Use <span className="font-semibold text-stone-900">Page Management</span> to update the logo, 4K cover, page name, descriptions and social/contact information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
