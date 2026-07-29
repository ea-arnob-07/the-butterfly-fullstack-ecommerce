'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, MailCheck, RefreshCcw, ShieldCheck } from 'lucide-react';

import { Suspense } from 'react';

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const next = params.get('next') || '/account';
  const [code, setCode] = useState(params.get('devOtp') || '');
  const [devOtp, setDevOtp] = useState(params.get('devOtp') || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('Verifying your email...');
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Verification failed.');
    setMessage('Email verified successfully. Redirecting...');
    const destination = data.user?.role === 'CUSTOMER' ? next : '/admin';
    router.replace(destination);
    router.refresh();
  }

  async function resend() {
    if (!email || seconds > 0) return;
    setResending(true);
    setMessage('Sending a new code...');
    const response = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setResending(false);
    if (!response.ok) return setMessage(data.error || 'Could not send a new code.');
    if (data.devOtp) {
      setDevOtp(data.devOtp);
      setCode(data.devOtp);
    }
    setSeconds(Number(data.retryAfter || 60));
    setMessage(data.message || 'A new code has been sent.');
  }

  if (!email) {
    return (
      <div className="container-shell py-24 text-center">
        <h1 className="section-title">Verification email missing</h1>
        <p className="mt-4 text-stone-500">Return to the login page and try again.</p>
        <Link href="/auth/login" className="btn-primary mt-8">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden px-4 py-16" style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #fffbfd 45%, #fff5f0 100%)' }}>
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-1/4 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(212,7,90,0.15)] backdrop-blur-xl md:p-10">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/butterfly-logo-transparent.png" width={64} height={60} alt="The Butterfly" className="h-14 w-auto object-contain" />
          <div className="mt-5 grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-600"><MailCheck size={25} /></div>
          <h1 className="display-font mt-5 text-3xl font-semibold text-stone-900">Verify your email</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">We sent a 6-digit verification code to <strong className="text-stone-800">{email}</strong>.</p>
        </div>

        <form onSubmit={verify} className="mt-7 space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500"><KeyRound size={15} /></span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              placeholder="Enter 6-digit code"
              className="input-premium auth-input-left text-center text-xl font-black tracking-[0.35em]"
            />
          </div>

          {devOtp && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
              <p className="text-sm text-rose-800 mb-2">Your verification code (OTP):</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold tracking-widest text-rose-600">{devOtp}</span>
                <button 
                  type="button" 
                  onClick={() => navigator.clipboard.writeText(devOtp)}
                  className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded hover:bg-rose-300 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {message && <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-sm text-stone-700">{message}</div>}

          <button disabled={loading || code.length !== 6} className="btn-primary w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
            <ShieldCheck size={17} />{loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <button type="button" onClick={resend} disabled={resending || seconds > 0} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
          <RefreshCcw size={15} />{resending ? 'Sending...' : seconds > 0 ? `Resend code in ${seconds}s` : 'Resend verification code'}
        </button>

        <p className="mt-6 text-center text-xs leading-6 text-stone-400">The code expires after 10 minutes and is limited to five attempts.</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
