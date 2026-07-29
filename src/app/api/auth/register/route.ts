import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { issueEmailVerificationOtp } from '@/lib/otp';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    const db = prisma as any;
    const exists = await db.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'An account with this email already exists. Sign in to continue.' }, { status: 409 });

    const user = await db.user.create({
      data: {
        name: input.name.trim(),
        email,
        phone: input.phone?.trim() || null,
        passwordHash: await bcrypt.hash(input.password, 12),
        emailVerifiedAt: null,
      },
    });

    const otp = await issueEmailVerificationOtp(user, { ignoreRateLimit: true });
    return NextResponse.json({
      requiresVerification: true,
      email: user.email,
      message: 'Account created. Enter the verification code sent to your email.',
      devOtp: otp.devOtp,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid information.' }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not create the account.' }, { status: 500 });
  }
}
