'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState, useEffect, type ReactNode, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Hash, Eye, EyeOff, Save } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      router.push('/auth/forgot-password');
    }
    const otp = searchParams.get('devOtp');
    if (otp) setDevOtp(otp);
  }, [email, router, searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    const form = new FormData(event.currentTarget);
    const code = form.get('code') as string;
    const password = form.get('password') as string;
    
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    });
    
    const data = await response.json();
    setLoading(false);
    
    if (!response.ok) {
      return setError(data.error || 'Something went wrong.');
    }
    
    router.push('/auth/login?reset=success');
  }

  if (!email) return null;

  return (
    <AuthLayout
      title="Set New Password"
      subtitle={`Enter the code sent to ${email} and your new password.`}
      linkText="Remembered your password?"
      linkLabel="Sign in"
      linkHref="/auth/login"
    >
      <form onSubmit={submit} className="space-y-4">
        {/* OTP Code */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500"><Hash size={15} /></span>
          <input
            name="code"
            type="text"
            required
            maxLength={6}
            placeholder="6-digit reset code"
            className="input-premium auth-input-left tracking-widest"
            defaultValue={devOtp}
          />
        </div>

        {/* New Password */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500"><Lock size={15} /></span>
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            required
            minLength={8}
            placeholder="New Password (min. 8 characters)"
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
              Resetting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={16} />
              Save New Password
            </span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
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
