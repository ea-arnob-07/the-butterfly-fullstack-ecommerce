'use client';
import { MessageCircle, Facebook } from 'lucide-react';
import type { SiteSettingsData } from '@/lib/site-settings';
import { buildWhatsAppSupportLink } from '@/lib/whatsapp';

export function FloatingContactButtons({ settings }: { settings: SiteSettingsData }) {
  const buttons = [
    { href: buildWhatsAppSupportLink(settings), label: 'Chat on WhatsApp', icon: MessageCircle, bg: 'linear-gradient(135deg, #25D366, #1aae52)', shadow: '0 8px 28px rgba(37,211,102,0.45)' },
    { href: settings.facebookUrl, label: 'Visit Facebook page', icon: Facebook, bg: 'linear-gradient(135deg, #1877F2, #0a5dc2)', shadow: '0 8px 28px rgba(24,119,242,0.45)' },
  ];
  return <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3.5">{buttons.map(({ href, label, icon: Icon, bg, shadow }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-14 w-14 items-center justify-center rounded-full text-white transition duration-200 hover:-translate-y-1 hover:scale-105" style={{ background: bg, boxShadow: shadow }}><Icon size={24} /></a>)}</div>;
}
