'use client';

import { FormEvent, useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import type { SiteSettingsData } from '@/lib/site-settings';
import { Save, ShieldCheck } from 'lucide-react';

export function PageManagementForm({ initial }: { initial: SiteSettingsData }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const set = (key: keyof SiteSettingsData, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const input = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-butterfly-400 focus:ring-4 focus:ring-pink-50';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving changes...');
    const response = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    setSaving(false);
    setMessage(response.ok ? 'Page settings saved. Storefront content is updated.' : data.error || 'Could not save settings.');
  }

  const field = (label: string, key: keyof SiteSettingsData, type = 'text') => (
    <label className="grid gap-2 text-sm font-semibold text-stone-700">
      {label}
      <input className={input} type={type} value={String(values[key] ?? '')} onChange={(e) => set(key, e.target.value)} />
    </label>
  );

  const area = (label: string, key: keyof SiteSettingsData) => (
    <label className="grid gap-2 text-sm font-semibold text-stone-700 md:col-span-2">
      {label}
      <textarea className={`${input} min-h-28`} value={String(values[key] ?? '')} onChange={(e) => set(key, e.target.value)} />
    </label>
  );

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">General Settings</p>
        <h2 className="display-font mt-2 text-3xl font-semibold">Brand & page identity</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {field('Website name', 'siteName')}
          {field('Tagline', 'tagline')}
          {field('Browser/page title', 'pageTitle')}
          {field('Delivery announcement', 'deliveryText')}
          {area('SEO description', 'metaDescription')}
          {area('Footer / brand description', 'aboutDescription')}
        </div>
      </section>

      <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Images</p>
        <h2 className="display-font mt-2 text-3xl font-semibold">Logo, favicon & cover photo</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div><p className="mb-3 text-sm font-semibold">Website logo</p><ImageUploader value={values.logoUrl} onChange={(url) => set('logoUrl', url)} /><input className={`${input} mt-3`} value={values.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} /></div>
          <div><p className="mb-3 text-sm font-semibold">Favicon</p><ImageUploader value={values.faviconUrl} onChange={(url) => set('faviconUrl', url)} /><input className={`${input} mt-3`} value={values.faviconUrl} onChange={(e) => set('faviconUrl', e.target.value)} /></div>
          <div className="lg:col-span-2"><p className="mb-3 text-sm font-semibold">Homepage cover image</p><ImageUploader value={values.heroImageUrl} onChange={(url) => set('heroImageUrl', url)} /><input className={`${input} mt-3`} value={values.heroImageUrl} onChange={(e) => set('heroImageUrl', e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Homepage</p>
        <h2 className="display-font mt-2 text-3xl font-semibold">Hero text & descriptions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {field('Small heading', 'heroEyebrow')}
          {field('Main heading', 'heroTitle')}
          {field('Highlighted heading', 'heroHighlight')}
          {field('Hero tagline', 'heroTagline')}
          {area('Hero description', 'heroDescription')}
        </div>
      </section>

      <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Contact & social</p>
        <h2 className="display-font mt-2 text-3xl font-semibold">Customer contact information</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {field('Phone number', 'phone')}
          {field('Email address', 'email', 'email')}
          {field('WhatsApp number (country code included)', 'whatsappNumber')}
          {field('Facebook link', 'facebookUrl', 'url')}
          {field('Instagram link (optional)', 'instagramUrl', 'url')}
          {field('Contact page title', 'contactTitle')}
          {area('Contact page description', 'contactDescription')}
        </div>
      </section>

      <div className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0" size={19} /><p><strong>Protected developer credit:</strong> Designed & Developed by Estiuk Arafat Arnob · WhatsApp +8801313602221 is hard-coded and cannot be edited from Page Management or the settings API.</p></div>
      </div>

      {message && <p className={`text-sm font-bold ${message.includes('saved') ? 'text-emerald-700' : 'text-stone-600'}`}>{message}</p>}
      <button disabled={saving} className="btn-primary w-full justify-center py-4 disabled:opacity-60"><Save size={17} />{saving ? 'Saving...' : 'Save Page Settings'}</button>
    </form>
  );
}
