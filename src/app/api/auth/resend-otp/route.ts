import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { issueEmailVerificationOtp } from '@/lib/otp';

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await (prisma as any).user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
    if (!user || !user.isActive || user.emailVerifiedAt) {
      return NextResponse.json({ message: 'If verification is required, a code has been sent.' });
    }
    const result = await issueEmailVerificationOtp(user);
    return NextResponse.json({
      message: result.sent ? 'A new verification code has been sent.' : `Please wait ${result.retryAfter} seconds before requesting another code.`,
      retryAfter: result.retryAfter,
      devOtp: result.devOtp,
    });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not send a new code.' }, { status: 500 });
  }
}
