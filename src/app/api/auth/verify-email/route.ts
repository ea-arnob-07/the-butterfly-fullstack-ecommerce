import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAME, createSessionToken } from '@/lib/auth';
import { hashOtp } from '@/lib/otp';

const schema = z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    const db = prisma as any;
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });

    if (user.emailVerifiedAt) {
      const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name, role: user.role });
      const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      response.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
      return response;
    }

    const otp = await db.otpCode.findFirst({
      where: { userId: user.id, purpose: 'EMAIL_VERIFICATION', consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp || new Date(otp.expiresAt).getTime() < Date.now() || otp.attempts >= 5) {
      return NextResponse.json({ error: 'This code has expired. Request a new code.' }, { status: 400 });
    }

    if (otp.codeHash !== hashOtp(user.id, input.code)) {
      await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ error: 'Incorrect verification code.' }, { status: 400 });
    }

    const verifiedUser = await db.$transaction(async (tx: any) => {
      await tx.otpCode.updateMany({ where: { userId: user.id, purpose: 'EMAIL_VERIFICATION', consumedAt: null }, data: { consumedAt: new Date() } });
      return tx.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
    });

    const token = await createSessionToken({ userId: verifiedUser.id, email: verifiedUser.email, name: verifiedUser.name, role: verifiedUser.role });
    const response = NextResponse.json({ user: { id: verifiedUser.id, name: verifiedUser.name, email: verifiedUser.email, role: verifiedUser.role } });
    response.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Enter the 6-digit code sent to your email.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: 'Email verification is currently unavailable.' }, { status: 500 });
  }
}
