'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        password: form.get('password'),
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || 'Registration failed. Please try again.');
    const query = new URLSearchParams({ email: data.email, next: '/account' });
    if (data.devOtp) query.set('devOtp', data.devOtp);
    router.push(`/auth/verify?${query.toString()}`);
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join The Butterfly to save your cart, orders, and wishlist."
      linkText="Already a member?"
      linkLabel="Sign in"
      linkHref="/auth/login"
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Full name */}
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
          <input
            name="name"
            required
            placeholder="Full name"
            className="input-premium auth-input-left"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
          <input
            name="phone"
            placeholder="Phone number (optional)"
            className="input-premium auth-input-left"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="input-premium auth-input-left"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            minLength={8}
            required
            placeholder="Password (min. 8 characters)"
            className="input-premium auth-input-both"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-rose-600"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-fade-in rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus size={16} />
              Create Account
            </span>
          )}
        </button>

        <p className="text-center text-[12px] text-stone-400 leading-relaxed">
          By creating an account you agree to our terms of service and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({
  title, subtitle, children, linkText, linkLabel, linkHref,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  linkText: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <div
      className="relative flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #fffbfd 40%, #fff5f0 100%)' }}
    >
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #d4075a, transparent)' }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #c9963a, transparent)' }}
      />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="rounded-[2.5rem] bg-white/92 p-8 shadow-[0_24px_80px_rgba(212,7,90,0.15),0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-white/80 md:p-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ background: 'radial-gradient(circle, #d4075a, transparent)' }} />
              <Image
                src="/images/butterfly-logo-transparent.png"
                width={64} height={60}
                alt="The Butterfly"
                className="relative h-14 w-auto object-contain"
              />
            </div>
            <p className="display-font text-2xl font-semibold text-stone-900">{title}</p>
            <p className="mt-1.5 text-sm text-center text-stone-500">{subtitle}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-stone-500">
            {linkText}{' '}
            <Link href={linkHref} className="font-bold text-rose-600 transition hover:text-rose-800 hover:underline">
              {linkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
