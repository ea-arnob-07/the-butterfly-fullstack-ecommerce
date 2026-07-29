import { prisma } from '@/lib/prisma';

export async function finalizeStripeOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) throw new Error('Order not found.');
    if (order.paymentStatus === 'PAID') return order;

    for (const item of order.items) {
      const variant = await tx.productVariant.findFirst({
        where: { productId: item.productId, size: item.size, color: item.color }
      });
      if (!variant || variant.stock < item.quantity) {
        throw new Error(`${item.name} does not have enough stock to complete payment.`);
      }
    }

    for (const item of order.items) {
      const variant = await tx.productVariant.findFirstOrThrow({
        where: { productId: item.productId, size: item.size, color: item.color }
      });
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED', stockDeducted: true, stockRestored: false } as any
    });
  });
}
