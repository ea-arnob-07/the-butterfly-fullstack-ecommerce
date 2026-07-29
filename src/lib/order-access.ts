import { createHmac, timingSafeEqual } from 'node:crypto';

type OrderAccessIdentity = {
  id: string;
  orderNumber: string;
  customerEmail: string;
};

function accessSecret() {
  return process.env.JWT_SECRET || 'development-only-change-me';
}

function payload(order: OrderAccessIdentity) {
  return `${order.id}:${order.orderNumber}:${order.customerEmail.trim().toLowerCase()}`;
}

export function createOrderAccessToken(order: OrderAccessIdentity) {
  return createHmac('sha256', accessSecret()).update(payload(order)).digest('hex');
}

export function verifyOrderAccessToken(order: OrderAccessIdentity, token?: string | null) {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return false;
  const expected = Buffer.from(createOrderAccessToken(order), 'hex');
  const received = Buffer.from(token, 'hex');
  return expected.length === received.length && timingSafeEqual(expected, received);
}
