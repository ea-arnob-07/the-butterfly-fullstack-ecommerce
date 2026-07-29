'use client';

import Link from 'next/link';
import { Menu, Phone, ShoppingBag, User, X, Mail, Facebook, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchDialog } from '@/components/search-dialog';
import type { SiteSettingsData } from '@/lib/site-settings';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Women', href: '/women' },
  { label: 'Men', href: '/men' },
  { label: 'Children', href: '/children' },
  { label: 'New Arrivals', href: '/#new-arrivals', highlight: true },
  { label: 'Top Sale', href: '/#top-sale', highlight: true },
  { label: 'Contact', href: '/contact' },
];

export function Header({ settings }: { settings: SiteSettingsData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const tel = settings.phone.replace(/[^\d+]/g, '');

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('butterfly_cart') || '[]');
        setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      } catch { setCartCount(0); }
    };
    updateCart();
    window.addEventListener('butterfly-cart-updated', updateCart);
    window.addEventListener('storage', updateCart);
    return () => { window.removeEventListener('butterfly-cart-updated', updateCart); window.removeEventListener('storage', updateCart); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-[0_4px_32px_rgba(212,7,90,0.10)] backdrop-blur-2xl border-b border-rose-100/60' : 'bg-white/85 backdrop-blur-xl border-b border-white/60'}`}>
      <div className="hidden overflow-hidden lg:block" style={{ background: 'linear-gradient(135deg, #1a1118 0%, #2d1a26 50%, #1a1118 100%)' }}>
        <div className="container-shell flex items-center justify-between py-2.5">
          <div className="flex items-center gap-6">
            <a href={`tel:${tel}`} className="inline-flex items-center gap-2 text-[12.5px] text-white/70 transition hover:text-pink-300"><Phone size={13} className="text-pink-400" />{settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 text-[12.5px] text-white/70 transition hover:text-pink-300"><Mail size={13} className="text-pink-400" />{settings.email}</a>
          </div>
          {/* Premium trust badges */}
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/55">
              <span className="text-emerald-400">✦</span> 100% Authentic
            </span>
            <span className="h-3 w-[1px] bg-white/15 rounded-full" />
            <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/55">
              <span className="text-sky-400">✦</span> Nationwide Delivery
            </span>
            <span className="h-3 w-[1px] bg-white/15 rounded-full" />
            <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/55">
              <span className="text-amber-400">✦</span> Secure Checkout
            </span>
            <span className="h-3 w-[1px] bg-white/15 rounded-full" />
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-white/70 transition hover:text-pink-300"><Facebook size={13} className="text-pink-400" />Follow us</a>
          </div>
        </div>
      </div>

      <div className="container-shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" prefetch className="group flex shrink-0 items-center gap-3.5" aria-label={settings.siteName}>
          <div className="relative"><div className="absolute inset-0 rounded-full bg-rose-400/15 blur-lg transition group-hover:bg-rose-400/25" /><img src={settings.logoUrl} alt={settings.siteName} className="relative h-11 w-auto object-contain drop-shadow-[0_4px_12px_rgba(212,7,90,0.20)] transition group-hover:scale-105" /></div>
          <div className="hidden sm:block"><p className="display-font text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-stone-950 transition group-hover:text-rose-800">{settings.siteName}</p><p className="mt-0.5 ml-0.5 text-[10px] font-extrabold uppercase tracking-[0.34em] text-rose-600">{settings.tagline}</p></div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ label, href, highlight }) => <Link key={href} href={href} prefetch className={`group relative rounded-xl px-3.5 py-2 text-[14.5px] font-semibold transition ${highlight ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700' : 'text-stone-700 hover:bg-rose-50/70 hover:text-rose-600'}`}>{label}<span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] origin-left scale-x-0 rounded-full bg-rose-500 transition-transform group-hover:scale-x-100" />{highlight && <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" /></span>}</Link>)}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          <Link href="/wishlist" prefetch className="rounded-xl p-2.5 text-stone-600 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Wishlist"><Heart size={20} /></Link>
          <Link href="/account" prefetch className="rounded-xl p-2.5 text-stone-600 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Account"><User size={20} /></Link>
          <Link href="/cart" prefetch className="relative rounded-xl p-2.5 text-stone-600 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Cart"><ShoppingBag size={20} />{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white">{cartCount}</span>}</Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="ml-1 rounded-xl p-2.5 text-stone-700 transition hover:bg-rose-50 hover:text-rose-600 lg:hidden" aria-label="Menu">{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>

      {mobileOpen && <div className="animate-slide-down border-t border-rose-100/60 bg-white/95 backdrop-blur-xl lg:hidden"><div className="container-shell pb-6 pt-4"><nav className="flex flex-col">{navLinks.map(({ label, href, highlight }) => <Link key={href} href={href} prefetch onClick={() => setMobileOpen(false)} className={`rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition hover:bg-rose-50 ${highlight ? 'text-rose-600' : 'text-stone-800'}`}>{label}</Link>)}</nav><div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm"><a href={`tel:${tel}`} className="flex items-center gap-2.5 py-1.5 text-stone-600"><Phone size={14} className="text-rose-400" />{settings.phone}</a><a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 py-1.5 text-stone-600"><Mail size={14} className="text-rose-400" />{settings.email}</a></div></div></div>}
      <div className="h-[1.5px] opacity-40" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,7,90,0.5) 30%, rgba(212,7,90,0.5) 70%, transparent)' }} />
    </header>
  );
}
