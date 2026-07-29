import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FloatingContactButtons } from '@/components/floating-contact-buttons';
import { getSiteSettings } from '@/lib/site-settings';

const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['300', '400', '500', '600', '700', '800'], display: 'swap' });
const displayFont = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'], display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { default: settings.pageTitle, template: `%s | ${settings.siteName}` },
    description: settings.metaDescription,
    keywords: ['fashion', 'women fashion', 'men fashion', 'children fashion', 'Bangladesh', 'boutique', settings.siteName],
    icons: { icon: settings.faviconUrl },
    openGraph: { title: settings.pageTitle, description: settings.metaDescription, type: 'website' },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <FloatingContactButtons settings={settings} />
      </body>
    </html>
  );
}
