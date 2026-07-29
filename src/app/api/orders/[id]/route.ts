import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession, isAdminRole } from '@/lib/auth';

const finalStatuses = ['CANCELLED', 'RETURNED', 'REFUNDED'] as const;

const schema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional()
}).refine((value) => value.status || value.paymentStatus, { message: 'Nothing to update.' });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const input = schema.parse(await request.json());

    const order = await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({ where: { id }, include: { items: true } }) as any;
      if (!current) throw new Error('Order not found.');

      const nextStatus = input.status || current.status;
      const isMovingToFinal = finalStatuses.includes(nextStatus as (typeof finalStatuses)[number]);
      const isReactivating = current.stockRestored && !isMovingToFinal && current.stockDeducted;

      if (isMovingToFinal && current.stockDeducted && !current.stockRestored) {
        for (const item of current.items) {
          const variant = await tx.productVariant.findFirst({
            where: { productId: item.productId, size: item.size, color: item.color }
          });
          if (variant) {
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { increment: item.quantity } }
            });
          }
        }
      }

      if (isReactivating) {
        for (const item of current.items) {
          const variant = await tx.productVariant.findFirst({
            where: { productId: item.productId, size: item.size, color: item.color }
          });
          if (!variant || variant.stock < item.quantity) {
            throw new Error(`${item.name} does not have enough stock to reactivate this order.`);
          }
        }
        for (const item of current.items) {
          const variant = await tx.productVariant.findFirstOrThrow({
            where: { productId: item.productId, size: item.size, color: item.color }
          });
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: ({
          ...(input.status ? { status: input.status } : {}),
          ...(input.paymentStatus ? { paymentStatus: input.paymentStatus } : {}),
          ...(isMovingToFinal && current.stockDeducted && !current.stockRestored ? { stockRestored: true } : {}),
          ...(isReactivating ? { stockRestored: false } : {})
        } as any)
      });
    });

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid order update.' }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update order.' }, { status: 500 });
  }
}
