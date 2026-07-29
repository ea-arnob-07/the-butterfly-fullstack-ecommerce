import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  siteName: z.string().min(2),
  tagline: z.string().min(2),
  pageTitle: z.string().min(2),
  metaDescription: z.string().min(10),
  logoUrl: z.string().min(1),
  faviconUrl: z.string().min(1),
  heroImageUrl: z.string().min(1),
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(2),
  heroHighlight: z.string().min(2),
  heroTagline: z.string().min(2),
  heroDescription: z.string().min(10),
  aboutDescription: z.string().min(10),
  contactTitle: z.string().min(2),
  contactDescription: z.string().min(10),
  phone: z.string().min(5),
  email: z.string().email(),
  whatsappNumber: z.string().min(5),
  facebookUrl: z.string().url(),
  instagramUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  deliveryText: z.string().min(2),
});

async function authorize() {
  const session = await getSession();
  return Boolean(session && isAdminRole(session.role));
}

export async function PATCH(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const input = schema.parse(await request.json());
    const settings = await (prisma as any).siteSettings.upsert({
      where: { id: 'main' },
      update: { ...input, instagramUrl: input.instagramUrl || null },
      create: { id: 'main', ...input, instagramUrl: input.instagramUrl || null },
    });
    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid settings.' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Could not save page settings.' }, { status: 500 });
  }
}
