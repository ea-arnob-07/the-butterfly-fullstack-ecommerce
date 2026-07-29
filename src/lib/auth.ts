import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'butterfly_session';

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: string;
};

function secretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'development-only-change-me');
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  return payload as unknown as SessionPayload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function isAdminRole(role?: string) {
  return ['ADMIN', 'SUPER_ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'SUPPORT'].includes(role || '');
}
