import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type SiteSettingsData = {
  id: string;
  siteName: string;
  tagline: string;
  pageTitle: string;
  metaDescription: string;
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroTagline: string;
  heroDescription: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string | null;
  deliveryText: string;
};

export const defaultSiteSettings: SiteSettingsData = {
  id: 'main',
  siteName: 'The Butterfly',
  tagline: 'Your Dream Line',
  pageTitle: 'The Butterfly | Your Dream Line',
  metaDescription: 'Premium fashion for women, men, and children.',
  logoUrl: '/images/butterfly-logo-transparent.png',
  faviconUrl: '/images/butterfly-logo-transparent.png',
  heroImageUrl: '/images/butterfly-hero-4k.webp',
  heroEyebrow: 'Luxury Fashion Destination',
  heroTitle: 'Style curated',
  heroHighlight: 'for every generation.',
  heroTagline: 'The Butterfly – Your Dream Line',
  heroDescription: 'Discover a refined online shopping experience where modern design, premium presentation, and confident style come together for every generation.',
  aboutDescription: 'Premium fashion and accessories for women, men, and children with a polished shopping experience that feels modern, elegant, and trustworthy.',
  contactTitle: 'We are here to help you shop with confidence.',
  contactDescription: 'Reach out for product enquiries, order support, collaboration discussions, or direct customer assistance.',
  phone: '+8801707845422',
  email: 'butterflythe710@gmail.com',
  whatsappNumber: '8801707845422',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61581187327217&mibextid=wwXIfr&rdid=Cz2X2rMU9AlEPwy6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BcduGXoHy%2F#',
  instagramUrl: null,
  deliveryText: '', // Cleared as requested
};

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const settings = await (prisma as any).siteSettings.upsert({
      where: { id: 'main' },
      update: {},
      create: defaultSiteSettings,
    });
    return settings;
  } catch {
    return defaultSiteSettings;
  }
});

export function normalizePhoneForLink(value: string) {
  return value.replace(/[^\d+]/g, '');
}

export function normalizeWhatsApp(value: string) {
  return value.replace(/\D/g, '');
}
