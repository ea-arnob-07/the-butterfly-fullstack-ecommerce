import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAME, createSessionToken } from '@/lib/auth';
import { issueEmailVerificationOtp } from '@/lib/otp';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const db = prisma as any;
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
    if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    }

    if (!user.emailVerifiedAt) {
      const otp = await issueEmailVerificationOtp(user);
      return NextResponse.json({
        error: otp.sent ? 'Verify your email to complete the first login.' : `A code was already sent. Try again in ${otp.retryAfter} seconds.`,
        requiresVerification: true,
        email: user.email,
        retryAfter: otp.retryAfter,
        devOtp: otp.devOtp,
      }, { status: 403 });
    }

    const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name, role: user.role });
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Login is currently unavailable.' }, { status: 500 });
  }
}
