import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, PanelsTopLeft } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products, Categories & Types', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/page-management', label: 'Page Management', icon: PanelsTopLeft },
];

export function AdminNav({ current }: { current: string }) {
  return (
    <div className="rounded-[2rem] border border-pink-100 bg-white/90 p-3 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
        {links.map((link) => {
          const Icon = link.icon;
          const active = current === link.href;
          return (
            <Link key={link.href} href={link.href} prefetch className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${active ? 'bg-butterfly-600 text-white shadow-soft' : 'bg-pink-50 text-stone-700 hover:bg-pink-100 hover:text-butterfly-700'}`}>
              <Icon size={16} />{link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
