import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession, isAdminRole } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';
import { deliveryFeeForZone } from '@/lib/commerce-config';
import { createOrderAccessToken } from '@/lib/order-access';
import { sendOrderEmails } from '@/lib/order-email';
import { getSiteSettings } from '@/lib/site-settings';

export const runtime = 'nodejs';

const itemSchema = z.object({ productId: z.string(), slug: z.string(), quantity: z.number().int().min(1).max(20), size: z.string(), color: z.string() });
const orderSchema = z.object({
  customerName: z.string().min(2), customerEmail: z.string().email(), customerPhone: z.string().min(6),
  division: z.string().min(2), district: z.string().min(2), area: z.string().min(2), postalCode: z.string().optional().nullable(),
  deliveryAddress: z.string().min(8), notes: z.string().optional().nullable(),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'CARD', 'MOBILE_BANKING']),
  deliveryZone: z.enum(['INSIDE_DHAKA', 'OUTSIDE_DHAKA']),
  mobileBankingProvider: z.enum(['BKASH', 'NAGAD', 'ROCKET']).optional().nullable(),
  paymentSenderNumber: z.string().max(30).regex(/^\+?[0-9][0-9 -]{7,20}$/, 'Enter a valid sender mobile number.').optional().nullable(),
  paymentTransactionId: z.string().max(100).regex(/^[A-Za-z0-9_-]{4,100}$/, 'Enter a valid transaction ID.').optional().nullable(),
  paymentScreenshotUrl: z.union([z.string().url().refine((value) => /^https:\/\/res\.cloudinary\.com\//.test(value), 'Invalid payment screenshot URL.'), z.literal(''), z.null()]).optional(),
  items: z.array(itemSchema).min(1),
}).superRefine((value, context) => {
  if (value.paymentMethod !== 'MOBILE_BANKING') return;
  if (!value.mobileBankingProvider) context.addIssue({ code: 'custom', path: ['mobileBankingProvider'], message: 'Select bKash, Nagad, or Rocket.' });
  if (!value.paymentSenderNumber?.trim() || value.paymentSenderNumber.trim().length < 8) context.addIssue({ code: 'custom', path: ['paymentSenderNumber'], message: 'Enter the sender mobile number.' });
  if (!value.paymentTransactionId?.trim() || value.paymentTransactionId.trim().length < 4) context.addIssue({ code: 'custom', path: ['paymentTransactionId'], message: 'Enter a valid transaction ID.' });
});

type PreparedItem = { product: any; variant: any; quantity: number; unitPrice: number };

async function prepareItems(items: z.infer<typeof itemSchema>[], tx: any): Promise<PreparedItem[]> {
  const prepared: PreparedItem[] = [];
  for (const item of items) {
    const product = await tx.product.findFirst({
      where: { OR: [{ id: item.productId }, { slug: item.slug }], isPublished: true, deletedAt: null },
      include: { images: { orderBy: { position: 'asc' } }, variants: true },
    });
    if (!product) throw new Error(`Product not found: ${item.slug}`);
    const variant = product.variants.find((value: any) => value.size === item.size && value.color === item.color) || product.variants[0];
    if (!variant || variant.stock < item.quantity) throw new Error(`${product.name} does not have enough stock.`);
    const unitPrice = Number(variant.price || product.salePrice || product.basePrice);
    prepared.push({ product, variant, quantity: item.quantity, unitPrice });
  }
  return prepared;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: isAdminRole(session.role) ? {} : { userId: session.userId },
    include: { items: true }, orderBy: { createdAt: 'desc' }, take: 100,
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const input = orderSchema.parse(await request.json());
    const session = await getSession();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const transactionId = input.paymentMethod === 'MOBILE_BANKING' ? input.paymentTransactionId!.trim().toUpperCase() : null;

    const result = await prisma.$transaction(async (tx) => {
      if (transactionId) {
        const existingTransaction = await (tx as any).order.findFirst({
          where: { paymentTransactionId: { equals: transactionId, mode: 'insensitive' } },
          select: { id: true },
        });
        if (existingTransaction) throw new Error('This transaction ID has already been used. Check the ID or contact support.');
      }

      const prepared = await prepareItems(input.items, tx);
      const subtotal = prepared.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const deliveryFee = deliveryFeeForZone(input.deliveryZone);
      const orderNumber = `TB-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 90 + 10)}`;
      const isCard = input.paymentMethod === 'CARD';
      const isMobileBanking = input.paymentMethod === 'MOBILE_BANKING';

      const order = await (tx as any).order.create({
        data: {
          orderNumber,
          userId: session?.userId || null,
          customerName: input.customerName.trim(),
          customerEmail: input.customerEmail.toLowerCase().trim(),
          customerPhone: input.customerPhone.trim(),
          division: input.division.trim(),
          district: input.district.trim(),
          area: input.area.trim(),
          postalCode: input.postalCode?.trim() || null,
          deliveryAddress: input.deliveryAddress.trim(),
          notes: input.notes?.trim() || null,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          paymentMethod: input.paymentMethod,
          paymentStatus: isCard || isMobileBanking ? 'PENDING' : 'UNPAID',
          paymentReference: transactionId,
          deliveryZone: input.deliveryZone,
          mobileBankingProvider: isMobileBanking ? input.mobileBankingProvider : null,
          paymentSenderNumber: isMobileBanking ? input.paymentSenderNumber?.trim() : null,
          paymentTransactionId: transactionId,
          paymentScreenshotUrl: isMobileBanking ? input.paymentScreenshotUrl || null : null,
          stockDeducted: !isCard,
          items: {
            create: prepared.map(({ product, variant, quantity, unitPrice }) => ({
              productId: product.id,
              name: product.name,
              imageUrl: product.images.find((image: any) => image.isCover)?.url || product.images[0]?.url || null,
              size: variant.size,
              color: variant.color,
              quantity,
              unitPrice,
              total: unitPrice * quantity,
            })),
          },
        },
        include: { items: true },
      });

      if (!isCard) {
        for (const item of prepared) {
          await tx.productVariant.update({ where: { id: item.variant.id }, data: { stock: { decrement: item.quantity } } });
        }
      }

      return { order, prepared, subtotal, deliveryFee };
    });

    const invoiceToken = createOrderAccessToken(result.order);

    if (input.paymentMethod === 'CARD') {
      try {
        const stripe = getStripe();
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = result.prepared.map(({ product, quantity, unitPrice }) => ({
          quantity,
          price_data: { currency: 'bdt', unit_amount: Math.round(unitPrice * 100), product_data: { name: product.name } },
        }));
        lineItems.push({
          quantity: 1,
          price_data: { currency: 'bdt', unit_amount: Math.round(result.deliveryFee * 100), product_data: { name: 'Delivery Fee' } },
        });

        const checkoutSession = await stripe.checkout.sessions.create({
          mode: 'payment',
          customer_email: input.customerEmail.toLowerCase(),
          client_reference_id: result.order.id,
          metadata: { orderId: result.order.id, orderNumber: result.order.orderNumber },
          line_items: lineItems,
          success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/payment/cancel?order=${encodeURIComponent(result.order.orderNumber)}`,
        });

        await prisma.order.update({ where: { id: result.order.id }, data: { stripeSessionId: checkoutSession.id } });
        return NextResponse.json({ orderNumber: result.order.orderNumber, orderId: result.order.id, invoiceToken, checkoutUrl: checkoutSession.url }, { status: 201 });
      } catch (stripeError) {
        await prisma.order.delete({ where: { id: result.order.id } }).catch(() => undefined);
        throw stripeError;
      }
    }

    const settings = await getSiteSettings();
    const invoiceUrl = `${origin}/order-confirmation?order=${encodeURIComponent(result.order.orderNumber)}&token=${encodeURIComponent(invoiceToken)}`;
    await sendOrderEmails({ order: result.order, invoiceUrl, settings }).catch((emailError) => {
      console.error('Order was created, but notification email failed:', emailError);
    });

    return NextResponse.json({ orderNumber: result.order.orderNumber, orderId: result.order.id, invoiceToken }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid order information.' }, { status: 400 });
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'This transaction ID has already been used. Check the ID or contact support.' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not place order.' }, { status: 500 });
  }
}
