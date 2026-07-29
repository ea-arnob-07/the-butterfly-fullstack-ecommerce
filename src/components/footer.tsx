import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';
import type { SiteSettingsData } from '@/lib/site-settings';
import { buildWhatsAppSupportLink } from '@/lib/whatsapp';

const shopLinks = [
  { label: 'Women', href: '/women' }, { label: 'Men', href: '/men' }, { label: 'Children', href: '/children' },
  { label: 'New Arrivals', href: '/#new-arrivals' }, { label: 'Top Sale', href: '/#top-sale' }, { label: 'Shopping Cart', href: '/cart' }, { label: 'Wishlist', href: '/wishlist' },
];
const companyLinks = [
  { label: 'Contact Us', href: '/contact' }, { label: 'Login', href: '/auth/login' }, { label: 'Create Account', href: '/auth/register' }, { label: 'My Orders', href: '/account' }, { label: 'Admin Panel', href: '/admin' },
];

export function Footer({ settings }: { settings: SiteSettingsData }) {
  const tel = settings.phone.replace(/[^\d+]/g, '');
  return (
    <footer className="mt-16 overflow-hidden" style={{ background: 'linear-gradient(160deg,#0f0b0d 0%,#1a1118 40%,#120e10 100%)' }}>
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#c9963a 20%,#d4075a 50%,#c9963a 80%,transparent)' }} />
      <div className="container-shell grid gap-12 pb-10 pt-14 md:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] md:py-16">
        <div>
          <div className="flex items-center gap-4"><img src={settings.logoUrl} alt={settings.siteName} className="h-[72px] w-auto object-contain drop-shadow-[0_8px_20px_rgba(212,7,90,0.25)]" /><div><p className="display-font text-[2.15rem] font-semibold leading-none text-white">{settings.siteName}</p><p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.34em] text-amber-300">{settings.tagline}</p></div></div>
          <p className="mt-6 max-w-sm text-sm leading-[1.9] text-white/50">{settings.aboutDescription}</p>
          <div className="mt-7 flex items-center gap-3">
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-white/50 transition hover:border-rose-500 hover:text-rose-400"><Facebook size={17} /></a>
            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-white/50 transition hover:border-rose-500 hover:text-rose-400"><Instagram size={17} /></a>}
            <a href={`mailto:${settings.email}`} aria-label="Email" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-white/50 transition hover:border-rose-500 hover:text-rose-400"><Mail size={17} /></a>
            <a href={buildWhatsAppSupportLink(settings)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-white/50 transition hover:border-rose-500 hover:text-rose-400"><MessageCircle size={17} /></a>
          </div>
        </div>
        <div><h3 className="display-font text-2xl font-semibold text-white">Shop</h3><nav className="mt-6 flex flex-col gap-2.5">{shopLinks.map(({ label, href }) => <Link key={href} href={href} prefetch className="text-sm text-white/50 transition hover:translate-x-1 hover:text-white">{label}</Link>)}</nav></div>
        <div><h3 className="display-font text-2xl font-semibold text-white">Company</h3><nav className="mt-6 flex flex-col gap-2.5">{companyLinks.map(({ label, href }) => <Link key={href} href={href} prefetch className="text-sm text-white/50 transition hover:translate-x-1 hover:text-white">{label}</Link>)}</nav></div>
        <div><h3 className="display-font text-2xl font-semibold text-white">Get in Touch</h3><div className="mt-6 flex flex-col gap-4"><a href={`tel:${tel}`} className="flex items-start gap-3 text-sm text-white/50 transition hover:text-white"><Phone size={15} className="mt-0.5 text-rose-400" />{settings.phone}</a><a href={`mailto:${settings.email}`} className="flex items-start gap-3 text-sm text-white/50 transition hover:text-white"><Mail size={15} className="mt-0.5 text-rose-400" />{settings.email}</a><a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="flex items-start gap-3 text-sm text-white/50 transition hover:text-white"><Facebook size={15} className="mt-0.5 text-rose-400" />Facebook Page</a></div></div>
      </div>
      <div className="border-t border-white/[0.07]"><div className="container-shell flex flex-col gap-3 py-6 text-[12.5px] text-white/30 md:flex-row md:items-center md:justify-between"><p>{String.fromCharCode(169)} {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p><p>Designed &amp; Developed by <span className="font-semibold text-white/60">Estiuk Arafat Arnob</span>{' · '}<a href="https://wa.me/8801313602221" target="_blank" rel="noreferrer" className="font-semibold transition-colors hover:text-rose-400">+8801313602221</a></p></div></div>
    </footer>
  );
}
