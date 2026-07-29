import { Facebook, Mail, Phone } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const tel = settings.phone.replace(/[^\d+]/g, '');
  return (
    <section className="container-shell py-16">
      <div className="mb-10 max-w-3xl">
        <p className="font-bold uppercase tracking-[0.2em] text-butterfly-600">Contact {settings.siteName}</p>
        <h1 className="section-title mt-3">{settings.contactTitle}</h1>
        <p className="mt-4 section-copy">{settings.contactDescription}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <a href={`tel:${tel}`} className="soft-card rounded-[1.8rem] p-7 transition hover:-translate-y-1"><Phone className="text-butterfly-600" /><h2 className="display-font mt-5 text-3xl font-semibold text-stone-900">Call</h2><p className="mt-3 text-sm leading-7 text-stone-600">{settings.phone}</p></a>
        <a href={`mailto:${settings.email}`} className="soft-card rounded-[1.8rem] p-7 transition hover:-translate-y-1"><Mail className="text-butterfly-600" /><h2 className="display-font mt-5 text-3xl font-semibold text-stone-900">Email</h2><p className="mt-3 text-sm leading-7 text-stone-600">{settings.email}</p></a>
        <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="soft-card rounded-[1.8rem] p-7 transition hover:-translate-y-1"><Facebook className="text-butterfly-600" /><h2 className="display-font mt-5 text-3xl font-semibold text-stone-900">Facebook</h2><p className="mt-3 text-sm leading-7 text-stone-600">Visit our official Facebook page</p></a>
      </div>
    </section>
  );
}
