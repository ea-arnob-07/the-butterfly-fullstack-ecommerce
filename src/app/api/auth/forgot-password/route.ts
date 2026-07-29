import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { issuePasswordResetOtp } from '@/lib/otp';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    const db = prisma as any;
    
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak whether the email exists or not to prevent user enumeration
      return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.' }, { status: 200 });
    }

    const otp = await issuePasswordResetOtp(user);
    
    if (!otp.sent) {
      return NextResponse.json({ error: `Please wait ${otp.retryAfter} seconds before requesting a new code.` }, { status: 429 });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
      devOtp: otp.devOtp,
    }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
