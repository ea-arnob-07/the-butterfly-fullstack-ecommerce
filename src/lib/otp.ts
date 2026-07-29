import { createHash, randomInt } from 'node:crypto';
import { prisma } from '@/lib/prisma';

const OTP_TTL_MINUTES = 10;
const OTP_RESEND_SECONDS = 60;

function otpSecret() {
  return process.env.JWT_SECRET || 'development-only-otp-secret';
}

export function hashOtp(userId: string, code: string) {
  return createHash('sha256').update(`${userId}:${code}:${otpSecret()}`).digest('hex');
}

function escapeHtml(value: string | null | undefined) {
  if (!value) return '';
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] || character));
}

async function sendVerificationEmail(input: { email: string; name: string | null | undefined; code: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'The Butterfly <onboarding@resend.dev>';

  if (!apiKey) {
    console.info(`[DEV OTP] ${input.email}: ${input.code}`);
    return { delivered: false, developmentMode: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: `${input.code} is your The Butterfly verification code`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#24151e">
          <div style="padding:28px;border:1px solid #f8c9dc;border-radius:24px;background:#fff8fb">
            <p style="margin:0 0 12px;color:#d4075a;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">The Butterfly · Your Dream Line</p>
            <h1 style="margin:0 0 12px;font-size:28px">Verify your email</h1>
            <p style="line-height:1.7;color:#6d5764">Hello ${escapeHtml(input.name || 'User')}, use the verification code below to finish your signup or first login.</p>
            <div style="margin:24px 0;padding:18px;border-radius:16px;background:#ffffff;text-align:center;font-size:34px;font-weight:800;letter-spacing:10px;color:#d4075a">${input.code}</div>
            <p style="line-height:1.7;color:#6d5764">This code expires in ${OTP_TTL_MINUTES} minutes. Do not share it with anyone.</p>
          </div>
        </div>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Resend OTP email failed:', detail);
    return { delivered: false, developmentMode: false, error: 'Could not send the verification email.' };
  }

  return { delivered: true, developmentMode: false };
}

export async function issueEmailVerificationOtp(user: { id: string; email: string; name: string | null | undefined }, options?: { ignoreRateLimit?: boolean }) {
  const db = prisma as any;
  const latest = await db.otpCode.findFirst({
    where: { userId: user.id, purpose: 'EMAIL_VERIFICATION', consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!options?.ignoreRateLimit && latest) {
    const elapsed = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 1000);
    if (elapsed < OTP_RESEND_SECONDS) {
      return { sent: false, retryAfter: OTP_RESEND_SECONDS - elapsed, expiresAt: latest.expiresAt as Date };
    }
  }

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.otpCode.updateMany({
    where: { userId: user.id, purpose: 'EMAIL_VERIFICATION', consumedAt: null },
    data: { consumedAt: new Date() },
  });
  const record = await db.otpCode.create({
    data: { userId: user.id, purpose: 'EMAIL_VERIFICATION', codeHash: hashOtp(user.id, code), expiresAt },
  });

  try {
    const delivery = await sendVerificationEmail({ email: user.email, name: user.name, code });
    return {
      sent: true,
      retryAfter: OTP_RESEND_SECONDS,
      expiresAt,
      devOtp: code,
    };
  } catch (error) {
    await db.otpCode.delete({ where: { id: record.id } }).catch(() => undefined);
    throw error;
  }
}

export async function issuePasswordResetOtp(user: { id: string; email: string; name: string | null | undefined }, options?: { ignoreRateLimit?: boolean }) {
  const db = prisma as any;
  const latest = await db.otpCode.findFirst({
    where: { userId: user.id, purpose: 'PASSWORD_RESET', consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!options?.ignoreRateLimit && latest) {
    const elapsed = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 1000);
    if (elapsed < OTP_RESEND_SECONDS) {
      return { sent: false, retryAfter: OTP_RESEND_SECONDS - elapsed, expiresAt: latest.expiresAt as Date };
    }
  }

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.otpCode.updateMany({
    where: { userId: user.id, purpose: 'PASSWORD_RESET', consumedAt: null },
    data: { consumedAt: new Date() },
  });
  const record = await db.otpCode.create({
    data: { userId: user.id, purpose: 'PASSWORD_RESET', codeHash: hashOtp(user.id, code), expiresAt },
  });

  try {
    const delivery = await sendVerificationEmail({ email: user.email, name: user.name, code });
    return {
      sent: true,
      retryAfter: OTP_RESEND_SECONDS,
      expiresAt,
      devOtp: code,
    };
  } catch (error) {
    await db.otpCode.delete({ where: { id: record.id } }).catch(() => undefined);
    throw error;
  }
}

