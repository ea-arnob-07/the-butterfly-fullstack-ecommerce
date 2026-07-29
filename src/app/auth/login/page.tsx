'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.requiresVerification && data.email) {
      const target = params.get('next') || '/account';
      const query = new URLSearchParams({ email: data.email, next: target });
      if (data.devOtp) query.set('devOtp', data.devOtp);
      router.push(`/auth/verify?${query.toString()}`);
      return;
    }
    if (!response.ok) return setError(data.error || 'Login failed. Please check your credentials.');
    router.push(params.get('next') || (data.user.role === 'CUSTOMER' ? '/account' : '/admin'));
    router.refresh();
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to manage orders and wishlist."
      linkText="New here?"
      linkLabel="Create an account"
      linkHref="/auth/register"
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500"><Mail size={15} /></span>
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="input-premium auth-input-left"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-medium text-stone-700">Password</span>
            <Link href="/auth/forgot-password" className="text-[12.5px] font-medium text-rose-600 transition hover:text-rose-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500"><Lock size={15} /></span>
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            required
            placeholder="Password"
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
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn size={16} />
              Sign In
            </span>
          )}
        </button>
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
      style={{
        background: 'linear-gradient(135deg, #fff0f5 0%, #fffbfd 40%, #fff5f0 100%)',
      }}
    >
      {/* Background orbs */}
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #d4075a, transparent)' }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #c9963a, transparent)' }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="rounded-[2.5rem] bg-white/92 p-8 shadow-[0_24px_80px_rgba(212,7,90,0.15),0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-white/80 md:p-10">
          {/* Brand mark */}
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

          {/* Form */}
          {children}

          {/* Link */}
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
