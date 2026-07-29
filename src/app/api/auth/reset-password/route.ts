import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashOtp } from '@/lib/otp';

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    const db = prisma as any;
    
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    const hashedCode = hashOtp(user.id, input.code);
    
    const otpRecord = await db.otpCode.findFirst({
      where: {
        userId: user.id,
        purpose: 'PASSWORD_RESET',
        codeHash: hashedCode,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(input.password, 12);

    // Update password and consume OTP in a transaction
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      }),
      db.otpCode.update({
        where: { id: otpRecord.id },
        data: { consumedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid information provided.' }, { status: 400 });
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
