import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isAdminRole } from '@/lib/auth';
import { verifyOrderAccessToken } from '@/lib/order-access';
import { buildInvoicePdf } from '@/lib/invoice-pdf';
import { getSiteSettings } from '@/lib/site-settings';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get('order')?.trim();
  const token = url.searchParams.get('token');
  if (!orderNumber) return NextResponse.json({ error: 'Order number is required.' }, { status: 400 });

  const order = await (prisma as any).order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const session = await getSession();
  const sessionAuthorized = Boolean(session && (isAdminRole(session.role) || (order.userId && order.userId === session.userId)));
  const tokenAuthorized = verifyOrderAccessToken(order, token);
  if (!sessionAuthorized && !tokenAuthorized) return NextResponse.json({ error: 'You are not authorized to view this invoice.' }, { status: 403 });

  const settings = await getSiteSettings();
  const pdf = buildInvoicePdf(order, settings);
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
