import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { SiteSettingsData } from '@/lib/site-settings';

const segments = [
  {
    title: 'Women',
    copy: 'Elegant edits, festivewear, accessories & statement style.',
    href: '/women',
    eyebrow: 'For Her',
    accent: 'from-rose-500/20 to-pink-400/10',
  },
  {
    title: 'Men',
    copy: 'Sharp essentials, panjabis, formalwear & polished looks.',
    href: '/men',
    eyebrow: 'For Him',
    accent: 'from-stone-700/20 to-stone-500/10',
  },
  {
    title: 'Children',
    copy: 'Playful pieces, soft comfort & picture-perfect occasion wear.',
    href: '/children',
    eyebrow: 'For Little Ones',
    accent: 'from-amber-400/20 to-yellow-300/10',
  },
];

export function Hero({ settings }: { settings: SiteSettingsData }) {
  return (
    <>
      {/* ── Main hero ──────────────────────────────── */}
      <section className="relative isolate min-h-[620px] overflow-hidden md:min-h-[700px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label={`${settings.siteName} — ${settings.tagline}`}
          style={{ backgroundImage: `url("${settings.heroImageUrl}")` }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/97 via-white/85 via-[38%] to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ffe8f2]/80 via-transparent to-transparent" />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Decorative orbs */}
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #f0277c, transparent)' }} />
        <div className="absolute right-1/4 top-10 h-48 w-48 rounded-full opacity-15 blur-3xl animate-float delay-300"
          style={{ background: 'radial-gradient(circle, #c9963a, transparent)' }} />

        {/* Content */}
        <div className="container-shell relative flex min-h-[620px] items-center py-16 md:min-h-[700px] md:py-24">
          <div className="max-w-[600px]">
            {/* Eyebrow pill */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/70 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles size={13} className="text-rose-500 animate-pulse" />
              <span className="text-[11.5px] font-extrabold uppercase tracking-[0.30em] text-rose-600">
                {settings.heroEyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="display-font animate-fade-up delay-100 mt-6 font-semibold leading-[0.97] tracking-[-0.04em] text-stone-950"
              style={{ fontSize: 'clamp(2.9rem, 6vw, 5.2rem)', textShadow: '0 2px 20px rgba(255,255,255,0.9)' }}
            >
              {settings.heroTitle}{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #b2054c 0%, #d4075a 40%, #f0277c 75%, #c9963a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {settings.heroHighlight}
              </span>
            </h1>

            {/* Tagline */}
            <p className="display-font animate-fade-up delay-200 mt-5 text-2xl font-medium italic text-rose-700 md:text-[1.85rem]">
              {settings.heroTagline}
            </p>

            {/* Body */}
            <p className="animate-fade-up delay-300 mt-6 max-w-[530px] text-base leading-[1.9] text-stone-600 md:text-lg">
{settings.heroDescription}
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up delay-400 mt-9 flex flex-wrap gap-3">
              <Link href="/women" className="btn-primary">
                Shop Women
              </Link>
              <Link href="/men" className="btn-dark">
                Shop Men
              </Link>
              <Link href="/children" className="btn-secondary">
                Shop Children
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up delay-500 mt-8 flex flex-wrap items-center gap-5 text-[12.5px] font-semibold text-stone-500">
              {['Free delivery across BD', 'Secure checkout', 'Premium selection'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection cards ───────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />

        <div className="container-shell relative">
          <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-eyebrow">Shop by Collection</p>
              <h2 className="section-title mt-4 max-w-lg">
                Find the collection<br />
                <span className="italic text-rose-700">made for you.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-stone-500 md:text-right">
              Thoughtfully organized collections for women, men, and children — each curated with care.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {segments.map((seg) => (
              <Link
                key={seg.title}
                href={seg.href}
                className="group relative overflow-hidden rounded-[2rem] border border-rose-100/60 bg-white p-7 shadow-[0_8px_40px_rgba(212,7,90,0.07)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(212,7,90,0.14)]"
              >
                {/* Corner glow orb */}
                <div
                  className={`absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${seg.accent} blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 opacity-60`}
                />

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-rose-400 to-rose-200 scale-x-0 transition-transform duration-400 group-hover:scale-x-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="section-eyebrow text-[10.5px]">{seg.eyebrow}</p>
                    <h3 className="display-font mt-4 text-4xl font-semibold text-stone-950 transition-colors group-hover:text-rose-700">
                      {seg.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.8] text-stone-500">{seg.copy}</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-all duration-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 group-hover:shadow-[0_8px_20px_rgba(212,7,90,0.3)]">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="relative mt-8 flex items-center gap-2">
                  <span className="h-[1.5px] flex-1 rounded-full bg-gradient-to-r from-rose-200 to-transparent" />
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-rose-500">
                    Explore collection
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
